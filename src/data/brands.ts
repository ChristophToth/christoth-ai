export type Brand = {
  name: string;
  /** Path under /public — served at this URL by Next.js. */
  logo: string;
  /** Hex color the logo fades to on hover. Ignored for the AT&T "Now" treatment. */
  color: string;
  /** width / height of the SVG viewBox — used to size the masked element. */
  ratio: number;
};

export type BrandPhase = {
  id: string;
  label: string;
  current?: boolean;
  brands: Brand[];
};

export const BRAND_PHASES: BrandPhase[] = [
  {
    id: "01",
    label: "Phase 01",
    brands: [
      { name: "FOX Broadcasting", logo: "/logos/fox-broadcasting.svg", color: "#003478", ratio: 1 },
      { name: "Hyundai",          logo: "/logos/hyundai.svg",          color: "#002C5F", ratio: 1 },
      { name: "UPS Store",        logo: "/logos/ups-store.svg",        color: "#FFB500", ratio: 1 },
      { name: "ABC Studios",      logo: "/logos/abc-studios.svg",      color: "#FFC72C", ratio: 2.75 },
    ],
  },
  {
    id: "02",
    label: "Phase 02",
    brands: [
      { name: "VH1",                     logo: "/logos/vh1.svg",                     color: "#FF6B00", ratio: 2.75 },
      { name: "Warner Bros. Studios",    logo: "/logos/warner-bros.svg",             color: "#FACC15", ratio: 5.75 },
      { name: "Sony Television Studios", logo: "/logos/sony.svg",                    color: "#5BC0EB", ratio: 1 },
      { name: "FOX Sports",              logo: "/logos/fox-sports.svg",              color: "#FFCC00", ratio: 4.5 },
    ],
  },
  {
    id: "03",
    label: "Phase 03",
    brands: [
      { name: "Samsung",    logo: "/logos/samsung.svg",    color: "#1428A0", ratio: 1 },
      { name: "Activision", logo: "/logos/activision.svg", color: "#5BC0EB", ratio: 1 },
      { name: "Snapchat",   logo: "/logos/snapchat.svg",   color: "#FFFC00", ratio: 1 },
      { name: "Airbnb",     logo: "/logos/airbnb.svg",     color: "#FF5A5F", ratio: 1 },
    ],
  },
  {
    id: "04",
    label: "Phase 04",
    brands: [
      { name: "Universal Music Group", logo: "/logos/universal-music-group.svg", color: "#1BB6E8", ratio: 7.75 },
    ],
  },
  {
    id: "now",
    label: "Now",
    current: true,
    brands: [
      { name: "AT&T", logo: "/logos/att.svg", color: "#7C5CFF", ratio: 3.25 },
    ],
  },
];
