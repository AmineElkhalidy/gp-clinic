"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Plus, Trash2, User, FileText } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

const mockPatients = [
  { id: "1", name: "Mohammed Alami" },
  { id: "2", name: "Fatima Benali" },
  { id: "3", name: "Ahmed Chraibi" },
]

const mockServices = [
  { id: "1", name: "Consultation générale", price: 150 },
  { id: "2", name: "Consultation de suivi", price: 100 },
  { id: "3", name: "Certificat médical", price: 50 },
  { id: "4", name: "Électrocardiogramme", price: 200 },
]

interface InvoiceItem {
  id: string
  serviceId: string
  description: string
  quantity: number
  unitPrice: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatientId = searchParams.get("patientId")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(preselectedPatientId || "")
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [discount, setDiscount] = useState(0)

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), serviceId: "", description: "", quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item
      if (field === "serviceId") {
        const service = mockServices.find((s) => s.id === value)
        return { ...item, serviceId: value as string, description: service?.name || "", unitPrice: service?.price || 0 }
      }
      return { ...item, [field]: value }
    }))
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const total = subtotal - discount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Facture créée", { description: "La facture a été créée avec succès." })
    router.push("/billing/invoices")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/billing/invoices"><ArrowLeft className="size-4 mr-2" />Retour aux factures</Link>
        </Button>
        <PageHeader title="Nouvelle facture" description="Créez une nouvelle facture" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Patient */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="size-5 text-teal-600" />Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPatient} onValueChange={setSelectedPatient} required>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un patient" /></SelectTrigger>
                  <SelectContent>
                    {mockPatients.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><FileText className="size-5 text-teal-600" />Articles</CardTitle>
                  <CardDescription>Services et prestations facturés</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addItem}><Plus className="size-4 mr-2" />Ajouter</Button>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Cliquez sur &quot;Ajouter&quot; pour ajouter des articles</p>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Article {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-600"><Trash2 className="size-4" /></Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <Label>Service</Label>
                            <Select value={item.serviceId} onValueChange={(v) => updateItem(item.id, "serviceId", v)}>
                              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                              <SelectContent>
                                {mockServices.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name} - {formatCurrency(s.price)}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Quantité</Label>
                            <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)} />
                          </div>
                          <div>
                            <Label>Prix unitaire</Label>
                            <Input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent>
                <Textarea placeholder="Notes additionnelles..." rows={3} />
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader><CardTitle>Résumé</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between"><span className="text-slate-500">Sous-total</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Remise</span>
                  <Input type="number" className="w-24 text-right" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-teal-600">{formatCurrency(total)}</span></div>
                <Separator />
                <div className="space-y-2">
                  <Label>Mode de paiement</Label>
                  <Select defaultValue="CASH">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Espèces</SelectItem>
                      <SelectItem value="CARD">Carte bancaire</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Virement</SelectItem>
                      <SelectItem value="CHECK">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || items.length === 0}>
                  <Save className="size-4 mr-2" />{isSubmitting ? "Enregistrement..." : "Créer la facture"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

