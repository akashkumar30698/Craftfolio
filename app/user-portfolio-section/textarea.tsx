"use client"

import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "../context/formContext"

export function TextareaDemo() {
  const { formData,updateFormData } = useFormContext()
  return <Textarea value={formData.bio || ''} onChange={(e)=> updateFormData('bio',e.target.value)} placeholder="Hi, I am a Software Developer" required />
}
