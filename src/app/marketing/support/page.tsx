"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Headphones,
  MessageCircle,
  Mail,
  Phone,
  Search,
  HelpCircle,
  BookOpen,
  Send
} from "lucide-react";

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}

const faqs = [
  {
    question: "¿Cómo creo una promoción para un curso?",
    answer: "Ve a la sección de Cursos, selecciona el curso deseado y haz clic en 'Crear Promoción'. Completa el formulario con los detalles del descuento y envía la solicitud a Gerencia para aprobación."
  },
  {
    question: "¿Cuánto tiempo tarda Gerencia en aprobar una solicitud?",
    answer: "El tiempo promedio de respuesta es de 24-48 horas hábiles. Recibirás una notificación cuando tu solicitud sea revisada."
  },
  {
    question: "¿Puedo editar un anuncio pop-up ya publicado?",
    answer: "Sí, puedes desactivar el anuncio actual y crear uno nuevo con los cambios deseados. Los anuncios activos no pueden ser editados directamente para mantener consistencia."
  },
  {
    question: "¿Cómo veo el rendimiento de mis campañas?",
    answer: "En el Dashboard principal puedes ver métricas en tiempo real de impresiones, clicks y conversiones de todas tus campañas activas."
  }
];

export default function MarketingSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: ""
  });

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 mb-4">
          <Headphones className="h-8 w-8 text-pink-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Centro de Soporte</h1>
        <p className="text-muted">¿Necesitas ayuda? Encuentra respuestas o contacta con nuestro equipo.</p>
      </div>

      {/* Search */}
      <Card className="bg-surface/60 border-border">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <Input
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-surface-secondary/50 border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-surface/40 border-border hover:border-pink-500/50 transition-colors">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Chat en Vivo</h3>
            <p className="text-sm text-muted mb-4">Respuesta inmediata en horario de oficina</p>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white w-full">
              Iniciar Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-surface/40 border-border hover:border-pink-500/50 transition-colors">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted mb-4">Respuesta en 24-48 horas</p>
            <Button variant="outline" className="w-full border-border">
              soporte@prevenciontech.com
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-surface/40 border-border hover:border-pink-500/50 transition-colors">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Teléfono</h3>
            <p className="text-sm text-muted mb-4">Lun-Vie 9AM-6PM</p>
            <Button variant="outline" className="w-full border-border">
              +51 1 234 5678
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card className="bg-surface/60 border-border">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-pink-500" />
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="p-4 rounded-lg bg-surface-secondary/30 border border-border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-pink-500" />
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted">{faq.answer}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No se encontraron resultados para "{searchTerm}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="bg-surface/60 border-border">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enviar Consulta</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Asunto</label>
              <select
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm"
              >
                <option value="">Selecciona un asunto...</option>
                <option value="promociones">Consultas sobre Promociones</option>
                <option value="anuncios">Consultas sobre Anuncios</option>
                <option value="tecnico">Soporte Técnico</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Mensaje</label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe tu consulta..."
                className="min-h-[120px] bg-surface-secondary/50 border-border"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                <Send className="h-4 w-4 mr-2" />
                Enviar Consulta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
