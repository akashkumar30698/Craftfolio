// app/sign-in/[[...sign-in]]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContextApi } from "@/app/context/getContext";
import { useUser, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Signin = () => {
  const [clerkError, setClerkError] = useState<string>("");
  const router = useRouter();
  const { isLoggedIn,setIsLoggedIn } = useContextApi()
  const { isSignedIn, user, isLoaded } = useUser();

  // Wait until Clerk has finished loading before checking isSignedIn
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Redirect user to their dashboard if signed in
      console.log("User signed in, redirecting...");
      setIsLoggedIn(true)
      router.push(`/dashboard/${user.id}`);
    }
  }, [isSignedIn, user, isLoaded, router]); // Ensure useEffect runs when the user or isLoaded changes

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
     { 
      !isLoggedIn && (
        <div>
        <h1>Login</h1>
        <p>Welcome to the login page!</p>
  
        <div className="flex">
          <SignedOut>
            <SignInButton />
          </SignedOut>
  
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
  
        {/* Optionally handle Clerk error display */}
        {clerkError && <p className="error">{clerkError}</p>}
      </div>
      )
     }
    </>

   
 
  );
};

export default Signin;
