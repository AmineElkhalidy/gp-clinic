"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Stethoscope,
  Calendar,
  FileText,
  MoreHorizontal,
  Eye,
  Printer,
  User
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"

// Mock consultations data
const mockConsultations = [
  {
    id: "1",
    patient: { id: "1", firstName: "Mohammed", lastName: "Alami" },
    date: new Date(2024, 10, 25),
    diagnosis: "Hypertension artérielle contrôlée",
    doctor: "Dr. Médecin",
    hasPrescription: true,
  },
  {
    id: "2",
    patient: { id: "2", firstName: "Fatima", lastName: "Benali" },
    date: new Date(2024, 10, 24),
    diagnosis: "Grippe saisonnière",
    doctor: "Dr. Médecin",
    hasPrescription: true,
  },
  {
    id: "3",
    patient: { id: "3", firstName: "Ahmed", lastName: "Chraibi" },
    date: new Date(2024, 10, 23),
    diagnosis: "Gastrite aiguë",
    doctor: "Dr. Médecin",
    hasPrescription: true,
  },
  {
    id: "4",
    patient: { id: "4", firstName: "Khadija", lastName: "Fassi" },
    date: new Date(2024, 10, 22),
    diagnosis: "Contrôle de routine",
    doctor: "Dr. Médecin",
    hasPrescription: false,
  },
  {
    id: "5",
    patient: { id: "5", firstName: "Youssef", lastName: "Tazi" },
    date: new Date(2024, 10, 21),
    diagnosis: "Bronchite aiguë",
    doctor: "Dr. Médecin",
    hasPrescription: true,
  },
]

export default function ConsultationsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConsultations = mockConsultations.filter((consultation) => {
    const patientName = `${consultation.patient.firstName} ${consultation.patient.lastName}`.toLowerCase()
    return (
      patientName.includes(searchQuery.toLowerCase()) ||
      consultation.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="p-6">
      <PageHeader
        title="Consultations"
        description="Historique des consultations médicales"
        action={{
          label: "Nouvelle consultation",
          href: "/consultations/new",
          icon: <Plus className="size-4 mr-2" />,
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Stethoscope className="size-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">156</p>
                <p className="text-sm text-slate-500">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">8</p>
                <p className="text-sm text-slate-500">Aujourd&apos;hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FileText className="size-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">89%</p>
                <p className="text-sm text-slate-500">Avec ordonnance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Rechercher par patient ou diagnostic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Consultations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Diagnostic</TableHead>
                <TableHead>Médecin</TableHead>
                <TableHead>Ordonnance</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="text-slate-500">
                      <p className="font-medium">Aucune consultation trouvée</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <Link
                        href={`/patients/${consultation.patient.id}`}
                        className="flex items-center gap-3 hover:opacity-80"
                      >
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                            {consultation.patient.firstName[0]}
                            {consultation.patient.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-900">
                          {consultation.patient.firstName} {consultation.patient.lastName}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(consultation.date)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {consultation.diagnosis}
                    </TableCell>
                    <TableCell>{consultation.doctor}</TableCell>
                    <TableCell>
                      {consultation.hasPrescription ? (
                        <span className="text-emerald-600 font-medium">Oui</span>
                      ) : (
                        <span className="text-slate-400">Non</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/consultations/${consultation.id}`}>
                              <Eye className="size-4 mr-2" />
                              Voir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${consultation.patient.id}`}>
                              <User className="size-4 mr-2" />
                              Voir patient
                            </Link>
                          </DropdownMenuItem>
                          {consultation.hasPrescription && (
                            <DropdownMenuItem>
                              <Printer className="size-4 mr-2" />
                              Imprimer ordonnance
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

