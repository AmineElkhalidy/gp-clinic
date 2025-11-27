"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Building2, Clock, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const weekDays = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
]

export default function ClinicSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Paramètres du cabinet mis à jour")
    setIsSubmitting(false)
  }

  return (
    <div className="p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/settings"><ArrowLeft className="size-4 mr-2" />Retour aux paramètres</Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cabinet médical</h1>
        <p className="text-slate-500">Paramètres de votre cabinet</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="size-5 text-teal-600" />Informations du cabinet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Nom du cabinet</Label>
                <Input id="clinicName" defaultValue="Cabinet Médical" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorName">Nom du médecin</Label>
                <Input id="doctorName" defaultValue="Dr. Médecin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Spécialité</Label>
                <Input id="specialty" defaultValue="Médecine Générale" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="0524XXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="contact@cabinet.ma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" defaultValue="El Attaouia" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea id="address" defaultValue="Rue Principale, El Attaouia, Maroc" rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="size-5 text-teal-600" />Horaires d&apos;ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekDays.slice(0, 6).map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium text-slate-700">{day.label}</span>
                  <Input type="time" defaultValue="09:00" className="w-28" />
                  <span className="text-slate-400">à</span>
                  <Input type="time" defaultValue="18:00" className="w-28" />
                </div>
              ))}
              <div className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-slate-400">Dimanche</span>
                <span className="text-sm text-slate-500">Fermé</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="size-5 text-teal-600" />Paramètres de facturation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Préfixe des factures</Label>
                <Input id="invoicePrefix" defaultValue="FAC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultPrice">Prix consultation par défaut (MAD)</Label>
                <Input id="defaultPrice" type="number" defaultValue="150" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceFooter">Pied de page des factures</Label>
              <Textarea id="invoiceFooter" placeholder="Texte affiché en bas des factures..." rows={3} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="size-4 mr-2" />{isSubmitting ? "Enregistrement..." : "Enregistrer les paramètres"}
          </Button>
        </div>
      </form>
    </div>
  )
}

