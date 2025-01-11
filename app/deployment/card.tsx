'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaCog, FaRocket, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'
import { useFormContext } from '@/app/context/formContext'
import { createRepo, uploadFiles, deployToVercel, deployProject } from '../../lib/deployment'
import { redirectToGitHubOAuth, redirectToVercel } from '../../lib/auth'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'
import { useFormSubmit } from '../hooks/useFormSubmit'
import { removeCacheStorage } from '@/lib/cacheStorageRemover'
import { setTokenOnServer } from '@/lib/setToken'
import Cookies from 'js-cookie'


const steps = [
  {
    title: "Link your GitHub",
    description: "Connect your GitHub account to deploy your website.",
    icon: FaGithub,
    color: "text-purple-500",
  },
  {
    title: "Create Repository",
    description: "Create a new repository to store your website code.",
    icon: FaGithub,
    color: "text-purple-500",
  },
  {
    title: "Link your Vercel account",
    description: "Set up your build settings and environment variables.",
    icon: FaCog,
    color: "text-blue-500",
  },
  {
    title: "Deploy Application",
    description: "Push your code to your repository to trigger a deployment.",
    icon: FaRocket,
    color: "text-green-500",
  },
]

function isEmpty(obj: object | string): boolean {
  return Object.keys(obj).length === 0;
}

 // Function to convert files to Base64 and store them in localStorage
 const storeFilesInLocalStorage = (formData) => {
  const fileKeys = ['photo', 'resume'];

  // Handle main photo and resume files
  fileKeys.forEach((fileKey) => {
    const file = formData[fileKey];
    if (file) {
      convertFileToBase64AndStore(file, fileKey);
    }
  });

  // Handle project photos
  formData.projects.forEach((project, index) => {
    if (project.photo) {
      convertFileToBase64AndStore(project.photo, `projects_${index}`);
    }
  });
};

// Convert file to Base64 and store it in localStorage
const convertFileToBase64AndStore = (file: File, key) => {
  const reader = new FileReader();
  reader.onload = function (event) {
    const base64String = event.target?.result as string;
    localStorage.setItem(key, base64String); // Store base64 string in localStorage
    console.log(`Stored ${key} in localStorage:`, base64String.slice(0, 50), '...'); // Log first 50 chars for debugging
  };

  reader.onerror = function (error) {
    console.error(`Error reading ${key}:`, error);
  };

  reader.readAsDataURL(file); // Convert file to Base64 and trigger the reader
};








export function EnhancedDeploymentStepsCard() {
  const {formData, currentStep, setCurrentStep,setRandomId,randomId, repoInfo, setRepoInfo, isLoading, setIsLoading, stepStatus, setStepStatus, setUrl, url } = useFormContext()
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null)
  const [disableButton, setDisableButton] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { handleSubmit } = useFormSubmit()


  useEffect(() =>{
    if (!isEmpty(formData)) {
      const formDataWithoutFiles = {};
      
      for (const [key, value] of Object.entries(formData)) {
        if (!(value instanceof File)) {
          if (Array.isArray(value)) {
            formDataWithoutFiles[key] = value.map(item => {
              if (item && typeof item === 'object') {
                const newItem = {...item};
                for (const [subKey, subValue] of Object.entries(newItem)) {
                  if (subValue instanceof File) {
                    newItem[subKey] = subValue.name;
                  }
                }
                return newItem;
              }
              return item;
            });
          } else {
            formDataWithoutFiles[key] = value;
          }
        } else {
          formDataWithoutFiles[key] = value.name;
        }
      }
      
   //   storeFilesInCache(formData);

      storeFilesInLocalStorage(formData)
      localStorage.setItem("formData", JSON.stringify(formDataWithoutFiles));
    }
  },[formData])


  useEffect(() => {
    const fetchToken = async () => {
      const token = searchParams.get('github_access_token')
      if (token && !disableButton) {
        setGithubAccessToken(token)
  
      //  setStepStatus("Setting Token")
        const store = await setTokenOnServer(token,"github_access_token")
        if(!store){
          setStepStatus("error setting token")
        }
  
        setCurrentStep(currentStep === 0 ? 1 : currentStep)
      }
  

      const deployId = searchParams.get('deployId')
  
      if(deployId){
        localStorage.setItem("deployId",deployId)
       // setDeployState(false)
      }
  
      const process = searchParams.get("deployment_process")
      if (process === "3") {
        setCurrentStep(3)
      }
    }

    fetchToken()
 
  }, [searchParams, currentStep, setCurrentStep,disableButton,setStepStatus])


  useEffect(()=>{
    const process = searchParams.get("deployment_process")
    if(process === "3" && !localStorage.getItem("formData") && !localStorage.getItem("vercel_accces_token") && !localStorage.getItem("repoInfo_id")
    ){
        setCurrentStep(currentStep + 1)
        setDisableButton(true) 
    }
  },[searchParams,currentStep,setCurrentStep])

 

  useEffect(() => {
    if (repoInfo?.fullName && repoInfo?.id) {
      localStorage.setItem("repoInfo_fullName", repoInfo?.fullName)
      localStorage.setItem("repoInfo_id", repoInfo?.id.toString())
    }
  }, [repoInfo])

  useEffect(() => {
    if (currentStep === 0) {
      setUrl(null)
      localStorage.removeItem("github_access_token")
      setDisableButton(false)
    }
  }, [currentStep,setUrl])

  const handleNextStep = async (e:React.FormEvent ) => {
    setIsLoading(true)
    setError(null)

    if(!localStorage.getItem("deployId")){
      setError("Invalid access through this route")
      setIsLoading(false)
      return
     }
     const localStorageFormData: object | string = localStorage.getItem("formData")

     if(localStorageFormData && isEmpty(localStorageFormData)){
      setError("No formData found or formData expired")
      setIsLoading(false)
      return
     }

    try {
      switch (currentStep) {
        case 0:
          setIsLoading(true)

          setStepStatus('Redirecting to GitHub...')
          const res1 = await redirectToGitHubOAuth(setIsLoading, setStepStatus)
          if (res1) {

            // Delay for 2 seconds
            await new Promise((resolve) => setTimeout(resolve, 2000))

            setIsLoading(false)
            setStepStatus(null)
          }
          break
        case 1:
          setIsLoading(true)
          setStepStatus(null)
          const submit = await handleSubmit(e)
          if(submit){
            setStepStatus('Creating repository...')
            const repo = await createRepo(setIsLoading, setStepStatus)
            if (repo) {
              setRepoInfo(repo)
              setStepStatus('Uploading files...')
              const res2 = await uploadFiles(repo.fullName, setIsLoading, setStepStatus,setRandomId,randomId)
              if (res2) {
                setIsLoading(false)
                setStepStatus(null)
              }
              setCurrentStep(currentStep + 1)
            }
          }
         
          break
        case 2:
          setIsLoading(true)
          setStepStatus('Redirecting to Vercel...')
          const res3 = await redirectToVercel(setIsLoading, setStepStatus)
          if (res3) {
            setIsLoading(false)
            setStepStatus(null)
          }
          break
        case 3:
          if (currentStep === 3) {
            setIsLoading(true)
            setStepStatus('Deploying project...')
            const responseFromVercel = await deployProject(setIsLoading, setStepStatus)

            if (!responseFromVercel) {
              console.log("Error while deploying project", responseFromVercel)
              return
            }
            setStepStatus('Finalizing deployment...')
            const response = await deployToVercel(setIsLoading, setStepStatus, setUrl)
            if (response) {
              setIsLoading(false)
              setStepStatus(null)
              //setCurrentStep(currentStep + 1)
              localStorage.removeItem("repoInfo_fullName")
              localStorage.removeItem("repoInfo_id")
              localStorage.removeItem("github_access_token")
              localStorage.removeItem("vercel_access_token")
              localStorage.removeItem("latestCSRFToken")
              localStorage.removeItem("deployId")
              localStorage.removeItem("formData")
              localStorage.removeItem("randomId")

              //////////////////////////////////////
              localStorage.removeItem("resume")
              localStorage.removeItem("photo")
              localStorage.removeItem("project_0")
              localStorage.removeItem("project_1")
              localStorage.removeItem("project_2")

              console.log(githubAccessToken)
              Cookies.remove("latestCSRFToken")
              Cookies.remove("github_access_token")
              Cookies.remove("vercel_access_token")

              await removeCacheStorage()

              setRandomId(null)
              setDisableButton(true)
            } else {
              setIsLoading(false)
              setStepStatus("Error while deploying to Vercel")
              console.log("Error while deploying to Vercel", response)
              return
            }
            // setUrl(response)
            // redirect(`https://${response}`)
          }
          break
        default:
          break
      }
    } catch (error) {
      console.error("Error during step execution:", error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      // setIsLoading(false)
    }

  }

  const CurrentIcon = steps[currentStep]?.icon || FaCheckCircle

  return (

    <>
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <CardTitle className="text-2xl font-bold">Deploy Your Website</CardTitle>
        <CardDescription className="text-gray-200">Follow these steps to launch your portfolio website</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ol className="space-y-6">
          {steps.map((step, index) => (
            <motion.li
              key={index}
              className={`flex items-start space-x-4 ${index === currentStep ? 'opacity-100' : 'opacity-50'}`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: index <= currentStep ? 1 : 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className={`flex-shrink-0 ${step.color}`}>
                <step.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-300">{step.description}</p>
                {index === currentStep && stepStatus && (
                  <p className="text-sm text-blue-300 mt-1">{stepStatus}</p>
                )}
              </div>
              {index < currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <FaCheckCircle className="h-6 w-6 text-green-400" />
                </motion.div>
              )}
            </motion.li>
          ))}
        </ol>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <FaExclamationTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {url && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-gray-400">Your website is live at:</p>
            <a
              href={`https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-600 transition duration-200"
            >
              {`https://${url}`}
            </a>

          </motion.div>
        )}
         
         { 
          disableButton && !url &&
          <div className='flex justify-center'>
          <Link href="/">
            <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1">
             Go to Homepage
            </Button>
          </Link>
          </div>
         }

        <div className='flex justify-center'>
         {url && (
           <Link href="/">
            <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1">
             Go to Homepage
            </Button>
          </Link>
         )}
        </div>

        <motion.div
          className="mt-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={(e) => handleNextStep(e)}
            disabled={isLoading || disableButton}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : disableButton ? (
              <>
                <FaCheckCircle className="mr-2 h-5 w-5" />
                Deployment Complete!
              </>
            ) : (
              <>
                <CurrentIcon className="mr-2 h-5 w-5" />
                {steps[currentStep].title}
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
    </>
  

  )

}

