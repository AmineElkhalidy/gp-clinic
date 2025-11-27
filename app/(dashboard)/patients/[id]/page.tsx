"use client"

import { use } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Pencil, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  FileText,
  Stethoscope,
  Receipt,
  User,
  Clock,
  Plus,
  Download,
  Upload,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  formatDate, 
  formatPhone, 
  formatCurrency,
  calculateAge, 
  genderLabels, 
  maritalStatusLabels,
  appointmentStatusLabels
} from "@/lib/utils"

// Mock patient data - will be replaced with actual data
const mockPatient = {
  id: "1",
  firstName: "Mohammed",
  lastName: "Alami",
  dateOfBirth: new Date(1985, 5, 15),
  gender: "MALE",
  maritalStatus: "MARRIED",
  occupation: "Commerçant",
  phone: "0612345678",
  phoneSecondary: "0523456789",
  email: "m.alami@email.com",
  address: "123 Rue Principale",
  city: "El Attaouia",
  bloodType: "A+",
  allergies: "Pénicilline",
  chronicDiseases: "Hypertension artérielle",
  currentMedications: "Amlodipine 5mg",
  familyHistory: "Père diabétique, mère hypertendue",
  notes: "Patient régulier, suivi pour hypertension depuis 2020.",
  createdAt: new Date(2024, 0, 15),
}

const mockConsultations = [
  {
    id: "1",
    date: new Date(2024, 10, 20),
    diagnosis: "Hypertension artérielle contrôlée",
    doctor: "Dr. Médecin",
  },
  {
    id: "2",
    date: new Date(2024, 9, 15),
    diagnosis: "Grippe saisonnière",
    doctor: "Dr. Médecin",
  },
  {
    id: "3",
    date: new Date(2024, 8, 10),
    diagnosis: "Contrôle tension",
    doctor: "Dr. Médecin",
  },
]

const mockAppointments = [
  {
    id: "1",
    dateTime: new Date(2024, 10, 28, 10, 0),
    type: "Suivi",
    status: "SCHEDULED",
  },
]

const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "FAC-2024-00125",
    date: new Date(2024, 10, 20),
    total: 200,
    status: "PAID",
  },
  {
    id: "2",
    invoiceNumber: "FAC-2024-00098",
    date: new Date(2024, 9, 15),
    total: 150,
    status: "PAID",
  },
]

const mockAttachments = [
  {
    id: "1",
    fileName: "Bilan_sanguin_nov2024.pdf",
    fileType: "pdf",
    category: "lab_result",
    uploadedAt: new Date(2024, 10, 18),
  },
  {
    id: "2",
    fileName: "Radio_thorax.jpg",
    fileType: "image",
    category: "radiology",
    uploadedAt: new Date(2024, 9, 10),
  },
]

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const patient = mockPatient // In real app, fetch by id

  return (
    <div className="p-6">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/patients">
          <ArrowLeft className="size-4 mr-2" />
          Retour aux patients
        </Link>
      </Button>

      {/* Patient Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-20">
                <AvatarFallback className="text-2xl bg-teal-100 text-teal-700">
                  {patient.firstName[0]}{patient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {patient.firstName} {patient.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Badge variant="info">
                    {genderLabels[patient.gender]}
                  </Badge>
                  <Badge variant="secondary">
                    {calculateAge(patient.dateOfBirth)} ans
                  </Badge>
                  {patient.bloodType && (
                    <Badge variant="outline">
                      {patient.bloodType}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-4" />
                    {formatPhone(patient.phone)}
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="size-4" />
                      {patient.email}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {patient.city}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href={`/patients/${patient.id}/edit`}>
                  <Pencil className="size-4 mr-2" />
                  Modifier
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/consultations/new?patientId=${patient.id}`}>
                  <Stethoscope className="size-4 mr-2" />
                  Nouvelle consultation
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="attachments">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-5 text-teal-600" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Date de naissance</p>
                    <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">État civil</p>
                    <p className="font-medium">{maritalStatusLabels[patient.maritalStatus]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Profession</p>
                    <p className="font-medium">{patient.occupation || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Patient depuis</p>
                    <p className="font-medium">{formatDate(patient.createdAt)}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Adresse</p>
                  <p className="font-medium">{patient.address}, {patient.city}</p>
                </div>
                {patient.phoneSecondary && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Téléphone secondaire</p>
                    <p className="font-medium">{formatPhone(patient.phoneSecondary)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="size-5 text-teal-600" />
                  Informations médicales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Groupe sanguin</p>
                    <p className="font-medium">{patient.bloodType || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Allergies</p>
                    <p className="font-medium text-red-600">{patient.allergies || "Aucune"}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Maladies chroniques</p>
                  <p className="font-medium">{patient.chronicDiseases || "Aucune"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Médicaments actuels</p>
                  <p className="font-medium">{patient.currentMedications || "Aucun"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Antécédents familiaux</p>
                  <p className="font-medium">{patient.familyHistory || "Non renseigné"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {patient.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-5 text-teal-600" />
                  Notes internes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{patient.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-5 text-teal-600" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockConsultations.slice(0, 3).map((consultation) => (
                  <div key={consultation.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="size-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <Stethoscope className="size-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Consultation</p>
                      <p className="text-sm text-slate-600">{consultation.diagnosis}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(consultation.date)}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/consultations/${consultation.id}`}>Voir</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultations Tab */}
        <TabsContent value="consultations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Historique des consultations</CardTitle>
                <CardDescription>{mockConsultations.length} consultations au total</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/consultations/new?patientId=${patient.id}`}>
                  <Plus className="size-4 mr-2" />
                  Nouvelle consultation
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnostic</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>{formatDate(consultation.date)}</TableCell>
                      <TableCell>{consultation.diagnosis}</TableCell>
                      <TableCell>{consultation.doctor}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/consultations/${consultation.id}`}>Voir</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rendez-vous</CardTitle>
                <CardDescription>Rendez-vous passés et à venir</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/appointments/new?patientId=${patient.id}`}>
                  <Plus className="size-4 mr-2" />
                  Nouveau rendez-vous
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{formatDate(appointment.dateTime)} à {appointment.dateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Badge>{appointmentStatusLabels[appointment.status]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/appointments/${appointment.id}`}>Voir</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Factures</CardTitle>
                <CardDescription>Historique des facturations</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/billing/invoices/new?patientId=${patient.id}`}>
                  <Plus className="size-4 mr-2" />
                  Nouvelle facture
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <Badge variant="success">Payé</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/billing/invoices/${invoice.id}`}>Voir</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Résultats d&apos;analyses, radiologies et autres documents</CardDescription>
              </div>
              <Button>
                <Upload className="size-4 mr-2" />
                Ajouter un document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-colors"
                  >
                    <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      {attachment.fileType === "pdf" ? (
                        <FileText className="size-5 text-red-500" />
                      ) : (
                        <FileText className="size-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(attachment.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Download className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-red-500 hover:text-red-600">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

