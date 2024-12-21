'use client'

import { useState } from 'react'
import { useFormContext } from '../context/formContext'

interface SubmitResult {
  success: boolean
  message: string
}

interface Project {
  id: string
  title: string
  description: string
  liveLink: string
  repoLink: string
  photo: File | string
}

interface FormData {
  name: string
  profession: string
  bio: string
  aboutMe: string
  email: string
  photo: string
  resume: string
  projects: Project[]
  skills: string[]
  socialLinks: { platform: string, url: string }[]
}

export function useFormSubmit() {
  const { formData } = useFormContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)

  const processFiles = async (data: FormData) => {
    const fileContents: Record<string, File> = {}

    console.log("data:", data.resume)

    // Process main photo
    if (data.photo && data.photo.startsWith('C:\\fakepath\\')) {
      const photoInput = document.querySelector('input[type="file"][name="photo"]') as HTMLInputElement
      if (photoInput && photoInput.files && photoInput.files[0]) {
        fileContents.photo = photoInput.files[0]
      }
    }

    // Process resume
    if (data.resume && data.resume.startsWith('C:\\fakepath\\')) {
      const resumeInput = document.querySelector('input[type="file"][name="resume"]') as HTMLInputElement
      if (resumeInput && resumeInput.files && resumeInput.files[0]) {
        fileContents.resume = resumeInput.files[0]
      }
    }

    // Process project photos
    for (const project of data.projects) {
      if (typeof project.photo === 'string' && project.photo.startsWith('C:\\fakepath\\')) {
        const projectPhotoInput = document.querySelector(`input[type="file"][name="project-photo-${project.id}"]`) as HTMLInputElement
        if (projectPhotoInput && projectPhotoInput.files && projectPhotoInput.files[0]) {
          fileContents[`project_${project.id}`] = projectPhotoInput.files[0]
        }
      } else if (project.photo instanceof File) {
        fileContents[`project_${project.id}`] = project.photo
      }
    }

    return fileContents
  }

  const handleFilesToCloudinary = async (fileData: Record<string, File>) => {
    if (Object.keys(fileData).length === 0) {
      console.error("No file content found")
      return null
    }
  
    const formData = new FormData()
    
    for (const [key, file] of Object.entries(fileData)) {
      formData.append(key, file)
    }
    
    try {
      const response = await fetch('/pages/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error uploading files:', error)
      return null
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      console.log("formData:", formData)
      const fileContents = await processFiles(formData as FormData)
      console.log("fileContents:", fileContents)
      const uploadToCloudinary = await handleFilesToCloudinary(fileContents)

      if (!uploadToCloudinary) {
        console.log("uploadCloudinary:", uploadToCloudinary)
        throw new Error("Failed to upload files to cloudinary")
      }else{
        console.log("uploadCloudinary:", uploadToCloudinary)
      }
      
      // Prepare the data to be sent to the server
      const dataToSend = {
        ...formData,
        photo: uploadToCloudinary.mainPhoto || formData.photo,
        resume: uploadToCloudinary.resume || formData.resume,
        projects: formData.projects.map((project: Project) => ({
          ...project,
          photo: uploadToCloudinary[`project_${project.id}`] || project.photo
        }))
      };

      const response = await fetch('/pages/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: dataToSend }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      setSubmitResult({ success: true, message: 'Form submitted successfully!' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitResult({ success: false, message: 'An error occurred while submitting the form.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { handleSubmit, isSubmitting, submitResult }
}

