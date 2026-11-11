import { ImageResponse } from "next/og";
import { BRAND, THEME } from "@/presets";
import { THEMES } from "@/lib/themes";

// Favicon generated at build time from the brand initial and the theme colour, so it matches any preset.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: THEMES[THEME].deep, borderRadius: 18, color: "#ffffff", fontSize: 40, fontWeight: 700 }}>
        {BRAND.name.charAt(0).toUpperCase()}
      </div>
    ),
    size,
  );
}
