"use client"

import { use } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Pencil, 
  Calendar,
  Clock,
  User,
  Stethoscope,
  Check,
  X,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  formatDate, 
  formatTime,
  appointmentStatusLabels
} from "@/lib/utils"

// Mock appointment data
const mockAppointment = {
  id: "1",
  patient: {
    id: "1",
    firstName: "Mohammed",
    lastName: "Alami",
    phone: "0612345678",
    email: "m.alami@email.com",
  },
  dateTime: new Date(2024, 10, 25, 9, 0),
  duration: 30,
  type: "Consultation",
  status: "SCHEDULED",
  reason: "Contrôle tension artérielle",
  notes: "Patient habituel, suivi hypertension.",
  createdAt: new Date(2024, 10, 20),
}

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  SCHEDULED: "secondary",
  CONFIRMED: "default",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
}

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const appointment = mockAppointment

  return (
    <div className="p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/appointments">
          <ArrowLeft className="size-4 mr-2" />
          Retour aux rendez-vous
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Details */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5 text-teal-600" />
                  Détails du rendez-vous
                </CardTitle>
              </div>
              <Badge variant={statusColors[appointment.status]}>
                {appointmentStatusLabels[appointment.status]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Date</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(appointment.dateTime, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Heure</p>
                  <p className="font-medium text-slate-900">
                    {formatTime(appointment.dateTime)} ({appointment.duration} min)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Type</p>
                  <p className="font-medium text-slate-900">{appointment.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Créé le</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(appointment.createdAt)}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-500 mb-1">Motif de la visite</p>
                <p className="font-medium text-slate-900">{appointment.reason}</p>
              </div>
              {appointment.notes && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Notes</p>
                  <p className="text-slate-700">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {appointment.status === "SCHEDULED" && (
                  <Button variant="outline">
                    <Check className="size-4 mr-2" />
                    Confirmer
                  </Button>
                )}
                {(appointment.status === "SCHEDULED" || appointment.status === "CONFIRMED") && (
                  <Button asChild>
                    <Link href={`/consultations/new?appointmentId=${appointment.id}&patientId=${appointment.patient.id}`}>
                      <Stethoscope className="size-4 mr-2" />
                      Démarrer la consultation
                    </Link>
                  </Button>
                )}
                <Button variant="outline">
                  <Pencil className="size-4 mr-2" />
                  Modifier
                </Button>
                {appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" && (
                  <Button variant="destructive">
                    <X className="size-4 mr-2" />
                    Annuler
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Patient Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-teal-600" />
                Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                    {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{appointment.patient.phone}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/patients/${appointment.patient.id}`}>
                  Voir le dossier patient
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

