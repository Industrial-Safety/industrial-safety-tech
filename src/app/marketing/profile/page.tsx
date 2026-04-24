"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Tag,
  Activity,
  Award
} from "lucide-react";
import { useState } from "react";

export default function MarketingProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Laura Martínez",
    email: "laura.martinez@prevenciontech.com",
    phone: "+51 987 654 321",
    location: "Lima, Perú",
    department: "Marketing Digital"
  });

  const stats = [
    { label: "Campañas Creadas", value: "24", icon: Activity },
    { label: "Conversiones", value: "1,594", icon: Award },
    { label: "Ingresos Generados", value: "$45,280", icon: Tag }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Perfil</h1>
        <p className="text-muted">Gestiona tu información personal y configuración de cuenta.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Profile Card */}
        <Card className="lg:col-span-1 bg-surface/60 border-border h-fit">
          <CardContent className="p-6">
            <div className="text-center">
              <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces"
                alt="Laura Martínez"
                size="xl"
                className="mx-auto mb-4 border-4 border-pink-500/20"
              />
              <h2 className="text-xl font-bold">{formData.name}</h2>
              <Badge className="mt-2 bg-pink-500/10 text-pink-500 border-pink-500/30">
                <Tag className="h-3 w-3 mr-1" />
                Encargado de Marketing
              </Badge>
              
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted" />
                  <span className="text-muted">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted" />
                  <span className="text-muted">{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted" />
                  <span className="text-muted">{formData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted" />
                  <span className="text-muted">Desde Marzo 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card className="lg:col-span-2 bg-surface/60 border-border">
          <CardHeader>
            <CardTitle>Rendimiento del Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="h-5 w-5 text-pink-500" />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-3 bg-surface/60 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Información Personal</CardTitle>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre Completo</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="bg-surface-secondary/50 border-border disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="bg-surface-secondary/50 border-border disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Teléfono</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="bg-surface-secondary/50 border-border disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ubicación</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className="bg-surface-secondary/50 border-border disabled:opacity-50"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold">Departamento</label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={!isEditing}
                  className="bg-surface-secondary/50 border-border disabled:opacity-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
