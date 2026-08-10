import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/admin/guard";
import { signOut } from "../actions";

/**
 * Everything behind this layout requires an admin. The check runs here and
 * again in each Server Action — a layout guard protects what is rendered, not
 * what can be posted to.
 */
export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminShell
      email={admin.email}
      role={admin.role === "owner" ? "Owner" : "Editor"}
      signOutAction={signOut}
    >
      {children}
    </AdminShell>
  );
}
