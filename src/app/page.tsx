'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import BookingStepper from '@/components/BookingStepper'

interface FormData {
  selectedDate: Date | null
  selectedTime: Date | null
  nombre: string
  email: string
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    selectedDate: null,
    selectedTime: null,
    nombre: '',
    email: ''
  })

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-gray-500 to-sky-50 flex">
      <Sidebar 
        currentStep={currentStep} 
        formData={formData}
        onStepClick={handleStepChange}
      />
      <div className="flex-1 overflow-auto">
        <BookingStepper 
          currentStep={currentStep}
          formData={formData}
          onStepChange={handleStepChange}
          onFormDataChange={handleFormDataChange}
        />
      </div>
    </div>
  )
}
