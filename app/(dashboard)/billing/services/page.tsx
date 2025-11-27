"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, CreditCard, Check, X } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  isActive: boolean
}

const initialServices: Service[] = [
  { id: "1", name: "Consultation générale", description: "Consultation médicale standard", price: 150, duration: 30, isActive: true },
  { id: "2", name: "Consultation de suivi", description: "Suivi médical", price: 100, duration: 20, isActive: true },
  { id: "3", name: "Certificat médical", description: "Délivrance de certificat", price: 50, duration: 15, isActive: true },
  { id: "4", name: "Électrocardiogramme (ECG)", description: "Examen cardiaque", price: 200, duration: 30, isActive: true },
  { id: "5", name: "Prise de tension", description: "Mesure de la tension artérielle", price: 30, duration: 10, isActive: true },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", price: "", duration: "" })

  const openDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({ name: service.name, description: service.description, price: service.price.toString(), duration: service.duration.toString() })
    } else {
      setEditingService(null)
      setFormData({ name: "", description: "", price: "", duration: "30" })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 30,
      isActive: true,
    }

    if (editingService) {
      setServices(services.map((s) => (s.id === editingService.id ? newService : s)))
      toast.success("Service modifié")
    } else {
      setServices([...services, newService])
      toast.success("Service ajouté")
    }
    setIsDialogOpen(false)
  }

  const toggleActive = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)))
  }

  const deleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
    toast.success("Service supprimé")
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Services"
        description="Gérez les tarifs de vos services médicaux"
        action={{ label: "Nouveau service", onClick: () => openDialog(), icon: <Plus className="size-4 mr-2" /> }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className={`card-hover ${!service.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <CardDescription className="mt-1">{service.description}</CardDescription>
                </div>
                <Badge variant={service.isActive ? "success" : "secondary"}>
                  {service.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-teal-600">{formatCurrency(service.price)}</p>
                  <p className="text-sm text-slate-500">{service.duration} minutes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={service.isActive} onCheckedChange={() => toggleActive(service.id)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openDialog(service)}>
                  <Pencil className="size-4 mr-1" />Modifier
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteService(service.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Modifier le service" : "Nouveau service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du service *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Consultation générale" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description du service" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix (MAD) *</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Durée (min)</Label>
                <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="30" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.price}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

