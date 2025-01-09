"use client"

import React from "react"
import { Grid } from "./Grid"

const grid = [
  {
    title: "Customizable Templates",
    description:
      "Choose from a wide range of professionally designed templates to kickstart your portfolio creation process.",
  },
  {
    title: "Drag-and-Drop Editor",
    description:
      "Easily customize your portfolio with our intuitive drag-and-drop interface, no coding skills required.",
  },
  {
    title: "Project Showcases",
    description:
      "Highlight your best work with dedicated project pages, including images, descriptions, and links.",
  },
  {
    title: "Responsive Design",
    description:
      "Ensure your portfolio looks great on all devices with our mobile-first, responsive design approach.",
  },
  {
    title: "SEO Optimization",
    description:
      "Boost your online visibility with built-in SEO tools and best practices for better search engine rankings.",
  },
  {
    title: "One-Click Vercel Deployment",
    description:
      "Deploy your portfolio to Vercel's global CDN with just one click, ensuring fast load times worldwide.",
  },
  {
    title: "Custom Domains",
    description:
      "Connect your own domain name to your portfolio for a professional and branded online presence.",
  },
  {
    title: "Analytics Integration",
    description:
      "Track your portfolio's performance with built-in analytics, providing insights on visitors and engagement.",
  },
]

export function FeaturesCard() {
  return (
    <div className="py-20 lg:py-40">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
        {grid.map((feature, index) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
          >
            <Grid size={20} index={index} />
            <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
              {feature.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

