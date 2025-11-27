"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Phone, MapPin, Heart, FileText } from "lucide-react"
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

export default function NewPatientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState<Date>()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Patient créé avec succès", {
      description: "Le nouveau patient a été ajouté à votre liste.",
    })

    router.push("/patients")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/patients">
            <ArrowLeft className="size-4 mr-2" />
            Retour aux patients
          </Link>
        </Button>
        <PageHeader
          title="Nouveau patient"
          description="Créez un nouveau dossier patient"
        />
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
                placeholder="Prénom du patient"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Nom du patient"
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
              <Select name="gender">
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
              <Select name="maritalStatus">
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
                placeholder="Profession du patient"
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
                placeholder="06XXXXXXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneSecondary">Téléphone secondaire</Label>
              <Input
                id="phoneSecondary"
                name="phoneSecondary"
                type="tel"
                placeholder="06XXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@exemple.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                name="city"
                placeholder="Ville"
                defaultValue="El Attaouia"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Adresse du patient"
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
              <Select name="bloodType">
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
                placeholder="Allergies connues"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="chronicDiseases">Maladies chroniques</Label>
              <Textarea
                id="chronicDiseases"
                name="chronicDiseases"
                placeholder="Diabète, hypertension, etc."
                rows={2}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="currentMedications">Médicaments actuels</Label>
              <Textarea
                id="currentMedications"
                name="currentMedications"
                placeholder="Liste des médicaments en cours"
                rows={2}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="familyHistory">Antécédents familiaux</Label>
              <Textarea
                id="familyHistory"
                name="familyHistory"
                placeholder="Antécédents médicaux familiaux importants"
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
                placeholder="Notes internes sur le patient..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/patients">Annuler</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="size-4 mr-2" />
            {isSubmitting ? "Enregistrement..." : "Enregistrer le patient"}
          </Button>
        </div>
      </form>
    </div>
  )
}

