"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Wallet, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate, expenseCategoryLabels } from "@/lib/utils"

const mockExpenses = [
  { id: "1", date: new Date(2024, 10, 22), category: "SUPPLIES", description: "Fournitures médicales", amount: 1500, vendor: "MedSupply" },
  { id: "2", date: new Date(2024, 10, 1), category: "RENT", description: "Loyer mensuel novembre", amount: 5000, vendor: "Propriétaire" },
  { id: "3", date: new Date(2024, 10, 5), category: "UTILITIES", description: "Électricité", amount: 800, vendor: "ONEE" },
  { id: "4", date: new Date(2024, 10, 10), category: "MEDICATIONS", description: "Stock médicaments", amount: 3500, vendor: "Pharma SA" },
  { id: "5", date: new Date(2024, 10, 15), category: "MAINTENANCE", description: "Réparation climatisation", amount: 600, vendor: "TechService" },
]

const categoryColors: Record<string, string> = {
  RENT: "bg-purple-100 text-purple-800",
  UTILITIES: "bg-yellow-100 text-yellow-800",
  SUPPLIES: "bg-blue-100 text-blue-800",
  MEDICATIONS: "bg-emerald-100 text-emerald-800",
  EQUIPMENT: "bg-indigo-100 text-indigo-800",
  SALARY: "bg-orange-100 text-orange-800",
  MAINTENANCE: "bg-slate-100 text-slate-800",
  OTHER: "bg-gray-100 text-gray-800",
}

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="p-6">
      <PageHeader
        title="Dépenses"
        description="Suivez les dépenses de votre cabinet"
        action={{ label: "Nouvelle dépense", href: "/billing/expenses/new", icon: <Plus className="size-4 mr-2" /> }}
      />

      {/* Stats */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <Wallet className="size-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total des dépenses (filtrées)</p>
              <p className="text-2xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {Object.entries(expenseCategoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category]}`}>
                      {expenseCategoryLabels[expense.category]}
                    </span>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-slate-500">{expense.vendor || "-"}</TableCell>
                  <TableCell className="text-right font-medium text-rose-600">-{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Pencil className="size-4 mr-2" />Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600"><Trash2 className="size-4 mr-2" />Supprimer</DropdownMenuItem>
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

