"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Megaphone,
  Image as ImageIcon,
  Upload,
  Eye,
  Trash2,
  Plus,
  X,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Clock
} from "lucide-react";

function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-sm font-semibold" {...props} />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
}

const announcements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Descuento Fin de Semana",
    description: "¡20% de descuento en todos los cursos este fin de semana!",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    linkUrl: "/cursos",
    isActive: true,
    startDate: "2026-04-20",
    endDate: "2026-04-22",
    impressions: 12450,
    clicks: 892
  },
  {
    id: "ANN-002",
    title: "Nuevo Curso de EPP",
    description: "Descubre nuestro nuevo curso avanzado de Equipo de Protección Personal",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    linkUrl: "/cursos/epp-avanzado",
    isActive: false,
    startDate: "2026-04-15",
    endDate: "2026-04-25",
    impressions: 8230,
    clicks: 445
  }
];

export default function MarketingAnnouncementsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    startDate: "",
    endDate: ""
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Anuncio creado:", formData);
    setCreateModalOpen(false);
  };

  const handleToggle = (announcement: Announcement) => {
    console.log("Toggle announcement:", announcement.id, !announcement.isActive);
  };

  const handleDelete = (announcement: Announcement) => {
    console.log("Delete announcement:", announcement.id);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Anuncios Pop-up</h1>
          <p className="text-muted">Gestiona los anuncios emergentes que aparecen en la landing page.</p>
        </div>
        <Button 
          className="bg-pink-500 hover:bg-pink-600 text-white"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Anuncio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Megaphone className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-muted">Total Anuncios</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <ToggleRight className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted">Activos</p>
                <p className="text-2xl font-bold text-success">{announcements.filter(a => a.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted">Impresiones Totales</p>
                <p className="text-2xl font-bold">{announcements.reduce((acc, a) => acc + a.impressions, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="bg-surface/60 border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {/* Preview Image */}
                <div className="relative h-48 bg-gradient-to-br from-pink-500/10 to-purple-500/10">
                  {announcement.imageUrl ? (
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className={announcement.isActive ? "bg-success text-white" : "bg-slate-500 text-white"}>
                      {announcement.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{announcement.title}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{announcement.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(announcement.startDate).toLocaleDateString('es-ES')} - {new Date(announcement.endDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-surface-secondary/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted">Impresiones</p>
                      <p className="text-lg font-bold">{announcement.impressions.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted">Clicks</p>
                      <p className="text-lg font-bold">{announcement.clicks.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border"
                      onClick={() => { setSelectedAnnouncement(announcement); setPreviewModalOpen(true); }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Previsualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={announcement.isActive ? "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20" : "bg-success/10 text-success border-success/30 hover:bg-success/20"}
                      onClick={() => handleToggle(announcement)}
                    >
                      {announcement.isActive ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1" />
                          Activar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-danger/30 text-danger hover:bg-danger/10"
                      onClick={() => handleDelete(announcement)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Nuevo Anuncio Pop-up</h3>
                  <p className="text-xs text-muted">Configura el anuncio que aparecerá en la landing</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título del Anuncio</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: ¡Descuento Especial por Fin de Semana!"
                  className="bg-surface-secondary/50 border-border"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la promoción o anuncio..."
                  className="min-h-[80px] bg-surface-secondary/50 border-border"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Imagen del Anuncio</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center bg-black/10 hover:bg-surface-secondary/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted" />
                  <p className="text-sm font-medium">Arrastra tu imagen o haz clic para subir</p>
                  <p className="text-xs text-muted mt-1">PNG, JPG hasta 5MB. Dimensiones recomendadas: 800x400px</p>
                </div>
              </div>

              {/* Link URL */}
              <div className="space-y-2">
                <Label htmlFor="link">URL de Destino (Opcional)</Label>
                <Input
                  id="link"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="Ej: /cursos/promocion"
                  className="bg-surface-secondary/50 border-border"
                />
                <p className="text-xs text-muted">Los usuarios serán redirigidos al hacer clic en el anuncio.</p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-surface-secondary/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="bg-surface-secondary/50 border-border"
                    required
                  />
                </div>
              </div>

              {/* Preview Info */}
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <strong>Vista previa:</strong> El anuncio aparecerá como pop-up centrado en la landing page con botón de cerrar.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCreateModalOpen(false)}
                  className="hover:bg-surface-secondary"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Crear Anuncio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-3xl w-full animate-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-slate-950 border-2 border-white text-white flex items-center justify-center hover:bg-slate-800 transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Announcement Content */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-64">
                {selectedAnnouncement.imageUrl ? (
                  <img
                    src={selectedAnnouncement.imageUrl}
                    alt={selectedAnnouncement.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted" />
                  </div>
                )}
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-3">{selectedAnnouncement.title}</h2>
                <p className="text-muted mb-6">{selectedAnnouncement.description}</p>
                {selectedAnnouncement.linkUrl && (
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                    Ver Más
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
