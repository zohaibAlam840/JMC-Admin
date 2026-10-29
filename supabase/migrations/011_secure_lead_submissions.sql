-- ============================================================================
--  JMC — secure public lead submissions and delivery state
--
--  Run once on an existing project before deploying the matching application
--  code. Safe to run again. Public visitors lose direct table INSERT access;
--  only the server-side service role can call the narrow function below.
-- ============================================================================

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

alter table public.leads
  add column if not exists submission_id uuid default gen_random_uuid(),
  add column if not exists lead_type text default 'visibility_review',
  add column if not exists google_business_profile_url text,
  add column if not exists notification_status text default 'pending',
  add column if not exists notification_message_id text,
  add column if not exists notification_error text,
  add column if not exists notification_attempted_at timestamptz;

-- Classify rows captured before this migration as accurately as the old fields
-- allow, then make the new fields reliable for all future code.
update public.leads
set lead_type = case
  when lower(coalesce(service, '')) like '%sprint%' then 'sprint_consultation'
  when lower(coalesce(source_cta, '')) like '%audit%' then 'gbp_audit'
  else 'visibility_review'
end
where lead_type is null or lead_type = 'visibility_review';

update public.leads
set
  submission_id = coalesce(submission_id, gen_random_uuid()),
  notification_status = coalesce(notification_status, 'pending');

alter table public.leads
  alter column submission_id set default gen_random_uuid(),
  alter column submission_id set not null,
  alter column lead_type set default 'visibility_review',
  alter column lead_type set not null,
  alter column notification_status set default 'pending',
  alter column notification_status set not null;

create unique index if not exists leads_submission_id_idx
  on public.leads (submission_id);

do $$ begin
  alter table public.leads add constraint leads_type_check
    check (lead_type in ('visibility_review', 'sprint_consultation', 'gbp_audit'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.leads add constraint leads_notification_status_check
    check (notification_status in ('pending', 'sent', 'failed', 'not_configured'));
exception when duplicate_object then null; end $$;

create table if not exists private.lead_rate_limits (
  key_hash          text primary key check (key_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count     integer not null check (request_count > 0),
  updated_at        timestamptz not null default now()
);

create index if not exists lead_rate_limits_updated_idx
  on private.lead_rate_limits (updated_at);

revoke all on table private.lead_rate_limits from public, anon, authenticated;

drop policy if exists leads_public_insert on public.leads;
revoke insert on table public.leads from public, anon;

create or replace function public.submit_lead(
  p_rate_key text,
  p_submission_id uuid,
  p_lead_type text,
  p_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_website text,
  p_google_business_profile_url text,
  p_message text,
  p_page_path text,
  p_source_cta text,
  p_tier text
)
returns table (accepted boolean, reason text, lead_id uuid)
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $function$
declare
  v_now timestamptz := statement_timestamp();
  v_count integer;
  v_lead_id uuid;
  v_service text;
begin
  if p_rate_key is null
     or p_rate_key !~ '^[0-9a-f]{64}$'
     or p_submission_id is null
     or p_lead_type is null
     or p_lead_type not in ('visibility_review', 'sprint_consultation', 'gbp_audit')
     or btrim(coalesce(p_email, '')) = ''
     or btrim(coalesce(p_company, '')) = ''
     or btrim(coalesce(p_email, ''))
        !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'
     or (p_lead_type <> 'gbp_audit' and btrim(coalesce(p_name, '')) = '')
     or (p_lead_type <> 'gbp_audit' and btrim(coalesce(p_message, '')) = '')
     or (p_lead_type = 'gbp_audit' and btrim(coalesce(p_website, '')) = '')
     or char_length(coalesce(p_name, '')) > 120
     or char_length(coalesce(p_email, '')) > 254
     or char_length(coalesce(p_phone, '')) > 32
     or char_length(coalesce(p_company, '')) > 160
     or char_length(coalesce(p_website, '')) > 2048
     or char_length(coalesce(p_google_business_profile_url, '')) > 2048
     or char_length(coalesce(p_message, '')) > 5000
     or char_length(coalesce(p_page_path, '')) > 256
     or char_length(coalesce(p_source_cta, '')) > 160
     or (
       p_tier is not null
       and p_tier not in (
         'neighborhood', 'citywide', 'metro', 'regional', 'national', 'national-plus'
       )
     )
  then
    return query select false, 'invalid'::text, null::uuid;
    return;
  end if;

  insert into private.lead_rate_limits as limits (
    key_hash,
    window_started_at,
    request_count,
    updated_at
  )
  values (p_rate_key, v_now, 1, v_now)
  on conflict (key_hash) do update
  set
    window_started_at = case
      when limits.window_started_at <= v_now - interval '15 minutes' then v_now
      else limits.window_started_at
    end,
    request_count = case
      when limits.window_started_at <= v_now - interval '15 minutes' then 1
      when limits.request_count >= 1000000 then 1000000
      else limits.request_count + 1
    end,
    updated_at = v_now
  returning request_count into v_count;

  if v_count > 5 then
    return query select false, 'rate_limited'::text, null::uuid;
    return;
  end if;

  v_service := case p_lead_type
    when 'visibility_review' then 'Visibility Review'
    when 'sprint_consultation' then 'Launch Sprint'
    when 'gbp_audit' then 'Free Visibility Audit'
  end;

  begin
    insert into public.leads (
      submission_id,
      lead_type,
      name,
      email,
      phone,
      company,
      website,
      google_business_profile_url,
      service,
      message,
      page_path,
      source_cta,
      tier,
      notification_status
    )
    values (
      p_submission_id,
      p_lead_type,
      btrim(coalesce(p_name, '')),
      lower(btrim(p_email)),
      nullif(btrim(coalesce(p_phone, '')), ''),
      btrim(p_company),
      nullif(btrim(coalesce(p_website, '')), ''),
      nullif(btrim(coalesce(p_google_business_profile_url, '')), ''),
      v_service,
      nullif(btrim(coalesce(p_message, '')), ''),
      nullif(btrim(coalesce(p_page_path, '')), ''),
      nullif(btrim(coalesce(p_source_cta, '')), ''),
      nullif(btrim(coalesce(p_tier, '')), ''),
      'pending'
    )
    returning id into v_lead_id;
  exception when unique_violation then
    return query select false, 'duplicate'::text, null::uuid;
    return;
  end;

  -- Keep the private rate table bounded without a separate scheduled job.
  delete from private.lead_rate_limits
  where updated_at < v_now - interval '24 hours';

  return query select true, 'accepted'::text, v_lead_id;
end
$function$;

revoke all on function public.submit_lead(
  text, uuid, text, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.submit_lead(
  text, uuid, text, text, text, text, text, text, text, text, text, text, text
) to service_role;
