"use client"


import { SignInButton, SignedIn, UserButton, SignedOut } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import {  useRouter } from "next/navigation"

const DashboardPage: React.FC = () => {
    const { isSignedIn } = useUser()
    const router = useRouter()

    useEffect(()=>{
        if(!isSignedIn){
            router.push("/sign-in")
        }

    },[isSignedIn])


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