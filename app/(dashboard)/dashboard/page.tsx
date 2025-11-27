"use client"

import { 
  Users, 
  Calendar, 
  Stethoscope, 
  TrendingUp, 
  TrendingDown,
  Clock,
  UserPlus,
  CalendarCheck,
  DollarSign,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatCurrency, formatDate, formatTime } from "@/lib/utils"
import Link from "next/link"

// Mock data for demonstration
const stats = [
  {
    title: "Patients",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    description: "Total des patients",
    gradient: "stat-gradient-teal",
  },
  {
    title: "Rendez-vous",
    value: "28",
    change: "+5",
    trend: "up",
    icon: Calendar,
    description: "Cette semaine",
    gradient: "stat-gradient-blue",
  },
  {
    title: "Consultations",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: Stethoscope,
    description: "Ce mois",
    gradient: "stat-gradient-emerald",
  },
  {
    title: "Revenus",
    value: formatCurrency(45600),
    change: "+15%",
    trend: "up",
    icon: DollarSign,
    description: "Ce mois",
    gradient: "stat-gradient-amber",
  },
]

const todayAppointments = [
  {
    id: "1",
    patient: { firstName: "Mohammed", lastName: "Alami" },
    time: new Date(2024, 10, 25, 9, 0),
    type: "Consultation",
    status: "CONFIRMED",
  },
  {
    id: "2",
    patient: { firstName: "Fatima", lastName: "Benali" },
    time: new Date(2024, 10, 25, 9, 30),
    type: "Suivi",
    status: "SCHEDULED",
  },
  {
    id: "3",
    patient: { firstName: "Ahmed", lastName: "Chraibi" },
    time: new Date(2024, 10, 25, 10, 0),
    type: "Consultation",
    status: "IN_PROGRESS",
  },
  {
    id: "4",
    patient: { firstName: "Khadija", lastName: "Fassi" },
    time: new Date(2024, 10, 25, 10, 30),
    type: "Urgence",
    status: "SCHEDULED",
  },
  {
    id: "5",
    patient: { firstName: "Youssef", lastName: "Tazi" },
    time: new Date(2024, 10, 25, 11, 0),
    type: "Consultation",
    status: "SCHEDULED",
  },
]

const recentPatients = [
  {
    id: "1",
    firstName: "Amina",
    lastName: "Berrada",
    phone: "0612345678",
    lastVisit: new Date(2024, 10, 24),
  },
  {
    id: "2",
    firstName: "Omar",
    lastName: "Kettani",
    phone: "0698765432",
    lastVisit: new Date(2024, 10, 23),
  },
  {
    id: "3",
    firstName: "Salma",
    lastName: "Idrissi",
    phone: "0655443322",
    lastVisit: new Date(2024, 10, 22),
  },
]

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
  SCHEDULED: { label: "Programmé", variant: "secondary" },
  CONFIRMED: { label: "Confirmé", variant: "default" },
  IN_PROGRESS: { label: "En cours", variant: "warning" },
  COMPLETED: { label: "Terminé", variant: "success" },
  CANCELLED: { label: "Annulé", variant: "destructive" },
}

export default function DashboardPage() {
  const currentDate = new Date()
  
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Bonjour, Dr. Médecin 👋
          </h1>
          <p className="text-slate-500">
            {formatDate(currentDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/patients/new">
              <UserPlus className="size-4 mr-2" />
              Nouveau patient
            </Link>
          </Button>
          <Button asChild>
            <Link href="/appointments/new">
              <CalendarCheck className="size-4 mr-2" />
              Nouveau rendez-vous
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover overflow-hidden">
            <div className={`${stat.gradient} p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <stat.icon className="size-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {stat.trend === "up" ? (
                  <TrendingUp className="size-4 text-white/80" />
                ) : (
                  <TrendingDown className="size-4 text-white/80" />
                )}
                <span className="text-sm text-white/80">
                  {stat.change} {stat.description}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-teal-600" />
                Rendez-vous d&apos;aujourd&apos;hui
              </CardTitle>
              <CardDescription>
                {todayAppointments.length} rendez-vous programmés
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/appointments">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-medium">
                        {appointment.patient.firstName[0]}
                        {appointment.patient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </p>
                      <p className="text-sm text-slate-500">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        {formatTime(appointment.time)}
                      </p>
                    </div>
                    <Badge variant={statusConfig[appointment.status]?.variant || "secondary"}>
                      {statusConfig[appointment.status]?.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-teal-600" />
                Patients récents
              </CardTitle>
              <CardDescription>
                Dernières visites
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/patients">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <Link
                  key={patient.id}
                  href={`/patients/${patient.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Avatar>
                    <AvatarFallback className="bg-slate-100 text-slate-600 text-sm">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{patient.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      {formatDate(patient.lastVisit)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-teal-600" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/patients/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center"
            >
              <div className="size-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <UserPlus className="size-6 text-teal-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Nouveau patient
              </span>
            </Link>
            <Link
              href="/appointments/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center"
            >
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CalendarCheck className="size-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Nouveau rendez-vous
              </span>
            </Link>
            <Link
              href="/consultations/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center"
            >
              <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Stethoscope className="size-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Nouvelle consultation
              </span>
            </Link>
            <Link
              href="/billing/invoices/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center"
            >
              <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <DollarSign className="size-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Nouvelle facture
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

