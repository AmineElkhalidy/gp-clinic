"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Phone, Heart, FileText, Trash2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

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
}

export default function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(mockPatient.dateOfBirth)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Patient mis à jour", {
      description: "Les modifications ont été enregistrées.",
    })

    router.push(`/patients/${id}`)
  }

  const handleDelete = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast.success("Patient supprimé", {
      description: "Le dossier patient a été supprimé.",
    })

    router.push("/patients")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/patients/${id}`}>
            <ArrowLeft className="size-4 mr-2" />
            Retour au profil
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <PageHeader
            title="Modifier le patient"
            description={`${mockPatient.firstName} ${mockPatient.lastName}`}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="size-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ce patient ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le dossier du patient et tout son historique
                  seront définitivement supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-teal-600" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Informations de base du patient
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={mockPatient.firstName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={mockPatient.lastName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <DatePicker
                date={dateOfBirth}
                onSelect={setDateOfBirth}
                placeholder="Sélectionner une date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Genre</Label>
              <Select name="gender" defaultValue={mockPatient.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Homme</SelectItem>
                  <SelectItem value="FEMALE">Femme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">État civil</Label>
              <Select name="maritalStatus" defaultValue={mockPatient.maritalStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Célibataire</SelectItem>
                  <SelectItem value="MARRIED">Marié(e)</SelectItem>
                  <SelectItem value="DIVORCED">Divorcé(e)</SelectItem>
                  <SelectItem value="WIDOWED">Veuf/Veuve</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Profession</Label>
              <Input
                id="occupation"
                name="occupation"
                defaultValue={mockPatient.occupation}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-5 text-teal-600" />
              Coordonnées
            </CardTitle>
            <CardDescription>
              Informations de contact du patient
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={mockPatient.phone}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneSecondary">Téléphone secondaire</Label>
              <Input
                id="phoneSecondary"
                name="phoneSecondary"
                type="tel"
                defaultValue={mockPatient.phoneSecondary}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={mockPatient.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                name="city"
                defaultValue={mockPatient.city}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue={mockPatient.address}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-5 text-teal-600" />
              Informations médicales
            </CardTitle>
            <CardDescription>
              Antécédents et informations médicales importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Groupe sanguin</Label>
              <Select name="bloodType" defaultValue={mockPatient.bloodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                name="allergies"
                defaultValue={mockPatient.allergies}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="chronicDiseases">Maladies chroniques</Label>
              <Textarea
                id="chronicDiseases"
                name="chronicDiseases"
                defaultValue={mockPatient.chronicDiseases}
                rows={2}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="currentMedications">Médicaments actuels</Label>
              <Textarea
                id="currentMedications"
                name="currentMedications"
                defaultValue={mockPatient.currentMedications}
                rows={2}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="familyHistory">Antécédents familiaux</Label>
              <Textarea
                id="familyHistory"
                name="familyHistory"
                defaultValue={mockPatient.familyHistory}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-teal-600" />
              Notes internes
            </CardTitle>
            <CardDescription>
              Notes privées visibles uniquement par le personnel médical
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={mockPatient.notes}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/patients/${id}`}>Annuler</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="size-4 mr-2" />
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  )
}

