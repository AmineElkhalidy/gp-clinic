"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Users, Pencil, Trash2, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { userRoleLabels } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: "DOCTOR" | "ASSISTANT"
  phone: string
}

const initialUsers: User[] = [
  { id: "1", name: "Dr. Médecin", email: "dr.medecin@cabinet.ma", role: "DOCTOR", phone: "0612345678" },
  { id: "2", name: "Assistante Marie", email: "marie@cabinet.ma", role: "ASSISTANT", phone: "0698765432" },
]

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", role: "ASSISTANT" as "DOCTOR" | "ASSISTANT", phone: "", password: "" })

  const openDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({ name: user.name, email: user.email, role: user.role, phone: user.phone, password: "" })
    } else {
      setEditingUser(null)
      setFormData({ name: "", email: "", role: "ASSISTANT", phone: "", password: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const newUser: User = {
      id: editingUser?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
    }

    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? newUser : u)))
      toast.success("Utilisateur modifié")
    } else {
      setUsers([...users, newUser])
      toast.success("Utilisateur ajouté")
    }
    setIsDialogOpen(false)
  }

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      toast.error("Impossible de supprimer le dernier utilisateur")
      return
    }
    setUsers(users.filter((u) => u.id !== id))
    toast.success("Utilisateur supprimé")
  }

  return (
    <div className="p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/settings"><ArrowLeft className="size-4 mr-2" />Retour aux paramètres</Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-500">Gérez les comptes utilisateurs du cabinet</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="size-4 mr-2" />Nouvel utilisateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className={user.role === "DOCTOR" ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"}>
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{user.name}</h3>
                    <Badge variant={user.role === "DOCTOR" ? "default" : "secondary"}>
                      {userRoleLabels[user.role]}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="text-sm text-slate-500">{user.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(user)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom complet *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom complet" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@exemple.com" />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="06XXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Rôle *</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as "DOCTOR" | "ASSISTANT" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCTOR">Médecin</SelectItem>
                  <SelectItem value="ASSISTANT">Assistant(e)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label>Mot de passe *</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="********" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.email}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

