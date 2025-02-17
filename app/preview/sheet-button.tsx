"use client"


import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { DashboardSidebar } from "./accordion"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";


export function SheetButton() {
  const { isSignedIn } = useUser()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    if(isSignedIn){
      await signOut();
      // Redirect the user or show a confirmation message after logout
      window.location.href = "/";
    }
  };

  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button className="showOnMobile hello"  variant="outline" size="icon">
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle navigation</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[29rem]"
    >
      <div className="flex h-full flex-col justify-between py-6 px-4">
        <div className="space-y-6">
          <nav className="space-y-1">
            <DashboardSidebar />
          </nav>
        </div>
        <div className="space-y-4">
          <Button variant="outline" onClick={handleLogout} size="sm" className="w-full">
            { 
              isSignedIn? (
              <>
              <div>
                Log out
              </div>
              </>
             ) : (
              <>
              <Link href="/sign-in">
                Login
              </Link>
              </>
             )
               }
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <GlobeIcon className="h-5 w-5" />
            <span>English</span>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
  )
}

function MenuIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    )
  }


  
function GlobeIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    )
  }