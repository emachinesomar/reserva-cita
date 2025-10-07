# Blueprint: Sistema de Reservas de Citas

## 1. Visión General y Objetivo

Construir una aplicación web completa para la reserva de citas con un enfoque en una experiencia de usuario moderna y eficiente. La aplicación permite a los usuarios públicos reservar un horario a través de un flujo de varios pasos y a los administradores gestionar estas citas desde un panel privado.

---

## 2. Guía Técnica del Proyecto

- **Framework:** Next.js (App Router)
- **Base de Datos:** SQLite (para desarrollo local-first)
- **ORM:** Prisma
- **Estilos:** Tailwind CSS
- **Lógica de Backend:** Next.js Server Actions

### Modelo de Datos (`Cita` en `prisma/schema.prisma`)

- `id`: String @id @default(uuid())
- `fecha_cita`: DateTime
- `nombre_cliente`: String
- `email_cliente`: String
- `estado`: String @default("pendiente")
- `createdAt`: DateTime @default(now())

---

## 3. Sistema de Diseño: Clásico y Moderno

Se ha implementado un rediseño visual completo para establecer una estética profesional, limpia y moderna.

- **Filosofía:** Claridad, profesionalismo y consistencia.
- **Paleta de Colores:** Definida en `globals.css` y `tailwind.config.ts`.
  - `primary`: Azul cielo para acciones principales.
  - `background`: Gris claro para el fondo.
  - `card`: Blanco para contenedores.
  - `text-primary`: Azul marino para títulos.
  - `text-secondary`: Gris medio para descripciones.
  - `border`: Gris claro para bordes.

---

## 4. Estado y Fases del Proyecto

### Fase 1: Fundación del Proyecto (Completado)
- Configuración de Next.js, Prisma y SQLite.
- Implementación de las Server Actions (`create`, `update`, `delete`).

### Fase 2: Interfaces Iniciales (Obsoleto)
- Versiones iniciales que fueron completamente reemplazadas.

### Fase 3: Reconstrucción Visual "Clásico y Moderno" (Completado)
- Se definió y aplicó el nuevo sistema de diseño a `globals.css` y `tailwind.config.ts`.
- Se reconstruyó por completo la interfaz de reserva: `page.tsx`, `Sidebar.tsx`, `BookingStepper.tsx`, y `Calendar.tsx`.

### Fase 4: Finalización del Flujo de Reserva (Completado)
- Se modificó `BookingStepper.tsx` para incluir un paso de recolección de datos del usuario (nombre y email).
- Se actualizó la lógica para pasar el objeto de cita completo a la `createAppointment` Server Action.
- Se añadió una pantalla de confirmación de éxito después de la reserva.
- **Resultado:** El problema de datos faltantes en el dashboard está resuelto.

### Fase 5: Rediseño del Panel de Administración (Completado)
- **Objetivo:** Actualizar el diseño del dashboard en `/dashboard` para que coincida con la estética "Clásico y Moderno" del resto de la aplicación.
- **Tareas:**
    - Actualizar el layout general de la página.
    - Aplicar la nueva paleta de colores y componentes a `AppointmentsTable.tsx`.
    - Mejorar la presentación de los datos, como los chips de estado.
- **Resultado:** El diseño del dashboard ha sido completamente actualizado, utilizando las variables de diseño 'Clásico y Moderno' en AppointmentsTable.tsx y elementos relacionados, eliminando 100% de referencias hardcoded y asegurando coherencia total de interfaz en todos los componentes.
