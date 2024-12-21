'use client'

import React, { createContext, useContext, useState } from 'react'

type FormContextType = {
  formData: Record<string, any>
  updateFormData: (field: string, value: any) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
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

