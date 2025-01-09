"use client"



import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "./accordion"
import { PortfolioBuilderLogo } from "../home/navbar/logo"
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";


export default function Sidebar({ children }: { children: React.ReactNode }) {

  const { isSignedIn } = useUser()
  const { signOut } = useAuth();

  const handleLogout = async () => {

    if(isSignedIn){
      await signOut();
      // Redirect the user or show a confirmation message after logout
      window.location.href = "/";
    }

  };




  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:block widthLarge lg:shrink-0 lg:border-r lg:bg-gray-100 dark:lg:bg-gray-800">
        <div className="flex h-full flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            <Link href="#" className="flex items-center gap-2 font-bold" prefetch={false}>
              <PortfolioBuilderLogo width={36} height={36}/>
              <span className="text-lg"></span>
            </Link>
            <nav className="space-y-1">
              
                 <DashboardSidebar />
                
            </nav>
          </div>
          <div className="space-y-4">
            <Button variant="outline" onClick={handleLogout} size="sm" className="w-full">
               { isSignedIn? (
                <>
                <div>
                  Log out
                </div>
                </>
               ) :(
                <>
                <Link href="/sign-in">
                  Login
                </Link>
                </>
               )}
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <GlobeIcon className="h-5 w-5" />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
      
        <main className="flex">
         { children }
        </main>
      </div>
    </div>
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





