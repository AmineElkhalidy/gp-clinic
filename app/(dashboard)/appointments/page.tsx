"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
  User
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate, formatTime, appointmentStatusLabels } from "@/lib/utils"
import { addDays, startOfWeek, format, isSameDay, isToday } from "date-fns"
import { fr } from "date-fns/locale"

// Mock appointments data
const mockAppointments = [
  {
    id: "1",
    patient: { id: "1", firstName: "Mohammed", lastName: "Alami" },
    dateTime: new Date(2024, 10, 25, 9, 0),
    duration: 30,
    type: "Consultation",
    status: "SCHEDULED",
    reason: "Contrôle tension",
  },
  {
    id: "2",
    patient: { id: "2", firstName: "Fatima", lastName: "Benali" },
    dateTime: new Date(2024, 10, 25, 9, 30),
    duration: 30,
    type: "Suivi",
    status: "CONFIRMED",
    reason: "Suivi diabète",
  },
  {
    id: "3",
    patient: { id: "3", firstName: "Ahmed", lastName: "Chraibi" },
    dateTime: new Date(2024, 10, 25, 10, 0),
    duration: 45,
    type: "Première visite",
    status: "IN_PROGRESS",
    reason: "Douleurs abdominales",
  },
  {
    id: "4",
    patient: { id: "4", firstName: "Khadija", lastName: "Fassi" },
    dateTime: new Date(2024, 10, 25, 11, 0),
    duration: 30,
    type: "Urgence",
    status: "SCHEDULED",
    reason: "Fièvre persistante",
  },
  {
    id: "5",
    patient: { id: "5", firstName: "Youssef", lastName: "Tazi" },
    dateTime: new Date(2024, 10, 26, 9, 0),
    duration: 30,
    type: "Consultation",
    status: "SCHEDULED",
    reason: "Certificat médical",
  },
  {
    id: "6",
    patient: { id: "1", firstName: "Mohammed", lastName: "Alami" },
    dateTime: new Date(2024, 10, 27, 14, 0),
    duration: 30,
    type: "Suivi",
    status: "SCHEDULED",
    reason: "Résultats analyses",
  },
]

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  SCHEDULED: "secondary",
  CONFIRMED: "default",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
}

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week">("week")

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const navigatePrev = () => {
    setCurrentDate((prev) => addDays(prev, view === "day" ? -1 : -7))
  }

  const navigateNext = () => {
    setCurrentDate((prev) => addDays(prev, view === "day" ? 1 : 7))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getAppointmentsForDate = (date: Date) => {
    return mockAppointments.filter((apt) => isSameDay(apt.dateTime, date))
  }

  const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8) // 8:00 to 17:00

  return (
    <div className="p-6">
      <PageHeader
        title="Rendez-vous"
        description="Gérez les rendez-vous de votre cabinet"
        action={{
          label: "Nouveau rendez-vous",
          href: "/appointments/new",
          icon: <Plus className="size-4 mr-2" />,
        }}
      />

      {/* Calendar Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={navigatePrev}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Aujourd&apos;hui
              </Button>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <ChevronRight className="size-4" />
              </Button>
              <h2 className="text-lg font-semibold text-slate-900 ml-2">
                {format(currentDate, "MMMM yyyy", { locale: fr })}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Select value={view} onValueChange={(v) => setView(v as "day" | "week")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Jour</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header - Days */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-3 text-center border-r bg-slate-50">
                  <Clock className="size-4 mx-auto text-slate-400" />
                </div>
                {(view === "week" ? weekDays : [currentDate]).map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-3 text-center border-r last:border-r-0 ${
                      isToday(day) ? "bg-teal-50" : "bg-slate-50"
                    }`}
                  >
                    <p className="text-xs text-slate-500 uppercase">
                      {format(day, "EEE", { locale: fr })}
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        isToday(day) ? "text-teal-600" : "text-slate-900"
                      }`}
                    >
                      {format(day, "d")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                  <div className="p-2 text-center border-r bg-slate-50 text-sm text-slate-500">
                    {hour}:00
                  </div>
                  {(view === "week" ? weekDays : [currentDate]).map((day, dayIdx) => {
                    const dayAppointments = getAppointmentsForDate(day).filter(
                      (apt) => apt.dateTime.getHours() === hour
                    )
                    return (
                      <div
                        key={dayIdx}
                        className={`p-1 border-r last:border-r-0 min-h-[80px] ${
                          isToday(day) ? "bg-teal-50/50" : ""
                        }`}
                      >
                        {dayAppointments.map((apt) => (
                          <Link
                            key={apt.id}
                            href={`/appointments/${apt.id}`}
                            className={`block p-2 mb-1 rounded-lg text-xs transition-colors ${
                              apt.status === "IN_PROGRESS"
                                ? "bg-amber-100 hover:bg-amber-200 border-l-2 border-amber-500"
                                : apt.status === "CONFIRMED"
                                ? "bg-teal-100 hover:bg-teal-200 border-l-2 border-teal-500"
                                : apt.status === "CANCELLED"
                                ? "bg-red-50 hover:bg-red-100 border-l-2 border-red-400 opacity-60"
                                : "bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-400"
                            }`}
                          >
                            <p className="font-medium text-slate-900 truncate">
                              {apt.patient.firstName} {apt.patient.lastName}
                            </p>
                            <p className="text-slate-600">
                              {formatTime(apt.dateTime)} - {apt.duration}min
                            </p>
                            <p className="text-slate-500 truncate">{apt.type}</p>
                          </Link>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-teal-600" />
            Rendez-vous du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getAppointmentsForDate(new Date()).length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                Aucun rendez-vous aujourd&apos;hui
              </p>
            ) : (
              getAppointmentsForDate(new Date()).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Avatar>
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {apt.patient.firstName[0]}{apt.patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">
                        {apt.patient.firstName} {apt.patient.lastName}
                      </p>
                      <Badge variant={statusColors[apt.status]}>
                        {appointmentStatusLabels[apt.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {formatTime(apt.dateTime)} - {apt.type} - {apt.reason}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === "SCHEDULED" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Check className="size-4 mr-1" />
                          Confirmer
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/appointments/${apt.id}`}>
                            <Eye className="size-4 mr-2" />
                            Voir
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/patients/${apt.patient.id}`}>
                            <User className="size-4 mr-2" />
                            Voir patient
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/consultations/new?appointmentId=${apt.id}`}>
                            <Pencil className="size-4 mr-2" />
                            Créer consultation
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <X className="size-4 mr-2" />
                          Annuler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

