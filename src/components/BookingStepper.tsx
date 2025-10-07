'use client'

import { useState, useEffect } from 'react'
import Calendar from './Calendar'
import { createAppointment, CreateAppointmentData } from '@/lib/actions'

interface FormData {
  selectedDate: Date | null
  selectedTime: Date | null
  nombre: string
  email: string
}

interface BookingStepperProps {
  currentStep: number
  formData: FormData
  onStepChange: (step: number) => void
  onFormDataChange: (data: Partial<FormData>) => void
}

export default function BookingStepper({
  currentStep,
  formData,
  onStepChange,
  onFormDataChange
}: BookingStepperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleDateSelect = (date: Date) => {
    onFormDataChange({ selectedDate: date, selectedTime: null })
  }

  const handleTimeSelect = (time: Date) => {
    onFormDataChange({ selectedTime: time })
  }

  const handleNext = () => {
    if (currentStep < 3) {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    onFormDataChange({ [field]: value })
  }

  // Auto-avanzar al siguiente paso cuando se completen los datos necesarios
  useEffect(() => {
    if (currentStep === 1 && formData.selectedTime) {
      // Auto-avanzar al paso 2 cuando se seleccione la hora
      setTimeout(() => onStepChange(2), 500)
    }
  }, [formData.selectedTime, currentStep, onStepChange])

  const handleSubmit = async () => {
    if (!formData.selectedTime || !formData.nombre || !formData.email) return

    setIsSubmitting(true)
    
    const appointmentData: CreateAppointmentData = {
      fecha_cita: formData.selectedTime,
      nombre_cliente: formData.nombre,
      email_cliente: formData.email
    }

    try {
      const result = await createAppointment(appointmentData)
      if (result.success) {
        setSubmitSuccess(true)
        onStepChange(3)
      } else {
        alert('Error al crear la cita. Por favor, intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la cita. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToStep2 = formData.selectedDate && formData.selectedTime
  const canSubmit = formData.nombre && formData.email && formData.selectedTime

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (submitSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg text-center animate-fade-in">
          {/* Ícono de éxito animado */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto shadow-large animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-success-400 rounded-full mx-auto animate-ping opacity-20" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            ¡Cita Reservada con Éxito!
          </h2>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            Tu cita ha sido confirmada para el<br/>
            <span className="font-semibold text-sky-600">
              {formData.selectedTime && formatDateTime(formData.selectedTime)}
            </span>
          </p>
          
          {/* Card de confirmación moderna */}
          <div className="card-elevated bg-gradient-to-br from-sky-50 to-green-50 border-sky-200 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-800 mb-2">Confirmación por Email</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Hemos enviado todos los detalles de tu cita a{' '}
                  <span className="font-semibold text-sky-600">{formData.email}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Reserva
            </button>
            <a
              href="/dashboard"
              className="btn btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      {currentStep === 1 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Selecciona Fecha y Hora
            </h2>
            <p className="text-slate-600">
              Elige el día y horario que mejor se adapte a tu agenda
            </p>
          </div>

          <Calendar
            selectedDate={formData.selectedDate}
            selectedTime={formData.selectedTime}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
          />

          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              disabled={!canProceedToStep2}
              className={`btn ${canProceedToStep2 ? 'btn-primary' : 'btn-secondary'}`}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Información Personal
            </h2>
            <p className="text-slate-600">
              Comparte tus datos para confirmar la reserva
            </p>
          </div>

          <div className="card space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-800 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="input w-full"
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input w-full"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">
                Resumen de tu cita
              </h4>
              <p className="text-sm text-slate-600">
                <strong>Fecha y hora:</strong><br />
                {formData.selectedTime && formatDateTime(formData.selectedTime)}
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              className="btn btn-secondary"
            >
              Atrás
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`btn ${canSubmit && !isSubmitting ? 'btn-primary' : 'btn-secondary'}`}
            >
              {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}