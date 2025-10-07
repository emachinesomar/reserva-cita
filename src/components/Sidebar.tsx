'use client'

interface FormData {
  selectedDate: Date | null
  selectedTime: Date | null
  nombre: string
  email: string
}

interface SidebarProps {
  currentStep: number
  formData: FormData
  onStepClick: (step: number) => void
}

const steps = [
  { id: 1, title: 'Fecha y Hora', description: 'Selecciona cuándo deseas tu cita' },
  { id: 2, title: 'Información Personal', description: 'Comparte tus datos de contacto' },
  { id: 3, title: 'Confirmación', description: 'Revisa y confirma tu cita' }
]

export default function Sidebar({ currentStep, formData, onStepClick }: SidebarProps) {
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canNavigateToStep = (stepId: number) => {
    if (stepId === 1) return true
    if (stepId === 2) return formData.selectedDate && formData.selectedTime
    if (stepId === 3) return formData.selectedDate && formData.selectedTime && formData.nombre && formData.email
    return false
  }

  const getStepPreview = (stepId: number) => {
    switch (stepId) {
      case 1:
        if (formData.selectedTime) {
          return formatDateTime(formData.selectedTime)
        }
        return null
      case 2:
        if (formData.nombre) {
          return `${formData.nombre}${formData.email ? ` • ${formData.email}` : ''}`
        }
        return null
      case 3:
        return 'Reserva completa'
      default:
        return null
    }
  }
  return (
    <div className="w-80 bg-gradient-to-br from-sky-300 to-sky-300 border-r border-gray-200 p-8 min-h-screen">
      {/* Header con gradiente sutil */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Sistema de Reservas
            </h1>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Reserva tu cita de manera rápida y sencilla con nuestro sistema moderno
        </p>
      </div>

      {/* Pasos modernos con animación y navegación */}
      <nav className="space-y-3 mb-8">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isPending = step.id > currentStep
          const canNavigate = canNavigateToStep(step.id)
          const preview = getStepPreview(step.id)

          return (
            <button
              key={step.id}
              onClick={() => canNavigate && onStepClick(step.id)}
              disabled={!canNavigate}
              className={`group relative p-5 rounded-2xl border transition-all duration-300 hover-lift animate-fade-in w-full text-left ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-50 to-sky-50 border-green-200 shadow-sm hover:shadow-md cursor-pointer'
                  : isCurrent
                  ? 'bg-gradient-to-r from-sky-50 to-sky-100 border-sky-300 shadow-md'
                  : canNavigate
                  ? 'bg-gray-50 border-gray-200 hover:border-sky-200 cursor-pointer hover:bg-sky-50'
                  : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
              } ${canNavigate ? 'hover:scale-[1.02]' : ''}`}
              style={{ animationDelay: `${step.id * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white scale-110'
                      : isCurrent
                      ? 'bg-sky-500 text-white scale-105 animate-pulse'
                      : 'bg-gray-200 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold transition-colors ${
                        isCompleted || isCurrent
                          ? 'text-slate-800'
                          : 'text-slate-600 group-hover:text-slate-800'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {canNavigate && !isCurrent && (
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Preview de datos si existe */}
                  {preview ? (
                    <div className="bg-white/50 rounded-lg px-3 py-2 mb-2 border border-sky-200/50">
                      <p className="text-xs font-medium text-sky-700 truncate">
                        {preview}
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`text-xs leading-relaxed transition-colors ${
                        isCompleted || isCurrent
                          ? 'text-slate-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {step.description}
                    </p>
                  )}
                  
                  {/* Mostrar descripción siempre si hay preview */}
                  {preview && (
                    <p className="text-xs text-slate-500 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Indicator line */}
              {step.id < steps.length && (
                <div className="absolute left-9 top-16 w-0.5 h-6 bg-gradient-to-b from-gray-300 to-transparent" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Card de ayuda moderna */}
      <div className="card-elevated mb-4 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-800 mb-2">
              ¿Necesitas ayuda?
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Estamos aquí para ayudarte en cada paso del proceso
            </p>
            <a
              href="mailto:soporte@reservas.com"
              className="inline-flex items-center gap-2 text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Contactar soporte
            </a>
          </div>
        </div>
      </div>

      {/* Card de administración moderna */}
      <div className="card-elevated bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-800 mb-2">
              Panel de Control
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Gestiona todas las citas y reservas desde el dashboard
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs text-slate-700 hover:text-sky-600 font-medium transition-colors group"
            >
              <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Ir al Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}