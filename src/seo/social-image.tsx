import { ImageResponse } from "next/og"

export const createSocialImage = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#0d0e12",
        color: "#f6f6f8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#ef4435",
          display: "flex",
          height: "10px",
          width: "128px",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            fontSize: "68px",
            fontWeight: 700,
            letterSpacing: "-2px",
            lineHeight: 1.05,
          }}
        >
          Muhammad Azlaan Zubair
        </div>
        <div
          style={{
            color: "#b4b5be",
            fontSize: "34px",
            lineHeight: 1.2,
          }}
        >
          Software Engineer · Researcher
        </div>
      </div>
      <div
        style={{
          color: "#ef4435",
          display: "flex",
          fontSize: "24px",
          letterSpacing: "2px",
        }}
      >
        MDAZLAANZUBAIR.COM
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
