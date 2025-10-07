import { getAppointments } from '@/lib/actions'
import AppointmentsTable from '@/components/AppointmentsTable'
import Link from 'next/link'

export default async function DashboardPage() {
  const result = await getAppointments()
  const appointments = result.success ? result.data : []

  // Estadísticas básicas
  const stats = {
    total: appointments.length,
    pendientes: appointments.filter(apt => apt.estado === 'pendiente').length,
    confirmadas: appointments.filter(apt => apt.estado === 'confirmada').length,
    completadas: appointments.filter(apt => apt.estado === 'completada').length,
    canceladas: appointments.filter(apt => apt.estado === 'cancelada').length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Panel de Administración
              </h1>
              <p className="text-text-secondary mt-1">
                Gestiona las citas y reservas de tu sistema
              </p>
            </div>
            <Link
              href="/"
              className="btn btn-secondary"
            >
              ← Volver a Reservas
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-text-primary mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-text-secondary">
              Total de Citas
            </div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {stats.pendientes}
            </div>
            <div className="text-sm text-text-secondary">
              Pendientes
            </div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {stats.confirmadas}
            </div>
            <div className="text-sm text-text-secondary">
              Confirmadas
            </div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {stats.completadas}
            </div>
            <div className="text-sm text-text-secondary">
              Completadas
            </div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-error mb-1">
              {stats.canceladas}
            </div>
            <div className="text-sm text-text-secondary">
              Canceladas
            </div>
          </div>
        </div>

        {/* Tabla de citas */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Todas las Citas
            </h2>
            <div className="text-sm text-text-secondary">
              {appointments.length} cita{appointments.length !== 1 ? 's' : ''} encontrada{appointments.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <AppointmentsTable appointments={appointments} />
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Próximas Citas
            </h3>
            <div className="space-y-3">
              {appointments
                .filter(apt => new Date(apt.fecha_cita) >= new Date() && apt.estado !== 'cancelada')
                .slice(0, 3)
                .map(apt => (
                  <div key={apt.id} className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                    <div>
                      <div className="font-medium text-text-primary">
                        {apt.nombre_cliente}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {new Date(apt.fecha_cita).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      apt.estado === 'pendiente' 
                        ? 'bg-warning/10 text-warning border-warning/20'
                        : 'bg-success/10 text-success border-success/20'
                    }`}>
                      {apt.estado === 'pendiente' ? 'Pendiente' : 'Confirmada'}
                    </div>
                  </div>
                ))}
              {appointments.filter(apt => new Date(apt.fecha_cita) >= new Date() && apt.estado !== 'cancelada').length === 0 && (
                <p className="text-text-secondary text-center py-4">
                  No hay citas próximas programadas
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {appointments
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(apt => (
                  <div key={apt.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate">
                        Nueva cita de <strong>{apt.nombre_cliente}</strong>
                      </div>
                      <div className="text-xs text-text-secondary">
                        {new Date(apt.createdAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              {appointments.length === 0 && (
                <p className="text-text-secondary text-center py-4">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}