"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormContext } from '../context/formContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { PlusCircle, X } from 'lucide-react'

interface SocialLink {
    id: string
    platform: string
    url: string
}

interface SubmitButtonProps {
    isSubmitting: boolean
}
  

const commonPlatforms = ['linkedIn', 'github']

export default function SocialMediaLinksForm({ isSubmitting }: SubmitButtonProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
        commonPlatforms.map(platform => ({ id: platform.toLowerCase(), platform, url: '' }))
    )
    const [customLinks, setCustomLinks] = useState<SocialLink[]>([])
    const { formData, updateFormData } = useFormContext()

    useEffect(()=>{
      updateFormData("socialLinks", socialLinks)

    },[socialLinks])

    const handleLinkChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setSocialLinks(links =>
            links.map(link => link.id === id ? { ...link, [name]: value } : link)
        )
    }

    const handleCustomLinkChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCustomLinks(links =>
            links.map(link => link.id === id ? { ...link, [name]: value } : link)
        )
    }

    const addCustomLink = () => {
        const newId = `custom-${Date.now()}`
        setCustomLinks([...customLinks, { id: newId, platform: '', url: '' }])
    }

    const removeCustomLink = (id: string) => {
        setCustomLinks(links => links.filter(link => link.id !== id))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const allLinks = [...socialLinks, ...customLinks]
        const validLinks = allLinks.filter(link => link.url.trim() !== '')
        console.log('Social Media Links:', validLinks)
        // Here you would typically send this data to your backend
        // await fetch('/api/social-links', { method: 'POST', body: JSON.stringify(validLinks) })

        // alert('Social media links submitted successfully!')
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Add your social media profile links</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">

                    {socialLinks.map((link) => (
                        <div key={link.id} className="flex flex-col space-y-1.5 mb-3">
                            <Label htmlFor={link.id}>{link.platform}</Label>
                            <Input
                                id={link.id}
                                name="url"
                                type="url"
                                value={link.url}
                                onChange={(e) => handleLinkChange(link.id, e)}
                                placeholder={`https://${link.platform}/profile.com`}
                            />
                        </div>
                    ))}

                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="photo">Enter Your Email</Label>
                        <Input id="email" type='email' name="email" value={formData.email || ''} onChange={(e) => updateFormData('email', e.target.value)} placeholder='abc@gmail.com' required />
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}


