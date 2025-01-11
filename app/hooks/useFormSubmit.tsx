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
  }>
  photo: string
  resume: string
  intiatingUser: string
}

let parsedFormData

export function useFormSubmit() {
  const { setRandomId, setStepStatus, setIsLoading } = useFormContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)





  const handleFilesToCloudinary = async (fileData): Promise<CloudinaryResponse | null> => {


    // Check if FormData is empty
    if (fileData && fileData.has('photo') && fileData.has('resume') && fileData.has('project_0') && fileData.has('project_1') && fileData.has('project_2')) {
      console.log("Form data contains all required files");
    } else {
      console.error("Missing required files in form data");
      return null;
    }

    try {
      const response = await fetch('/pages/api/upload', {
        method: 'POST',
        body: fileData,
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


  function replaceFileWithLinks(formData, cloudinaryResponse: CloudinaryResponse): FormDataProps {
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


  // Utility function to convert Base64 to Blob
  const dataURLtoBlob = (dataURL: string) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)
    const localStorageFormData = localStorage.getItem("formData")

    try {

      const photo = localStorage.getItem('photo')
      const resume = localStorage.getItem('resume')
      const project_0 = localStorage.getItem('projects_0')
      const project_1 = localStorage.getItem('projects_1')
      const project_2 = localStorage.getItem('projects_2')

      if (!photo || !resume || !project_0 || !project_1 || !project_2) {
        setStepStatus("Error: File Contents are empty in local storage")
        setIsLoading(false)
        return
      }

      const formData = new FormData()
      // Convert Base64 to Blob and append to FormData
      formData.append('photo', dataURLtoBlob(photo));
      formData.append('resume', dataURLtoBlob(resume));
      formData.append('project_0', dataURLtoBlob(project_0));
      formData.append('project_1', dataURLtoBlob(project_1));
      formData.append('project_2', dataURLtoBlob(project_2));


      if (localStorageFormData) {
        parsedFormData = JSON.parse(localStorageFormData);
      } else {
        setStepStatus("Error: No local storage formdata found")
        setIsLoading(false)
        return
      }


      setStepStatus("Uploading to cloudinary...")
      const uploadToCloudinary = await handleFilesToCloudinary(formData)

      if (!uploadToCloudinary || !uploadToCloudinary.data) {
        setStepStatus("Failed to upload files to cloudinary")
        setIsLoading(false)
        throw new Error("Failed to upload files to cloudinary")
      }

      const updatedFormData = replaceFileWithLinks(parsedFormData as FormDataProps, uploadToCloudinary);

      setRandomId(null)

      const id = createRandomId(16)

      localStorage.setItem("randomId", id.toLowerCase())

      //setRandomId(id)
      setRandomId(id.toLowerCase())


      setStepStatus("Adding data...")

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



