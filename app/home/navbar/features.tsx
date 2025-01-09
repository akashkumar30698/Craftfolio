"use client"


import React from "react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

const SkeletonOne = dynamic(() => import("./client-components").then(mod => mod.SkeletonOne), { ssr: false })
const SkeletonTwo = dynamic(() => import("./client-components").then(mod => mod.SkeletonTwo), { ssr: false })

const features = [
  {
    title: "Create stunning portfolios",
    description: "Design and customize your portfolio with our intuitive drag-and-drop interface and pre-designed templates.",
    skeleton: SkeletonOne,
    className: "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
  },
  {
    title: "Showcase your projects",
    description: "Highlight your best work with beautiful project galleries and detailed case studies.",
    skeleton: SkeletonTwo,
    className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
  },

]

export function FeaturesSection() {
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Packed with thousands of features
        </h4>
        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          From designing your portfolio to deploying it on Vercel, our platform provides everything you need to showcase your work professionally and efficiently.
        </p>
      </div>
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">
                <feature.skeleton />
              </div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  )
}

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  )
}

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  )
}

