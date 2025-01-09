'use client'

import { useState } from 'react'
import { useFormContext } from '../context/formContext'
import { createRandomId } from '../../lib/utils'


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
  photo: string
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
  randomId: string
}

interface CloudinaryResponse {
  data: {
    photo: string
    resume: string
    projects: Array<{ photo: string }>
  }
  message: string
}

type FormDataProps = FormData & {
  projects: Array<{
    photo: string
    [key: string]: any
  }>
  photo: string
  resume: string
  intiatingUser: string
}

let parsedFormData: any

export function useFormSubmit() {
  const {  setRandomId, setStepStatus, setIsLoading } = useFormContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)

  



  const handleFilesToCloudinary = async (fileData: any): Promise<CloudinaryResponse | null> => {
    if (Object.keys(fileData).length === 0) {
      console.error("No file content found", fileData)
      return null
    }

    // Convert fileData to FormData
  //  const formData = new FormData();


    const formData = new FormData();

    // Add fields to FormData
    Object.entries(fileData).forEach(([key, value]) => {
      if (key === 'photo' || key === 'resume') {
        // Add photo and resume as string filenames
        if (typeof value === 'string') {
          formData.append(key, value);
        }
      } else if (key === 'projects' && Array.isArray(value)) {
        value.forEach((project, index) => {
          // Append project details
          formData.append(`project_${index}`, JSON.stringify(project));
          if (typeof project.photo === 'string') {
            // Append project photo as filename string
            formData.append(`project_photo_${index}`, project.photo);
          }
        });
      } else if (Array.isArray(value)) {
        // For array fields like 'skills', convert to JSON string
        formData.append(key, JSON.stringify(value));
      } else {
        // For simple fields like 'aboutMe', 'bio', etc.
        formData.append(key, value as string);
      }
    });
  
    

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


  function replaceFileWithLinks(formData: FormDataProps, cloudinaryResponse: CloudinaryResponse): FormDataProps {
    const updatedFormData = { ...formData };

    if (cloudinaryResponse.data) {
      if (cloudinaryResponse.data.photo) {
        updatedFormData.photo = cloudinaryResponse.data.photo;
      }
      if (cloudinaryResponse.data.resume) {
        updatedFormData.resume = cloudinaryResponse.data.resume;
      }
      if (cloudinaryResponse.data.projects) {
        updatedFormData.projects = updatedFormData.projects.map((project, index) => {
          if (cloudinaryResponse.data.projects[index] && cloudinaryResponse.data.projects[index].photo) {
            return {
              ...project,
              photo: cloudinaryResponse.data.projects[index].photo
            };
          }
          // If there's no corresponding Cloudinary link, keep the original photo
          return project;
        });
      }
    }

    return updatedFormData;
  }

  async function saveDataToServer(updatedFormData: FormDataProps) {
    try {
      const response = fetch('/pages/api/storeOnServer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
        credentials: 'include',
      })


      if (!response) {
        throw new Error('Network response was not ok')
      }

      return (await response).json()

    } catch (error) {
      console.error('Error saving data to server:', error)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)
    const localStorageFormData = localStorage.getItem("formData")

    try {


      if (localStorageFormData) {
        parsedFormData = JSON.parse(localStorageFormData);
      } else {
        setStepStatus("Error: No localStorageFormData found")
        setIsLoading(false)
        return
      }
        setStepStatus("Uploading to cloudinary")
      const uploadToCloudinary = await handleFilesToCloudinary(parsedFormData)

      if (!uploadToCloudinary || !uploadToCloudinary.data) {
        setStepStatus("Failed to upload files to cloudinary")
        setIsLoading(false)
        throw new Error("Failed to upload files to cloudinary")
      }

      const updatedFormData = replaceFileWithLinks(parsedFormData as FormDataProps, uploadToCloudinary);

     setRandomId(null)

      const id = createRandomId(16)

      localStorage.setItem("randomId",id.toLowerCase())

      setRandomId(id)
      //setRandomId(id.toLowerCase())


      setStepStatus("Adding Data")

      updatedFormData.intiatingUser = "akash" //hard coded for now
      updatedFormData.randomId = id.toLowerCase()


        await saveDataToServer(updatedFormData)
        


      const response = await fetch('/pages/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: updatedFormData }),
        credentials: 'include',
      })

      if (!response.ok) {
        setStepStatus("Failed to submit form")
        setIsLoading(false)
        throw new Error('Network response was not ok')
      }

      await response.json()

      setStepStatus("Form submitted successfully")


      setSubmitResult({ success: true, message: 'Form submitted successfully!' })
      return true; // Indicate success

    } catch (error) {
      setStepStatus("An error occurred while submitting the form")
      setIsLoading(false)
      console.error('Error submitting form:', error)
      setSubmitResult({ success: false, message: 'An error occurred while submitting the form.' })
      return false; // Indicate failure

    } finally {
      setIsSubmitting(false)
    }
  }

  return { handleSubmit, isSubmitting, submitResult }
}



