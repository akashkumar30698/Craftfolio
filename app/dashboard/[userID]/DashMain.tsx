"use client"

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


const DashboardPage = () => {
    const { isSignedIn } = useUser()
    const router = useRouter()

    useEffect(()=>{
        if(!isSignedIn){
            router.push("/sign-in")
        }
    },[isSignedIn,router])


    return (
        <>
        <div>Dashboard Page</div>

        <SignedOut>
        <SignInButton />
        </SignedOut>
      
        <SignedIn>
        <UserButton />
        </SignedIn>
        </>
    )
}

export default DashboardPage