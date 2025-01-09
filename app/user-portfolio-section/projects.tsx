"use client"

import { useState, ChangeEvent, useEffect } from 'react'
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

  const { updateFormData } = useFormContext()
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
    updateFormData("projects",projects)
  },[projects])


  
  

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







