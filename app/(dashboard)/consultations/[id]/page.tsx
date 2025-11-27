"use client"

import { use } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Pencil, 
  Calendar,
  User,
  Activity,
  Stethoscope,
  Pill,
  Printer,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

// Mock consultation data
const mockConsultation = {
  id: "1",
  patient: {
    id: "1",
    firstName: "Mohammed",
    lastName: "Alami",
    dateOfBirth: new Date(1985, 5, 15),
    phone: "0612345678",
  },
  date: new Date(2024, 10, 25),
  doctor: "Dr. Médecin",
  
  // Vital signs
  weight: 75,
  height: 170,
  bloodPressure: "130/85",
  heartRate: 78,
  temperature: 37.2,
  
  // Clinical notes
  chiefComplaint: "Céphalées persistantes depuis 3 jours",
  symptoms: "Maux de tête frontaux, sensation de fatigue, légères nausées.",
  physicalExam: "Patient conscient et orienté. Tension légèrement élevée. Pas de signes neurologiques focaux.",
  diagnosis: "Céphalées de tension, hypertension légère",
  treatmentPlan: "Repos, hydratation, surveillance de la tension artérielle.",
  recommendations: "Éviter le stress, réduire la consommation de sel, contrôle dans 2 semaines.",
  
  // Prescription
  prescriptions: [
    {
      id: "1",
      medications: [
        {
          name: "Paracétamol",
          dosage: "1000mg",
          frequency: "3 fois par jour",
          duration: "5 jours",
          instructions: "En cas de douleur, maximum 3g/jour",
        },
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "1 fois par jour",
          duration: "1 mois",
          instructions: "Le matin, à jeun",
        },
      ],
    },
  ],
}

export default function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const consultation = mockConsultation

  const bmi = (consultation.weight / Math.pow(consultation.height / 100, 2)).toFixed(1)

  return (
    <div className="p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/consultations">
          <ArrowLeft className="size-4 mr-2" />
          Retour aux consultations
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
              {consultation.patient.firstName[0]}{consultation.patient.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Consultation - {consultation.patient.firstName} {consultation.patient.lastName}
            </h1>
            <p className="text-slate-500">
              {formatDate(consultation.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/patients/${consultation.patient.id}`}>
              <User className="size-4 mr-2" />
              Voir patient
            </Link>
          </Button>
          <Button variant="outline">
            <Printer className="size-4 mr-2" />
            Imprimer
          </Button>
          <Button>
            <Pencil className="size-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5 text-teal-600" />
                Signes vitaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Poids</p>
                  <p className="text-lg font-semibold text-slate-900">{consultation.weight} kg</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Taille</p>
                  <p className="text-lg font-semibold text-slate-900">{consultation.height} cm</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500 mb-1">IMC</p>
                  <p className="text-lg font-semibold text-slate-900">{bmi}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Tension</p>
                  <p className="text-lg font-semibold text-amber-600">{consultation.bloodPressure}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Pouls</p>
                  <p className="text-lg font-semibold text-slate-900">{consultation.heartRate} bpm</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500 mb-1">Température</p>
                  <p className="text-lg font-semibold text-slate-900">{consultation.temperature}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="size-5 text-teal-600" />
                Examen clinique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">Motif de consultation</h4>
                <p className="text-slate-900">{consultation.chiefComplaint}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">Symptômes</h4>
                <p className="text-slate-700">{consultation.symptoms}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">Examen physique</h4>
                <p className="text-slate-700">{consultation.physicalExam}</p>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">Diagnostic</h4>
                <p className="font-medium text-slate-900">{consultation.diagnosis}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">Plan de traitement</h4>
                <p className="text-slate-700">{consultation.treatmentPlan}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">Recommandations</h4>
                <p className="text-slate-700">{consultation.recommendations}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Prescription */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pill className="size-5 text-teal-600" />
                Ordonnance
              </CardTitle>
              <Button variant="outline" size="sm">
                <Printer className="size-4 mr-2" />
                Imprimer
              </Button>
            </CardHeader>
            <CardContent>
              {consultation.prescriptions.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Aucune ordonnance</p>
              ) : (
                <div className="space-y-4">
                  {consultation.prescriptions[0].medications.map((med, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-slate-900">{med.name}</h4>
                        <Badge variant="secondary">{med.dosage}</Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-slate-600">
                        <p>📋 {med.frequency}</p>
                        <p>⏱️ {med.duration}</p>
                        {med.instructions && <p>💡 {med.instructions}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-teal-600" />
                Informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Médecin</span>
                <span className="font-medium">{consultation.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium">{formatDate(consultation.date)}</span>
              </div>
              <Separator />
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/billing/invoices/new?consultationId=${consultation.id}&patientId=${consultation.patient.id}`}>
                  Créer une facture
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

