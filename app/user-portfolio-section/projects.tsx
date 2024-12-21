"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from '../context/formContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

interface ProjectData {
  id: string
  title: string
  description: string
  photo: File | null,
  repoLink: string,
  liveLink: string
}

export default function MultiProjectForm() {

  const { formData, updateFormData } = useFormContext()
  const [projects, setProjects] = useState<ProjectData[]>([
    { id: '1', title: '', description: '', photo: null, repoLink: '', liveLink: '' },
    { id: '2', title: '', description: '', photo: null, repoLink: '', liveLink: '' },
    { id: '3', title: '', description: '', photo: null, repoLink: '', liveLink: '' }
  ])

  const handleInputChange = (id: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProjects(projects.map(project =>
      project.id === id ? { ...project, [name]: value } : project
    ))
  }

  const handlePhotoChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProjects(projects.map(project =>
        project.id === id ? { ...project, photo: file } : project
      ))

    }
  }

  useEffect(()=>{
    console.log("projects at useEffect",projects)
    updateFormData("projects",projects)
  },[projects])


  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isValid = projects.every(project => project.title && project.description && project.photo)
    if (isValid) {
      console.log('Projects Data:', projects)
      // Here you would typically send this data to your backend
      // You might want to use FormData to handle file uploads
      const formData = new FormData()
      projects.forEach((project, index) => {
        formData.append(`project${index + 1}Title`, project.title)
        formData.append(`project${index + 1}Description`, project.description)
        if (project.photo) {
          formData.append(`project${index + 1}Photo`, project.photo)
        }
      })

      // Example of how you might send this to a server:
      // await fetch('/api/projects', { method: 'POST', body: formData })

      alert('All projects submitted successfully!')
      // Reset form after submission if needed
      // setProjects(projects.map(p => ({ ...p, title: '', description: '', photo: null })))
    } else {
      alert('Please fill in all fields for each project and upload photos')
    }
  }

  return (
    <>
      <div>
        {projects.map((project, index) => (
          <Card key={project.id} className="w-[350px] mb-5">
            <CardHeader>
              <CardTitle>Project {index + 1}</CardTitle>
              <CardDescription>Enter the details of your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4 mb-2">

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                  <Input
                    id={`title-${project.id}`}
                    name="title"
                    value={project.title}
                    onChange={(e) => handleInputChange(project.id, e)}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`description-${project.id}`}>Project Description</Label>
                  <Textarea
                    id={`description-${project.id}`}
                    name="description"
                    value={project.description}
                    onChange={(e) => handleInputChange(project.id, e)}
                    placeholder="Describe your project"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`photo-${project.id}`}>Project Photo</Label>
                  <Input
                    id={`photo-${project.id}`}
                    name="photo"
                    type="file"
                    onChange={(e) => handlePhotoChange(project.id, e)}
                    accept="image/*"
                    required
                  />
                  {project.photo && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(project.photo)}
                        alt={`Project ${index + 1} preview`}
                        className="max-w-full h-auto rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`repoLink-${project.id}`}>Github Repository</Label>
                  <Input
                    id={`repoLink-${project.id}`}
                    name="repoLink"
                    type='url'
                    value={project.repoLink}
                    onChange={(e) => handleInputChange(project.id, e)}
                    placeholder="https://github/myproject.com"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`liveLink-${project.id}`}>Live Link</Label>
                  <Input
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


      <div className="flex justify-between">

      </div>
    </>

  )
}







