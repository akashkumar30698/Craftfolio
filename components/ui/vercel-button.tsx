import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

interface VercelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function VercelButton({ children, ...props }: VercelButtonProps) {
  return (
    <Button
      className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
      {...props}
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
    </Button>
  )
}

