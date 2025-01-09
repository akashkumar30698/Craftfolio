"use client"

import React, { useId } from "react"

export const Grid = ({
  pattern,
  size,
  index,
}: {
  pattern?: number[][]
  size?: number
  index: number
}) => {
  // Use a deterministic pattern based on the index
  const p = pattern ?? [
    [(index * 3 + 7) % 11, (index * 2 + 1) % 7],
    [(index * 5 + 7) % 11, (index * 3 + 1) % 7],
    [(index * 7 + 7) % 11, (index * 5 + 1) % 7],
    [(index * 11 + 7) % 11, (index * 7 + 1) % 7],
    [(index * 13 + 7) % 11, (index * 11 + 1) % 7],
  ]

  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  )
}

export function GridPattern({ width, height, x, y, squares, ...props }) {
  const patternId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}

