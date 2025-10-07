'use client'

import { useState, useEffect } from 'react'
import { getAvailableSlots } from '@/lib/actions'

interface CalendarProps {
  selectedDate: Date | null
  selectedTime: Date | null
  onDateSelect: (date: Date) => void
  onTimeSelect: (time: Date) => void
}

export default function Calendar({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}: CalendarProps) {
  const [availableSlots, setAvailableSlots] = useState<Date[]>([])
  const [loading, setLoading] = useState(false)

  // Generar días del mes actual
  const generateCalendarDays = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Días del mes anterior (grises)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i)
      days.push({ date: day, isCurrentMonth: false, isPast: true })
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      days.push({ date, isCurrentMonth: true, isPast })
    }
    
    // Completar la última semana con días del mes siguiente
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({ date, isCurrentMonth: false, isPast: false })
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const today = new Date()
  const currentMonth = monthNames[today.getMonth()]
  const currentYear = today.getFullYear()

  // Obtener slots disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      setLoading(true)
      getAvailableSlots(selectedDate).then(result => {
        if (result.success) {
          setAvailableSlots(result.data)
        }
        setLoading(false)
      })
    }
  }, [selectedDate])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <div className="space-y-8">
      {/* Calendario moderno */}
      <div className="card-elevated animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              Seleccionar Fecha
            </h3>
            <p className="text-slate-600 text-sm">
              {currentMonth} {currentYear}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Días de la semana con estilo moderno */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes con hover effects */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, isCurrentMonth, isPast }, index) => {
            const isSelected = selectedDate && 
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth()
            
            const isDisabled = !isCurrentMonth || isPast

            return (
              <button
                key={index}
                onClick={() => !isDisabled && onDateSelect(date)}
                disabled={isDisabled}
                className={`
                  relative h-12 w-full text-sm font-semibold rounded-xl transition-all duration-200 hover-lift
                  ${isSelected 
                    ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md scale-105' 
                    : isDisabled 
                    ? 'text-slate-400 cursor-not-allowed opacity-40'
                    : 'hover:bg-sky-50 hover:text-sky-600 text-slate-800 hover:shadow-sm hover:scale-105'
                  }
                  ${!isCurrentMonth ? 'text-slate-400 opacity-50' : ''}
                  ${isCurrentMonth && !isDisabled && !isSelected ? 'bg-gray-100 hover:bg-sky-50' : ''}
                `}
              >
                <span className="relative z-10">{date.getDate()}</span>
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-700 rounded-xl animate-pulse opacity-20" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Horarios disponibles modernos */}
      {selectedDate && (
        <div className="card-elevated animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Horarios Disponibles
              </h3>
              <p className="text-slate-600 text-sm">
                {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200"></div>
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent absolute top-0"></div>
              </div>
              <p className="text-slate-600 text-sm mt-4">Cargando horarios...</p>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => onTimeSelect(slot)}
                  className={`
                    relative p-4 text-sm font-semibold rounded-xl border-2 transition-all duration-200 hover-lift
                    ${selectedTime && 
                      selectedTime.getTime() === slot.getTime()
                      ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white border-sky-500 shadow-md scale-105'
                      : 'bg-white border-gray-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300 hover:shadow-sm hover:scale-105'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(slot)}
                  </div>
                  {selectedTime && selectedTime.getTime() === slot.getTime() && (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-700 rounded-xl animate-pulse opacity-20" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">
                Sin horarios disponibles
              </h4>
              <p className="text-slate-600 text-sm">
                No hay citas disponibles para esta fecha. Por favor, selecciona otro día.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}