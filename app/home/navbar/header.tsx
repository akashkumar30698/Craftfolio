import React, { useState } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'


export function Header() {

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleStartClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/preview")
    }, 2000)
  }
  return (

    <>


      <div className="headerBg">
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            Design. Build. Showcase. <br /> Portfolios That Inspire.
          </h2>
          <p className="max-w-xl marginBg mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
            Unlock your creative potential with templates designed for artists, developers, and creators. Showcase your story, skills, and vision effortlessly.

          </p>
          <RainbowButton onClick={handleStartClick}>{
            isLoading ? (
              <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              </>
            ) : (
              <>
              <div>
                Get Started
              </div>
              </>
            )
          }
          </RainbowButton>
        </BackgroundLines>




      </div>



    </>



  );
}
