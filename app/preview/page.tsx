'use client'

import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./accordion"
import { SidebarInset } from "@/components/ui/sidebar"
import { RealTimeHtml } from "./realTimeHtml"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FontStylerAccordion from "./fontStyleAccordion"
import Sidebar from "./sidebar"
import { SheetButton } from "./sheet-button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState,useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { useFormContext } from "../context/formContext"
import { createRandomId } from "@/lib/utils"
import { Loader2 } from 'lucide-react'
import { RainbowButton } from "@/components/ui/rainbow-button"


interface IUser {
  name: string;
  email: string;
  profession: string;
  bio: string;
  aboutMe: string;
  photo: string;
  resume: string;
  projects: string[];
  skills: string[];
  socialLinks: {
    [key: string]: string;
  };
  initiatingUser: boolean;
  randomId: string;
}



export default function DashboardPage() {
  const router = useRouter()
  const { formData } = useFormContext()
  const [loading,setLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(()=>{
    localStorage.removeItem('deployId')
  },[searchParams])

  




  const handleClick = () => {

    setLoading(true)
    const requiredFields: (keyof IUser)[] = [
      'name', 'email', 'profession', 'bio', 'aboutMe', 'photo', 'resume', 'projects', 'skills', 'socialLinks'
    ]

    const emptyFields = requiredFields.filter(field => {
      if (field === 'projects' || field === 'skills') {
        return !Array.isArray(formData[field]) || formData[field].length === 0
      }
      if (field === 'socialLinks') {
        return !formData[field] || Object.keys(formData[field]).length === 0
      }
      return !formData[field] || formData[field] === ''
    })

     // else if (typeof formData.initiatingUser !== 'boolean') {
     // toast({
     //   title: 'Invalid field',
     //  description: 'The initiatingUser field must be a boolean',
     // })

    if (emptyFields.length > 0) {
      setLoading(false)
      toast({
        title: 'Missing fields',
        description: `The following fields are required: ${emptyFields.join(', ')}`,
      })
    }
    else {
      // All fields are filled and valid, proceed to deployment page
      router.push(`/deployment?deployId=${createRandomId(8)}`)
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarInset className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col p-4">
              <Tabs defaultValue="mobile" className="flex-1 flex flex-col">
                {/* Center Tabs and FontStylerAccordion */}
                <div className="flex justify-between justifyView items-center space-x-4 mb-4">
                  <SheetButton />
                  <div className="flex flex-1 justify-center items-center space-x-4">
                    <div className="mobileView">
                      <TabsList>
                        <TabsTrigger value="laptop">Mobile</TabsTrigger> { /* Existing bug for mobile and Laptop view */}
                        <TabsTrigger value="mobile">Laptop</TabsTrigger>
                      </TabsList>
                    </div>

                    <FontStylerAccordion />
                  </div>
                  {/* Align VercelButton to the right */}
                  <div className="flex items-center">
                    <RainbowButton disabled={loading} onClick={handleClick}>{ loading? (
                      <>
                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      </>
                    ) : (
                      <>
                      <div>Deploy</div>
                      </>
                    )}
                    
                    </RainbowButton>
                  </div>
                </div>

                 <TabsContent value="mobile" className="flex-1 overflow-auto">
                  <RealTimeHtml device="mobile" />
                 </TabsContent>
                 <TabsContent value="laptop" className="flex-1 overflow-auto">
                  <RealTimeHtml device="laptop" />
                 </TabsContent>

              </Tabs>
            </div>
          </SidebarInset>
        </Sidebar>
      </div>

    </SidebarProvider>

  )
}

