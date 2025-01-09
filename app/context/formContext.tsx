'use client'

import React, { createContext, useContext, useState } from 'react'


interface RepoInfo {
  fullName: string | null
  id: number
}







const FormContext = createContext(undefined)

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState({})
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [stepStatus, setStepStatus] = useState<string | null>('')
  const [url,setUrl] = useState<string | null>('')
  const [randomId, setRandomId] = useState<string | null>('')



  const updateFormData = (field: string, value) => {
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

