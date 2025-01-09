"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "../context/formContext"



export default function AboutMeSection(){
  const { formData, updateFormData } = useFormContext()
return (
    <>
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">

          <div className="flex flex-col space-y-1.5">
               <Label htmlFor="aboutMe">Briefly Write About Yourself</Label>
               <Textarea value={formData.aboutMe || ''} onChange={(e) => updateFormData("aboutMe",e.target.value)} placeholder="Type Here"  required/>
            </div>


            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="resume">Upload Your Resume</Label>
              <Input type="file" id="resume" name="resume" value={formData.resume || ''} onChange={(e) => updateFormData("resume",e.target.value)} accept="image/*,.pdf" required />
              </div>
        
            <div  className="flex flex-col space-y-1.5">
            <Label htmlFor="photo">Choose your profile picture</Label>
            <Input type="file" id="photo" name="photo" value={formData.photo || ''} onChange={(e) => updateFormData("photo",e.target.value)}  accept="image/png, image/jpeg"  required/>
            </div>



          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
    
      </CardFooter>
      </Card>
    </>
)
}