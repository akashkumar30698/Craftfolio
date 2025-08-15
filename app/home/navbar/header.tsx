"use client";

import { useState, useCallback,useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackgroundLines } from "@/components/ui/background-lines";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Loader2 } from "lucide-react";

export function Header() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


   // Prefetch the preview page for faster navigation
  useEffect(() => {
    router.prefetch("/preview");
  }, [router]);

  // useCallback prevents function recreation on every render
  const handleStartClick = useCallback(() => {
    if (isLoading) return; // avoid double triggers
    setIsLoading(true);

    // Navigate immediately (faster UX) but still show loader
    router.push("/preview");
  }, [isLoading, router]);

  return (
    <header className="headerBg">
      <BackgroundLines className="flex flex-col items-center justify-center w-full px-4 text-center">
        <h1 className="relative z-20 bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white bg-clip-text text-transparent text-2xl md:text-4xl lg:text-7xl font-bold tracking-tight py-2 md:py-10">
          Design. Build. Showcase. <br /> Portfolios That Inspire.
        </h1>

        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400">
          Unlock your creative potential with templates designed for artists,
          developers, and creators. Showcase your story, skills, and vision
          effortlessly.
        </p>

        <RainbowButton onClick={handleStartClick} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-label="Loading" />
          ) : (
            "Get Started"
          )}
        </RainbowButton>
      </BackgroundLines>
    </header>
  );
}
