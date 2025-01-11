'use client'

import * as React from 'react'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    
    SidebarContent
    
} from "@/components/ui/sidebar"
import { useFormContext } from "../context/formContext"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useIframeRef } from './realTimeHtml'
import ColorPickerComp from './Color'
import Image from 'next/image'



interface ProjectData {
    id: string
    title: string
    description: string
    photo: File | null,
    repoLink: string,
    liveLink: string
}

interface SocialLink {
    id: string
    platform: string
    url: string
}

const predefinedSkills = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "javascript", label: "JAVASCRIPT" },
    { id: "react", label: "REACT" },
    { id: "next.js", label: "NEXT.JS" },
    { id: "c", label: "C" },
    { id: "c++", label: "C++" },
    { id: "java", label: "JAVA" },
    { id: "typescript", label: "TYPESCRIPT" },
    { id: "ruby", label: "RUBY" },
    { id: "golang", label: "GOLANG" },
    { id: "php", label: "PHP" },
    { id: "python", label: "PYTHON" },
    { id: "scala", label: "SCALA" },
    { id: "swift", label: "SWIFT" },
    { id: "c#", label: "C#" },
    { id: "rust", label: "RUST" },
    { id: "redux", label: "REDUX" },
    { id: "angular.js", label: "ANGULAR.JS" },
    { id: "svelte", label: "SVELTE" },
    { id: "vue.js", label: "VUE.JS" },
    { id: "tailwind css", label: "TAILWIND CSS" },
    { id: "bootstrap", label: "BOOTSTRAP" },
    { id: "node.js", label: "NODE.JS" },
    { id: "express.js", label: "EXPRESS.JS" },
    { id: "apache kafka", label: "APACHE KAFKA" },
    { id: "nginx", label: "NGINX" },
    { id: "springboot", label: "SPRINGBOOT" },
    { id: "nest", label: "NEST" },
    { id: "flutter", label: "FLUTTER" },
    { id: "reactNative", label: "REACT NATIVE" },
    { id: "kotlin", label: "KOTLIN" },
    { id: "mongodb", label: "MONGODB" },
    { id: "redis", label: "REDIS" },
    { id: "my sql", label: "MY SQL" },
    { id: "postgresql", label: "POSTGRESQL" },
    { id: "cassandra db", label: "CASSANDRA DB" },
    { id: "aws", label: "AWS" },
    { id: "docker", label: "DOCKER" },
    { id: "kubernetes", label: "KUBERNETES" },
    { id: "jenkins", label: "JENKINS" },
    { id: "microsoft azure", label: "MICROSOFT AZURE" },
    { id: "firebase", label: "FIREBASE" },
    { id: "supabase", label: "SUPABASE" },
    { id: "django", label: "DJANGO" },
    { id: "flask", label: "FLASK" },
    { id: "electron.js", label: "ELECTRON.JS" }
]

const commonPlatforms = ['LinkedIn', 'Github']

export function DashboardSidebar() {
    const [isCollapsed ] = React.useState(false)
    const { formData, updateFormData,selectedSkills ,setSelectedSkills } = useFormContext()
    const [projects, setProjects] = useState<ProjectData[]>([
        { id: '1', title: '', description: '', photo: null, repoLink: '', liveLink: '' },
        { id: '2', title: '', description: '', photo: null, repoLink: '', liveLink: '' },
        { id: '3', title: '', description: '', photo: null, repoLink: '', liveLink: '' }
    ])
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
        commonPlatforms.map(platform => ({ id: platform.toLowerCase(), platform, url: '' }))
    )

    const iframeRef = useIframeRef()

    useEffect(() => {
        updateFormData("socialLinks", socialLinks)
    }, [socialLinks])

    const handleLinkChange = (id: string, e) => {
        const { name, value } = e.target

        setSocialLinks(links =>
            links.map(link => link.id === id ? { ...link, [name]: value } : link)
        )
    }

    const handleInputChange = (id: string, e) => {
        const { name, value } = e.target
        setProjects(projects.map(project =>
            project.id === id ? { ...project, [name]: value } : project
        ))
    }

    const handlePhotoChange = (id: string, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setProjects(projects.map(project =>
                project.id === id ? { ...project, photo: file } : project
            ))

        }
    }

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            updateFormData("photo", file);
        }
    };

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            updateFormData("resume", file);


          // Convert file to base64
          const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                // Send file data to iframe
                iframeRef?.current?.contentWindow?.postMessage({
                    type: 'FILE_TRANSFER',
                    fileName: file.name,
                    fileType: file.type,
                    fileData: base64
                }, '*');
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        updateFormData("projects", projects)
    }, [projects])

    const handleSkillChange = (skill: string, checked: boolean) => {
        setSelectedSkills((prev) =>
            checked ? [...prev, skill] : prev.filter((s) => s !== skill)
        );
        updateFormData("skills", checked ? [...selectedSkills, skill] : selectedSkills.filter((s) => s !== skill));
    };

    return (
        <>
            <SidebarContent>
                <ScrollArea className="h-[calc(100vh-10rem)] px-1">
                    <div className="space-y-4 py-4">
                        {!isCollapsed && (
                            <div className="px-3 py-2">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="headerSection">
                                        <AccordionTrigger>Header Section</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col">
                                                <Label htmlFor="name" className='mb-3'>Your Full Name</Label>
                                                <Input type='text' id="name" className='mb-3' value={formData.name || '' } onChange={(e) => updateFormData('name', e.target.value)} placeholder="Akash Kumar" required />
                                            </div>

                                            <div className="flex flex-col">
                                                <Label htmlFor="profession" className='mb-3'>Your Profession</Label>
                                                <Input type='text' id="profession" className='mb-3' value={formData.profession || ''} onChange={(e) => updateFormData('profession', e.target.value)} placeholder="Software Developer" required />
                                            </div>

                                            <div className="flex flex-col ">
                                                <Label htmlFor="bio" className='mb-3'>Your Bio</Label>
                                                <Textarea className='mb-3' value={formData.bio || ''} onChange={(e) => updateFormData("bio", e.target.value)} placeholder="Type Here" required />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="aboutMe">
                                        <AccordionTrigger>About Me Section</AccordionTrigger>
                                        <AccordionContent>

                                            <div className="flex flex-col ">
                                                <Label htmlFor="aboutMe" className='mb-3'>Briefly Write About Yourself</Label>
                                                <Textarea className='mb-3' value={formData.aboutMe || ''} onChange={(e) => updateFormData("aboutMe", e.target.value)} placeholder="Type Here" required />
                                            </div>


                                            <div className="flex flex-col">
                                                <Label htmlFor="resume" className='mb-3'>Upload Your Resume</Label>
                                                <Input type="file" id="resume" className='mb-3' name="resume" onChange={handleResumeChange} accept="image/*,.pdf" required />
                                            </div>

                                            <div className="flex flex-col">
                                                <Label htmlFor="photo" className='mb-3'>Choose your profile picture</Label>
                                                <Input type="file" id="photo" name="photo" className='mb-3' onChange={handleProfilePhotoChange} accept=".jpeg, .jpg, .png" required />
                                            </div>

                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="skills">
                                        <AccordionTrigger>Skills Section</AccordionTrigger>
                                        <AccordionContent>

                                            <div className="flex flex-col space-y-1.5">
                                                {predefinedSkills.map((skill) => (
                                                    <div key={skill.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={skill.id.toUpperCase()}
                                                            checked={selectedSkills.includes(skill.id.toUpperCase())}
                                                            onCheckedChange={(checked) => handleSkillChange(skill.id.toUpperCase(), checked as boolean)}
                                                        />
                                                        <Label htmlFor={skill.id}>{skill.label}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="projects">
                                        <AccordionTrigger>Projects</AccordionTrigger>
                                        <AccordionContent>

                                            <div className="flex flex-col space-y-1.5">
                                                {projects.map((project, index) => (
                                                    <Card key={project.id} className="w-[350px] mb-5">
                                                        <CardHeader>
                                                            <CardTitle>Project {index + 1}</CardTitle>
                                                            <CardDescription>Enter the details of your project</CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="grid w-full items-center gap-4 mb-2">

                                                                <div className="flex flex-col">
                                                                    <Label htmlFor={`title-${project.id}`} className='mb-3'>Project Title</Label>
                                                                    <Input
                                                                        type='text'
                                                                        className='mb-3'
                                                                        id={`title-${project.id}`}
                                                                        name="title"
                                                                        value={project.title}
                                                                        onChange={(e) => handleInputChange(project.id, e)}
                                                                        placeholder="Enter project title"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col ">
                                                                    <Label className='mb-3' htmlFor={`description-${project.id}`}>Project Description</Label>
                                                                    <Textarea
                                                                        className='mb-3'
                                                                        id={`description-${project.id}`}
                                                                        name="description"
                                                                        value={project.description}
                                                                        onChange={(e) => handleInputChange(project.id, e)}
                                                                        placeholder="Describe your project"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <Label className='mb-3' htmlFor={`photo-${project.id}`}>Project Photo</Label>
                                                                    <Input
                                                                        className='mb-3'
                                                                        id={`photo-${project.id}`}
                                                                        name="photo"
                                                                        type="file"
                                                                        onChange={(e) => handlePhotoChange(project.id, e)}
                                                                        accept="image/*"
                                                                        required
                                                                    />
                                                                    {project.photo && (
                                                                        <div className="mt-2">
                                                                            <Image
                                                                                src={URL.createObjectURL(project.photo)}
                                                                                alt={`Project ${index + 1} preview`}
                                                                                className="max-w-full h-auto rounded-md"
                                                                                height={300}
                                                                                width={300}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-col ">
                                                                    <Label className='mb-3' htmlFor={`repoLink-${project.id}`}>Github Repository</Label>
                                                                    <Input
                                                                        className='mb-3'
                                                                        id={`repoLink-${project.id}`}
                                                                        name="repoLink"
                                                                        type='url'
                                                                        value={project.repoLink}
                                                                        onChange={(e) => handleInputChange(project.id, e)}
                                                                        placeholder="https://github/myproject.com"
                                                                        required
                                                                    />
                                                                </div>

                                                                <div className="flex flex-col ">
                                                                    <Label className='mb-3' htmlFor={`liveLink-${project.id}`}>Live Link</Label>
                                                                    <Input
                                                                        className='mb-3'
                                                                        id={`liveLink-${project.id}`}
                                                                        name="liveLink"
                                                                        type='url'
                                                                        value={project.liveLink}
                                                                        onChange={(e) => handleInputChange(project.id, e)}
                                                                        placeholder="https://live.com"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="flex justify-between">

                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="socials">
                                        <AccordionTrigger>Socials Section</AccordionTrigger>
                                        <AccordionContent>
                                            {socialLinks.map((link) => (
                                                <div key={link.id} className="flex flex-col space-y-1.5 mb-3">
                                                    <Label htmlFor={link.id}>{link.platform}</Label>
                                                    <Input
                                                        id={link.id}
                                                        name="url"
                                                        type="url"
                                                        value={link.url}
                                                        onChange={(e) => handleLinkChange(link.id, e)}
                                                        placeholder={`https://${link.platform.toLowerCase()}/profile.com`}
                                                        required
                                                    />
                                                </div>
                                            ))}

                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="photo">Enter Your Email</Label>
                                                <Input id="email" type='email' name="email" value={formData.email || ''} onChange={(e) => updateFormData('email', e.target.value)} placeholder='abc@gmail.com' required />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="Navbar Background Color">
                                        <AccordionTrigger>Navbar Background Color</AccordionTrigger>
                                        <AccordionContent>
                                            <div>
                                            <ColorPickerComp elementId='navbar' />
                                            </div> 
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="Project 1 Background Color">
                                        <AccordionTrigger>Project 1 Background Color</AccordionTrigger>
                                        <AccordionContent>
                                            <div>
                                            <ColorPickerComp  elementId='project-box-1' />
                                           </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="Project 2 Background Color">
                                        <AccordionTrigger>Project 2 Background Color</AccordionTrigger>
                                        <AccordionContent>
                                            <div>
                                            <ColorPickerComp  elementId='project-box-2' />
                                           </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="Project 3 Background Color">
                                        <AccordionTrigger>Project 3 Background Color</AccordionTrigger>
                                        <AccordionContent>
                                            <div>
                                            <ColorPickerComp  elementId='project-box-3' />
                                           </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="Body Background Color">
                                        <AccordionTrigger>Body Background Color</AccordionTrigger>
                                        <AccordionContent>
                                            <div>
                                            <ColorPickerComp  elementId='body-background-color' />
                                           </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion> 
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SidebarContent>
        </>

    )
}

