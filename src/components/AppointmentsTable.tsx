'use client'

import { useState } from 'react'
import { updateAppointmentStatus, deleteAppointment } from '@/lib/actions'

interface Appointment {
  id: string
  fecha_cita: Date
  nombre_cliente: string
  email_cliente: string
  estado: string
  createdAt: Date
}

interface AppointmentsTableProps {
  appointments: Appointment[]
}

const statusColors = {
  'pendiente': 'bg-warning/10 text-warning border-warning/20',
  'confirmada': 'bg-success/10 text-success border-success/20',
  'completada': 'bg-primary/10 text-primary border-primary/20',
  'cancelada': 'bg-error/10 text-error border-error/20'
}

const statusLabels = {
  'pendiente': 'Pendiente',
  'confirmada': 'Confirmada',
  'completada': 'Completada',
  'cancelada': 'Cancelada'
}

export default function AppointmentsTable({ appointments: initialAppointments }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoading(id)
    try {
      const result = await updateAppointmentStatus(id, newStatus)
      if (result.success) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, estado: newStatus } : apt)
        )
      } else {
        alert('Error al actualizar el estado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el estado')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return
    
    setLoading(id)
    try {
      const result = await deleteAppointment(id)
      if (result.success) {
        setAppointments(prev => prev.filter(apt => apt.id !== id))
      } else {
        alert('Error al eliminar la cita')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar la cita')
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (appointments.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-text-secondary mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No hay citas registradas
        </h3>
        <p className="text-text-secondary">
          Las citas aparecerán aquí cuando los usuarios hagan reservas.
        </p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Creado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {appointment.nombre_cliente}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {appointment.email_cliente}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-primary">
                    {formatDate(appointment.fecha_cita)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {formatTime(appointment.fecha_cita)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={appointment.estado}
                    onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                    disabled={loading === appointment.id}
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      statusColors[appointment.estado as keyof typeof statusColors]
                    }`}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {formatDate(appointment.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    disabled={loading === appointment.id}
                    className="text-error hover:text-error/80 transition-colors disabled:opacity-50"
                  >
                    {loading === appointment.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
