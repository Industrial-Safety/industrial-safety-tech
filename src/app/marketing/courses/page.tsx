"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Percent,
  Tag,
  Clock,
  Users,
  Star,
  Plus,
  Settings,
  Copy,
  CheckCircle,
  X
} from "lucide-react";

interface Course {
  id: string;
  name: string;
  price: number;
  students: number;
  rating: number;
  image: string;
  hasPromotion: boolean;
  promotion?: {
    type: "percentage" | "fixed";
    value: number;
    code: string;
    maxUses: number;
    currentUses: number;
    expiryDate: string;
  };
}

const courses: Course[] = [
  {
    id: "1",
    name: "Uso Correcto de EPP",
    price: 89.99,
    students: 1240,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    hasPromotion: true,
    promotion: {
      type: "percentage",
      value: 20,
      code: "EPP20",
      maxUses: 100,
      currentUses: 45,
      expiryDate: "2026-05-15"
    }
  },
  {
    id: "2",
    name: "Seguridad en Alturas",
    price: 129.99,
    students: 890,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80",
    hasPromotion: false
  },
  {
    id: "3",
    name: "Primeros Auxilios Básicos",
    price: 79.99,
    students: 2100,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1516574187841-69301976e495?w=400&q=80",
    hasPromotion: true,
    promotion: {
      type: "fixed",
      value: 15,
      code: "PRIMEROS15",
      maxUses: 200,
      currentUses: 156,
      expiryDate: "2026-04-30"
    }
  },
  {
    id: "4",
    name: "Manejo de Extintores",
    price: 59.99,
    students: 1580,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1582214307525-ee9ebc82f939?w=400&q=80",
    hasPromotion: false
  }
];

export default function MarketingCoursesPage() {
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [promotionCreated, setPromotionCreated] = useState(false);
  const [formData, setFormData] = useState({
    type: "percentage" as "percentage" | "fixed",
    value: 20,
    code: "",
    maxUses: 100,
    expiryDate: ""
  });

  const handleCreatePromotion = (course: Course) => {
    setSelectedCourse(course);
    setPromotionModalOpen(true);
    setPromotionCreated(false);
    setFormData({
      type: "percentage",
      value: 20,
      code: "",
      maxUses: 100,
      expiryDate: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromotionCreated(true);
    // Aquí iría la lógica para enviar a backend
    console.log("Promoción creada:", { course: selectedCourse, ...formData });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(formData.code || "PROMO2026");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gestión de Cursos</h1>
          <p className="text-muted">Crea y gestiona promociones para los cursos disponibles.</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id} className="bg-surface/60 border-border overflow-hidden hover:border-pink-500/50 transition-colors group">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/* Course Image */}
                <div className="sm:w-2/5 relative h-48 sm:h-auto">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.hasPromotion && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-pink-500 text-white">
                        <Percent className="h-3 w-3 mr-1" />
                        {course.promotion?.type === "percentage" 
                          ? `${course.promotion.value}% OFF` 
                          : `$${course.promotion?.value} OFF`}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="sm:w-3/5 p-5">
                  <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} estudiantes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {course.hasPromotion && course.promotion ? (
                        <>
                          <p className="text-xs text-muted line-through">${course.price}</p>
                          <p className="text-xl font-bold text-pink-500">
                            ${course.promotion.type === "percentage" 
                              ? (course.price * (1 - course.promotion.value / 100)).toFixed(2) 
                              : (course.price - course.promotion.value).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-xl font-bold">${course.price}</p>
                      )}
                    </div>
                  </div>

                  {course.hasPromotion ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-pink-500">Código Activo</p>
                            <p className="text-sm font-mono font-bold">{course.promotion?.code}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={handleCopyCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {course.promotion?.currentUses} / {course.promotion?.maxUses} usos
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Vence: {new Date(course.promotion?.expiryDate || "").toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-border"
                        onClick={() => handleCreatePromotion(course)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Editar Promoción
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                      onClick={() => handleCreatePromotion(course)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Promoción
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Promotion Modal */}
      {promotionModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedCourse.hasPromotion ? "Editar Promoción" : "Crear Promoción"}
                  </h3>
                  <p className="text-xs text-muted">{selectedCourse.name}</p>
                </div>
              </div>
              <button
                onClick={() => setPromotionModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {promotionCreated ? (
                /* Success State */
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                    <CheckCircle className="h-8 w-8 text-success animate-in zoom-in duration-300" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">¡Promoción Registrada Exitosamente!</h4>
                  <p className="text-muted mb-6">
                    La promoción ha sido creada y está lista para usarse.
                  </p>
                  
                  {/* Promo Code Display */}
                  <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20 mb-6">
                    <p className="text-xs text-pink-300 mb-2">Código de Promoción</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-2xl font-mono font-bold text-pink-500">{formData.code || "PROMO2026"}</p>
                      <Button variant="outline" size="sm" onClick={handleCopyCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-surface-secondary/30 rounded-lg">
                      <p className="text-xs text-muted">Descuento</p>
                      <p className="text-lg font-bold">
                        {formData.type === "percentage" ? `${formData.value}%` : `$${formData.value}`}
                      </p>
                    </div>
                    <div className="p-3 bg-surface-secondary/30 rounded-lg">
                      <p className="text-xs text-muted">Usos Máximos</p>
                      <p className="text-lg font-bold">{formData.maxUses}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setPromotionModalOpen(false)} 
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Listo
                  </Button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Promotion Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "percentage" })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === "percentage" 
                          ? "border-pink-500 bg-pink-500/10" 
                          : "border-border bg-surface-secondary/30 hover:border-pink-500/50"
                      }`}
                    >
                      <Percent className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                      <p className="text-sm font-semibold">Porcentaje</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "fixed" })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === "fixed" 
                          ? "border-pink-500 bg-pink-500/10" 
                          : "border-border bg-surface-secondary/30 hover:border-pink-500/50"
                      }`}
                    >
                      <Tag className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                      <p className="text-sm font-semibold">Monto Fijo</p>
                    </button>
                  </div>

                  {/* Discount Value */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Valor del Descuento {formData.type === "percentage" ? "(%)" : "($)"}
                    </label>
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                      min={1}
                      max={formData.type === "percentage" ? 90 : selectedCourse.price}
                      className="bg-surface-secondary/50 border-border"
                    />
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Código de Promoción</label>
                    <Input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="Ej: EPP20"
                      className="bg-surface-secondary/50 border-border font-mono uppercase"
                    />
                    <p className="text-xs text-muted">
                      Los usuarios ingresarán este código al momento de comprar.
                    </p>
                  </div>

                  {/* Max Uses */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Usos Máximos</label>
                    <Input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                      min={1}
                      className="bg-surface-secondary/50 border-border"
                    />
                    <p className="text-xs text-muted">
                      Número máximo de veces que se puede usar este cupón.
                    </p>
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Fecha de Vencimiento</label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="bg-surface-secondary/50 border-border"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setPromotionModalOpen(false)}
                      className="hover:bg-surface-secondary"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Crear Promoción
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
