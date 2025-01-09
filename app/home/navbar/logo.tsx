"use client"

import React from 'react';
import { motion } from 'framer-motion';

interface PortfolioBuilderLogoProps {
  width?: number;
  height?: number;
}

export const PortfolioBuilderLogo: React.FC<PortfolioBuilderLogoProps> = ({
  width = 200,
  height = 200,
}) => {
  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#404040" />
        </linearGradient>
      </defs>

      {/* Main 'P' shape with rounded corners and gradient */}
      <motion.path
        d="M50 30 H150 A20 20 0 0 1 170 50 V80 A20 20 0 0 1 150 100 H70 V170"
        stroke="url(#gradient)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Building blocks with staggered animation */}
      {[
        { x: 90, y: 120 },
        { x: 125, y: 120 },
        { x: 90, y: 155 },
        { x: 125, y: 155 }
      ].map((block, index) => (
        <motion.rect
          key={index}
          x={block.x}
          y={block.y}
          width="30"
          height="30"
          fill="url(#gradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
        />
      ))}
      
      {/* Connecting lines with draw animation */}
      {[
        { x1: 105, y1: 100, x2: 105, y2: 120 },
        { x1: 140, y1: 100, x2: 140, y2: 120 }
      ].map((line, index) => (
        <motion.line
          key={index}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#gradient)"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
      ))}

      {/* Decorative circles */}
      <motion.circle cx="50" cy="30" r="5" fill="url(#gradient)" 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      />
      <motion.circle cx="170" cy="80" r="5" fill="url(#gradient)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
      />
      <motion.circle cx="70" cy="170" r="5" fill="url(#gradient)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.7, type: "spring", stiffness: 200 }}
      />
    </motion.svg>
  );
};

