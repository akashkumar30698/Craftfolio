"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TextareaDemo } from "./textarea"
import { useFormContext } from "../context/formContext"

export function CardSection() {
  const { formData,updateFormData} = useFormContext()
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Your Full Name</Label>
              <Input id="name" value={formData.name || ''} onChange={(e) => updateFormData('name',e.target.value)} placeholder="Akash Kumar" required />
            </div>
        
            <div  className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Your Profession</Label>
            <Input id="profession" value={formData.profession || ''}  onChange={(e)=> updateFormData('profession',e.target.value)} placeholder="Software Developer"  required/>
            </div>

            <div className="flex flex-col space-y-1.5">
               <Label htmlFor="bio">Your Bio</Label>
               <TextareaDemo/>
            </div>

          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
    
      </CardFooter>
    </Card>
  )
}

////
// 
// <Label htmlFor="framework">Framework</Label>
<Select>
<SelectTrigger id="framework">
  <SelectValue placeholder="Select" />
</SelectTrigger>
<SelectContent position="popper">
  <SelectItem value="next">Next.js</SelectItem>
  <SelectItem value="sveltekit">SvelteKit</SelectItem>
  <SelectItem value="astro">Astro</SelectItem>
  <SelectItem value="nuxt">Nuxt.js</SelectItem>
</SelectContent>
</Select>


//<Button variant="outline">Cancel</Button>
//<Button>Deploy</Button>