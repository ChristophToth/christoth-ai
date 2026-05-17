import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chris Toth - AI Adoption & Workforce Transformation",
    short_name: "Chris Toth",
    description:
      "A personal brand site focused on enterprise AI adoption, workforce transformation, and behavior change.",
    start_url: "/",
    display: "standalone",
    background_color: "#050507",
    theme_color: "#050507",
  };
}
