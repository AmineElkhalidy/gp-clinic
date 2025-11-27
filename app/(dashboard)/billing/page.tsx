"use client"

import Link from "next/link"
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowRight,
  FileText,
  CreditCard
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"

// Mock data
const stats = {
  monthlyRevenue: 45600,
  monthlyExpenses: 12400,
  pendingInvoices: 5,
  pendingAmount: 3200,
}

const recentInvoices = [
  { id: "1", number: "FAC-2024-00125", patient: "Mohammed Alami", amount: 200, status: "PAID", date: new Date(2024, 10, 25) },
  { id: "2", number: "FAC-2024-00124", patient: "Fatima Benali", amount: 150, status: "PENDING", date: new Date(2024, 10, 24) },
  { id: "3", number: "FAC-2024-00123", patient: "Ahmed Chraibi", amount: 300, status: "PAID", date: new Date(2024, 10, 23) },
]

const recentExpenses = [
  { id: "1", description: "Fournitures médicales", category: "SUPPLIES", amount: 1500, date: new Date(2024, 10, 22) },
  { id: "2", description: "Loyer mensuel", category: "RENT", amount: 5000, date: new Date(2024, 10, 1) },
  { id: "3", description: "Électricité", category: "UTILITIES", amount: 800, date: new Date(2024, 10, 5) },
]

export default function BillingPage() {
  const profit = stats.monthlyRevenue - stats.monthlyExpenses

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Facturation</h1>
        <p className="text-slate-500">Gérez vos factures et dépenses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-hover overflow-hidden">
          <div className="stat-gradient-emerald p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Revenus du mois</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
              </div>
              <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="size-6 text-white" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="card-hover overflow-hidden">
          <div className="stat-gradient-rose p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Dépenses du mois</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(stats.monthlyExpenses)}
                </p>
              </div>
              <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingDown className="size-6 text-white" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="card-hover overflow-hidden">
          <div className="stat-gradient-teal p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Bénéfice net</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(profit)}
                </p>
              </div>
              <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet className="size-6 text-white" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="card-hover overflow-hidden">
          <div className="stat-gradient-amber p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">En attente</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
              <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Receipt className="size-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-white/80 mt-2">{stats.pendingInvoices} factures</p>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          href="/billing/invoices"
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 transition-colors"
        >
          <div className="size-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <FileText className="size-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Factures</h3>
            <p className="text-sm text-slate-500">Gérer les factures</p>
          </div>
          <ArrowRight className="size-5 text-slate-400" />
        </Link>

        <Link
          href="/billing/expenses"
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 transition-colors"
        >
          <div className="size-12 rounded-xl bg-rose-100 flex items-center justify-center">
            <Wallet className="size-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Dépenses</h3>
            <p className="text-sm text-slate-500">Suivi des dépenses</p>
          </div>
          <ArrowRight className="size-5 text-slate-400" />
        </Link>

        <Link
          href="/billing/services"
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 transition-colors"
        >
          <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <CreditCard className="size-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Services</h3>
            <p className="text-sm text-slate-500">Tarifs des services</p>
          </div>
          <ArrowRight className="size-5 text-slate-400" />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dernières factures</CardTitle>
              <CardDescription>Factures récentes</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/billing/invoices">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/billing/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">{invoice.patient}</p>
                    <p className="text-sm text-slate-500">{invoice.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{formatCurrency(invoice.amount)}</p>
                    <p className={`text-sm ${invoice.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
                      {invoice.status === "PAID" ? "Payé" : "En attente"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dernières dépenses</CardTitle>
              <CardDescription>Dépenses récentes</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/billing/expenses">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">{expense.description}</p>
                    <p className="text-sm text-slate-500">{formatDate(expense.date)}</p>
                  </div>
                  <p className="font-medium text-rose-600">-{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

