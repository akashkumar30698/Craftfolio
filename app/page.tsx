"use client"

import React from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,

} from "@nextui-org/react";
import { Header } from "./home/navbar/header"
import { Scroll } from "./home/navbar/scroll";
import { FeaturesSection } from "./home/navbar/features";
import { FeaturesCard } from "./home/navbar/featuresCard";
import Footer from "./home/navbar/footer";
import { PortfolioBuilderLogo } from "./home/navbar/logo";
import ShinyButton from "@/components/ui/shiny-button";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useContextApi } from "@/app/context/getContext";
import { Loader2 } from 'lucide-react'
import { useRouter } from "next/navigation";




export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [signUPLoading,setSignUPLoading] = useState<boolean>(false)

  

  const router = useRouter();
  const {  setIsLoggedIn } = useContextApi()
  const { isSignedIn, user, isLoaded } = useUser();

  // Wait until Clerk has finished loading before checking isSignedIn
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Redirect user to their dashboard if signed in
      setIsLoggedIn(true)
      router.push(`/preview`);
    }
  }, [isSignedIn, user, isLoaded, router]); // Ensure useEffect runs when the user or isLoaded changes

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return <p></p>;
  }
  const handleLoginClick = () => {
    setIsLoading(true);

    // Simulate loading and then redirect
    setTimeout(() => {
      router.push("/sign-in"); // Redirect to sign-in page
    }, 2000);
  };

  const handleSignUpClick = () =>{
    setSignUPLoading(true);

    // Simulate a delay for loading (e.g., API call, authentication, etc.)
    setTimeout(() => {
        router.push("/sign-up")
      // Perform login action or redirect here
    }, 2000);
  }



  return (
    <>
      <Navbar className="hello Navbar" isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
    

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <p className="font-bold text-inherit"></p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className=" sm:flex gap-4" justify="center">
          <NavbarBrand>
            <PortfolioBuilderLogo width={36} height={36} />
            <p className="font-bold text-inherit"></p>
          </NavbarBrand>
          <NavbarItem>

          </NavbarItem>
          <NavbarItem isActive>

          </NavbarItem>
          <NavbarItem>

          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="">

            {
              !isSignedIn && (
                  <ShinyButton onClick={handleLoginClick}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <div>Login</div>
                    )}
                  </ShinyButton>
              )
            }

          </NavbarItem>
          <NavbarItem>
            {
              !isSignedIn && (
                 <ShinyButton onClick={handleSignUpClick}>
                    {
                      signUPLoading?(
                         <>
                         <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                         </>
                      ) : (
                        <>
                        <div>SIGN UP</div>
                        </>
                      )
                    }
                  </ShinyButton>
              )
            }

          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
            <NavbarMenuItem >
              
                {
                  !isSignedIn && (
                    <>
                    <Link href="/sign-in" >Login</Link>
                    </>

                  )
                  
                }
              
            </NavbarMenuItem>
          
        </NavbarMenu>
      </Navbar>

      <Header />
      <Scroll />
      <FeaturesSection />
      <FeaturesCard />
      <Footer />

    </>


  );
}

