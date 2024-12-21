'use client'

import { ReactNode } from 'react'
import { useFormSubmit } from '../hooks/useFormSubmit'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import SocialMediaLinksForm from '../user-portfolio-section/socials'

interface FormWrapperProps {
  children: ReactNode
}

export function FormWrapper({ children }: FormWrapperProps) {
  const { handleSubmit, isSubmitting, submitResult } = useFormSubmit()

  return (
    <form onSubmit={handleSubmit}>
      {children}
      {submitResult && submitResult.success && (
        <Alert variant="default">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{submitResult.message}</AlertDescription>
        </Alert>
      )}
      {submitResult && !submitResult.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submitResult.message}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}

