"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Save, 
  User, 
  Activity, 
  Stethoscope, 
  Pill,
  Plus,
  Trash2 
} from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Mock patients
const mockPatients = [
  { id: "1", firstName: "Mohammed", lastName: "Alami" },
  { id: "2", firstName: "Fatima", lastName: "Benali" },
  { id: "3", firstName: "Ahmed", lastName: "Chraibi" },
  { id: "4", firstName: "Khadija", lastName: "Fassi" },
  { id: "5", firstName: "Youssef", lastName: "Tazi" },
]

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export default function NewConsultationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatientId = searchParams.get("patientId")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(preselectedPatientId || "")
  const [medications, setMedications] = useState<Medication[]>([])

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ])
  }

  const removeMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Consultation enregistrée", {
      description: "La consultation a été enregistrée avec succès.",
    })

    router.push("/consultations")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/consultations">
            <ArrowLeft className="size-4 mr-2" />
            Retour aux consultations
          </Link>
        </Button>
        <PageHeader
          title="Nouvelle consultation"
          description="Enregistrez une nouvelle consultation médicale"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-teal-600" />
              Patient
            </CardTitle>
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
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-teal-600" />
              Signes vitaux
            </CardTitle>
            <CardDescription>
              Mesures physiologiques du patient
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="170"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Tension (mmHg)</Label>
              <Input
                id="bloodPressure"
                name="bloodPressure"
                placeholder="120/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heartRate">Pouls (bpm)</Label>
              <Input
                id="heartRate"
                name="heartRate"
                type="number"
                placeholder="72"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Température (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                placeholder="37"
              />
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
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Motif de consultation *</Label>
              <Input
                id="chiefComplaint"
                name="chiefComplaint"
                placeholder="Raison principale de la visite"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptômes</Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="Description des symptômes..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalExam">Examen physique</Label>
              <Textarea
                id="physicalExam"
                name="physicalExam"
                placeholder="Résultats de l'examen physique..."
                rows={3}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnostic *</Label>
              <Textarea
                id="diagnosis"
                name="diagnosis"
                placeholder="Diagnostic établi..."
                rows={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatmentPlan">Plan de traitement</Label>
              <Textarea
                id="treatmentPlan"
                name="treatmentPlan"
                placeholder="Plan de traitement recommandé..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommandations</Label>
              <Textarea
                id="recommendations"
                name="recommendations"
                placeholder="Conseils et recommandations au patient..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescription */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Pill className="size-5 text-teal-600" />
                Ordonnance
              </CardTitle>
              <CardDescription>
                Médicaments prescrits au patient
              </CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={addMedication}>
              <Plus className="size-4 mr-2" />
              Ajouter un médicament
            </Button>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                Aucun médicament ajouté. Cliquez sur &quot;Ajouter un médicament&quot; pour créer une ordonnance.
              </p>
            ) : (
              <div className="space-y-6">
                {medications.map((med, index) => (
                  <div key={med.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900">
                        Médicament {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(med.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom du médicament *</Label>
                        <Input
                          value={med.name}
                          onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                          placeholder="Ex: Amoxicilline"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          value={med.dosage}
                          onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                          placeholder="Ex: 500mg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fréquence</Label>
                        <Input
                          value={med.frequency}
                          onChange={(e) => updateMedication(med.id, "frequency", e.target.value)}
                          placeholder="Ex: 3 fois par jour"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Durée</Label>
                        <Input
                          value={med.duration}
                          onChange={(e) => updateMedication(med.id, "duration", e.target.value)}
                          placeholder="Ex: 7 jours"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Instructions</Label>
                        <Input
                          value={med.instructions}
                          onChange={(e) => updateMedication(med.id, "instructions", e.target.value)}
                          placeholder="Ex: À prendre après les repas"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/consultations">Annuler</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="size-4 mr-2" />
            {isSubmitting ? "Enregistrement..." : "Enregistrer la consultation"}
          </Button>
        </div>
      </form>
    </div>
  )
}

