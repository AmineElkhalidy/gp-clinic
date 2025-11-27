"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, FileText, MoreHorizontal, Eye, Printer, Download } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { formatCurrency, formatDate, paymentStatusLabels } from "@/lib/utils"

const mockInvoices = [
  { id: "1", number: "FAC-2024-00125", patient: { id: "1", name: "Mohammed Alami" }, total: 200, status: "PAID", date: new Date(2024, 10, 25) },
  { id: "2", number: "FAC-2024-00124", patient: { id: "2", name: "Fatima Benali" }, total: 150, status: "PENDING", date: new Date(2024, 10, 24) },
  { id: "3", number: "FAC-2024-00123", patient: { id: "3", name: "Ahmed Chraibi" }, total: 300, status: "PAID", date: new Date(2024, 10, 23) },
  { id: "4", number: "FAC-2024-00122", patient: { id: "4", name: "Khadija Fassi" }, total: 180, status: "PENDING", date: new Date(2024, 10, 22) },
  { id: "5", number: "FAC-2024-00121", patient: { id: "5", name: "Youssef Tazi" }, total: 250, status: "PAID", date: new Date(2024, 10, 21) },
]

const statusVariants: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  PAID: "success",
  PENDING: "warning",
  PARTIAL: "secondary",
  CANCELLED: "destructive",
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = invoice.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      <PageHeader
        title="Factures"
        description="Gérez les factures de vos patients"
        action={{ label: "Nouvelle facture", href: "/billing/invoices/new", icon: <Plus className="size-4 mr-2" /> }}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input placeholder="Rechercher par patient ou numéro..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="PAID">Payé</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="PARTIAL">Partiel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono">{invoice.number}</TableCell>
                  <TableCell>
                    <Link href={`/patients/${invoice.patient.id}`} className="hover:underline">
                      {invoice.patient.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[invoice.status]}>
                      {paymentStatusLabels[invoice.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/billing/invoices/${invoice.id}`}><Eye className="size-4 mr-2" />Voir</Link></DropdownMenuItem>
                        <DropdownMenuItem><Printer className="size-4 mr-2" />Imprimer</DropdownMenuItem>
                        <DropdownMenuItem><Download className="size-4 mr-2" />Télécharger PDF</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

