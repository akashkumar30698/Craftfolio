"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const BackgroundLines = ({
  children,
  className,

}: {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-black",
        className
      )}
    >
      {children}
    </div>
  );
};



