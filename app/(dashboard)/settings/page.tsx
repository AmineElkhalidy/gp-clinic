"use client"

import Link from "next/link"
import { User, Building2, Users, Database, Shield, Bell, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const settingsLinks = [
  { title: "Mon profil", description: "Gérez vos informations personnelles", href: "/settings/profile", icon: User, color: "bg-teal-100 text-teal-600" },
  { title: "Cabinet médical", description: "Paramètres du cabinet", href: "/settings/clinic", icon: Building2, color: "bg-blue-100 text-blue-600" },
  { title: "Utilisateurs", description: "Gérez les comptes utilisateurs", href: "/settings/users", icon: Users, color: "bg-purple-100 text-purple-600" },
]

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Configurez votre application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="card-hover h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`size-12 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                  </div>
                  <ArrowRight className="size-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

