'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

export interface CreateAppointmentData {
  fecha_cita: Date
  nombre_cliente: string
  email_cliente: string
}

export async function createAppointment(data: CreateAppointmentData) {
  try {
    const cita = await prisma.cita.create({
      data: {
        fecha_cita: data.fecha_cita,
        nombre_cliente: data.nombre_cliente,
        email_cliente: data.email_cliente,
        estado: 'pendiente'
      }
    })
    
    revalidatePath('/dashboard')
    return { success: true, data: cita }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return { success: false, error: 'Error al crear la cita' }
  }
}

export async function getAppointments() {
  try {
    const citas = await prisma.cita.findMany({
      orderBy: {
        fecha_cita: 'asc'
      }
    })
    return { success: true, data: citas }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return { success: false, error: 'Error al obtener las citas' }
  }
}

export async function updateAppointmentStatus(id: string, estado: string) {
  try {
    const cita = await prisma.cita.update({
      where: { id },
      data: { estado }
    })
    
    revalidatePath('/dashboard')
    return { success: true, data: cita }
  } catch (error) {
    console.error('Error updating appointment:', error)
    return { success: false, error: 'Error al actualizar la cita' }
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.cita.delete({
      where: { id }
    })
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return { success: false, error: 'Error al eliminar la cita' }
  }
}

export async function getAvailableSlots(date: Date) {
  try {
    // Obtener citas existentes para la fecha
    const existingAppointments = await prisma.cita.findMany({
      where: {
        fecha_cita: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      }
    })
    
    // Horarios disponibles (9:00 AM a 5:00 PM, cada hora)
    const availableSlots = []
    for (let hour = 9; hour <= 17; hour++) {
      const slot = new Date(date)
      slot.setHours(hour, 0, 0, 0)
      
      // Verificar si el slot está ocupado
      const isOccupied = existingAppointments.some(apt => 
        apt.fecha_cita.getHours() === hour
      )
      
      if (!isOccupied) {
        availableSlots.push(slot)
      }
    }
    
    return { success: true, data: availableSlots }
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return { success: false, error: 'Error al obtener horarios disponibles' }
  }
}