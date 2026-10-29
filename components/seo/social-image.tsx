export function SocialImageArtwork() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#090f19",
        color: "#ffffff",
        padding: "72px 80px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          right: -130,
          top: -220,
          borderRadius: 560,
          background:
            "radial-gradient(circle, rgba(54,209,220,0.62) 0%, rgba(91,134,229,0.28) 46%, rgba(9,15,25,0) 72%)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 23,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#9ce8eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 14,
            background: "#36d1dc",
            color: "#090f19",
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          JMC
        </div>
        Jordan Marketing Consultants
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            maxWidth: 940,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
          }}
        >
          SEO work you can see and reporting you can verify.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 29,
            color: "#c7d0dd",
          }}
        >
          Houston-area SEO, based in League City, Texas
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: 8,
          borderRadius: 8,
          background: "linear-gradient(90deg, #36d1dc 0%, #5b86e5 100%)",
        }}
      />
    </div>
  );
}
