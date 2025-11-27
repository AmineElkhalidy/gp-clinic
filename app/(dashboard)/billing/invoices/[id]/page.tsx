"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Printer, Download, User, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate, paymentStatusLabels, paymentMethodLabels } from "@/lib/utils"

const mockInvoice = {
  id: "1",
  number: "FAC-2024-00125",
  patient: { id: "1", firstName: "Mohammed", lastName: "Alami", phone: "0612345678", address: "123 Rue Principale, El Attaouia" },
  date: new Date(2024, 10, 25),
  dueDate: new Date(2024, 11, 25),
  status: "PAID",
  paymentMethod: "CASH",
  paymentDate: new Date(2024, 10, 25),
  items: [
    { description: "Consultation générale", quantity: 1, unitPrice: 150, total: 150 },
    { description: "Électrocardiogramme", quantity: 1, unitPrice: 200, total: 200 },
  ],
  subtotal: 350,
  discount: 50,
  total: 300,
  amountPaid: 300,
  notes: "Patient régulier - remise de fidélité appliquée.",
}

const statusVariants: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  PAID: "success", PENDING: "warning", PARTIAL: "secondary", CANCELLED: "destructive",
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const invoice = mockInvoice

  return (
    <div className="p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/billing/invoices"><ArrowLeft className="size-4 mr-2" />Retour aux factures</Link>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{invoice.number}</h1>
            <Badge variant={statusVariants[invoice.status]}>{paymentStatusLabels[invoice.status]}</Badge>
          </div>
          <p className="text-slate-500">{formatDate(invoice.date)}</p>
        </div>
        <div className="flex gap-3">
          {invoice.status === "PENDING" && (
            <Button><Check className="size-4 mr-2" />Marquer comme payé</Button>
          )}
          <Button variant="outline"><Printer className="size-4 mr-2" />Imprimer</Button>
          <Button variant="outline"><Download className="size-4 mr-2" />PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Items */}
          <Card>
            <CardHeader><CardTitle>Détails de la facture</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qté</TableHead>
                    <TableHead className="text-right">Prix unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 bg-slate-50 space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Sous-total</span><span>{formatCurrency(invoice.subtotal)}</span></div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Remise</span><span>-{formatCurrency(invoice.discount)}</span></div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatCurrency(invoice.total)}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent><p className="text-slate-700">{invoice.notes}</p></CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="size-5 text-teal-600" />Patient</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{invoice.patient.firstName} {invoice.patient.lastName}</p>
              <p className="text-sm text-slate-500">{invoice.patient.phone}</p>
              <p className="text-sm text-slate-500">{invoice.patient.address}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/patients/${invoice.patient.id}`}>Voir le profil</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Paiement</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Statut</span><Badge variant={statusVariants[invoice.status]}>{paymentStatusLabels[invoice.status]}</Badge></div>
              {invoice.paymentMethod && (
                <div className="flex justify-between"><span className="text-slate-500">Mode</span><span>{paymentMethodLabels[invoice.paymentMethod]}</span></div>
              )}
              {invoice.paymentDate && (
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span>{formatDate(invoice.paymentDate)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-slate-500">Montant payé</span><span className="font-medium text-emerald-600">{formatCurrency(invoice.amountPaid)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

