"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Calendar, Clock, User } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"

// Mock patients for selection
const mockPatients = [
  { id: "1", firstName: "Mohammed", lastName: "Alami", phone: "0612345678" },
  { id: "2", firstName: "Fatima", lastName: "Benali", phone: "0698765432" },
  { id: "3", firstName: "Ahmed", lastName: "Chraibi", phone: "0655443322" },
  { id: "4", firstName: "Khadija", lastName: "Fassi", phone: "0661122334" },
  { id: "5", firstName: "Youssef", lastName: "Tazi", phone: "0677889900" },
]

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
]

const appointmentTypes = [
  { value: "consultation", label: "Consultation" },
  { value: "follow_up", label: "Suivi" },
  { value: "first_visit", label: "Première visite" },
  { value: "emergency", label: "Urgence" },
  { value: "certificate", label: "Certificat médical" },
]

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatientId = searchParams.get("patientId")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState<Date>()
  const [selectedPatient, setSelectedPatient] = useState(preselectedPatientId || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Rendez-vous créé", {
      description: "Le rendez-vous a été programmé avec succès.",
    })

    router.push("/appointments")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/appointments">
            <ArrowLeft className="size-4 mr-2" />
            Retour aux rendez-vous
          </Link>
        </Button>
        <PageHeader
          title="Nouveau rendez-vous"
          description="Programmez un nouveau rendez-vous"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-teal-600" />
              Patient
            </CardTitle>
            <CardDescription>
              Sélectionnez le patient pour ce rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select
                value={selectedPatient}
                onValueChange={setSelectedPatient}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500">
                <Link href="/patients/new" className="text-teal-600 hover:underline">
                  Créer un nouveau patient
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-teal-600" />
              Date et heure
            </CardTitle>
            <CardDescription>
              Choisissez la date et l&apos;heure du rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date *</Label>
              <DatePicker
                date={appointmentDate}
                onSelect={setAppointmentDate}
                placeholder="Sélectionner une date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Select name="time" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Select name="duration" defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-teal-600" />
              Détails du rendez-vous
            </CardTitle>
            <CardDescription>
              Type et motif de la consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Type de rendez-vous</Label>
              <Select name="type" defaultValue="consultation">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Motif de la visite</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Ex: Contrôle annuel, douleurs..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Notes supplémentaires..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/appointments">Annuler</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="size-4 mr-2" />
            {isSubmitting ? "Enregistrement..." : "Programmer le rendez-vous"}
          </Button>
        </div>
      </form>
    </div>
  )
}

