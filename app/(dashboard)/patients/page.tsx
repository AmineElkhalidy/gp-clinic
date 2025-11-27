"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate, formatPhone, genderLabels, calculateAge } from "@/lib/utils"

// Mock data - will be replaced with actual data from the database
const mockPatients = [
  {
    id: "1",
    firstName: "Mohammed",
    lastName: "Alami",
    dateOfBirth: new Date(1985, 5, 15),
    gender: "MALE",
    phone: "0612345678",
    email: "m.alami@email.com",
    city: "El Attaouia",
    createdAt: new Date(2024, 0, 15),
    lastVisit: new Date(2024, 10, 20),
  },
  {
    id: "2",
    firstName: "Fatima",
    lastName: "Benali",
    dateOfBirth: new Date(1990, 2, 22),
    gender: "FEMALE",
    phone: "0698765432",
    email: "f.benali@email.com",
    city: "El Attaouia",
    createdAt: new Date(2024, 1, 10),
    lastVisit: new Date(2024, 10, 18),
  },
  {
    id: "3",
    firstName: "Ahmed",
    lastName: "Chraibi",
    dateOfBirth: new Date(1978, 8, 5),
    gender: "MALE",
    phone: "0655443322",
    email: null,
    city: "Marrakech",
    createdAt: new Date(2024, 2, 5),
    lastVisit: new Date(2024, 10, 15),
  },
  {
    id: "4",
    firstName: "Khadija",
    lastName: "Fassi",
    dateOfBirth: new Date(1995, 11, 10),
    gender: "FEMALE",
    phone: "0661122334",
    email: "k.fassi@email.com",
    city: "El Attaouia",
    createdAt: new Date(2024, 3, 20),
    lastVisit: new Date(2024, 10, 10),
  },
  {
    id: "5",
    firstName: "Youssef",
    lastName: "Tazi",
    dateOfBirth: new Date(1982, 7, 28),
    gender: "MALE",
    phone: "0677889900",
    email: "y.tazi@email.com",
    city: "El Attaouia",
    createdAt: new Date(2024, 4, 12),
    lastVisit: new Date(2024, 10, 5),
  },
]

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("all")

  // Filter patients based on search and filters
  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)

    const matchesGender =
      genderFilter === "all" || patient.gender === genderFilter

    return matchesSearch && matchesGender
  })

  return (
    <div className="p-6">
      <PageHeader
        title="Patients"
        description="Gérez les dossiers de vos patients"
        action={{
          label: "Nouveau patient",
          href: "/patients/new",
          icon: <Plus className="size-4 mr-2" />,
        }}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <svg className="size-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{mockPatients.length}</p>
                <p className="text-sm text-slate-500">Total patients</p>
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
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-sm text-slate-500">Nouveaux ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="size-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">89%</p>
                <p className="text-sm text-slate-500">Taux de fidélité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="MALE">Homme</SelectItem>
                <SelectItem value="FEMALE">Femme</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Dernière visite</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="text-slate-500">
                      <p className="font-medium">Aucun patient trouvé</p>
                      <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <Link href={`/patients/${patient.id}`} className="flex items-center gap-3 hover:opacity-80">
                        <Avatar>
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-medium">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-slate-500">
                            Patient depuis {formatDate(patient.createdAt, { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="size-3.5" />
                          {formatPhone(patient.phone)}
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Mail className="size-3.5" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-700">
                        {calculateAge(patient.dateOfBirth)} ans
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.gender === "MALE" ? "info" : "default"}>
                        {genderLabels[patient.gender]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="size-3.5" />
                        {patient.city}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">
                        {formatDate(patient.lastVisit)}
                      </span>
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
                            <Link href={`/patients/${patient.id}`}>
                              <Eye className="size-4 mr-2" />
                              Voir le profil
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}/edit`}>
                              <Pencil className="size-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="size-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
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

