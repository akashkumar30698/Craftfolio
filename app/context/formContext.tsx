'use client'

import React, { createContext, useContext, useState } from 'react'


interface RepoInfo {
  fullName: string | null
  id: number
}






type FormContextType = {
  formData: Record<string, any>
  updateFormData: (field: string, value: any) => void
  selectedSkills: string[]
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  repoInfo: RepoInfo | null | undefined
  setRepoInfo: React.Dispatch<React.SetStateAction<RepoInfo | null>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  stepStatus: string | null
  setStepStatus: React.Dispatch<React.SetStateAction<string | null>>
  url: string | null
  setUrl: React.Dispatch<React.SetStateAction<string | null>>
  randomId: string | null
  setRandomId: React.Dispatch<React.SetStateAction<string | null>>
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [stepStatus, setStepStatus] = useState<string | null>('')
  const [url,setUrl] = useState<string | null>('')
  const [randomId, setRandomId] = useState<string | null>('')



  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData, selectedSkills,setSelectedSkills, currentStep, setCurrentStep, repoInfo, setRepoInfo,isLoading,setIsLoading, stepStatus,
      setStepStatus,url,setUrl ,randomId,setRandomId}}>   
      {children}
    </FormContext.Provider>
  )
}

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

