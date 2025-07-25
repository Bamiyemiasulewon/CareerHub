import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareerHub - Find Your Dream Job",
    short_name: "CareerHub",
    description: "Connect with top employers and discover career opportunities that match your ambitions.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/images/careerhub-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  }
}
