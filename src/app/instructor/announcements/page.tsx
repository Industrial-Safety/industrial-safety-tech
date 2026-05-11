"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Trash2, Loader2, X } from "lucide-react";

interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string | null;
  title: string | null;
  content: string;
  createdAt: string;
}

export default function InstructorAnnouncementsPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/chat/announcements");
      if (res.ok) setAnnouncements(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/proxy/chat/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: session.dbId ?? session.user?.email ?? "unknown",
          authorName: session.user?.name ?? "Instructor",
          authorRole: "INSTRUCTOR",
          authorAvatarUrl: session.user?.image ?? null,
          title: title.trim() || null,
          content: content.trim(),
        }),
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        setShowForm(false);
        load();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 3_600_000) return `Hace ${Math.floor(diff / 60_000)} min`;
    if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Anuncios Organizacionales</h1>
          <p className="text-muted text-sm mt-1">Comunicados para todo el staff (instructores, administradores, soporte)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Nuevo Anuncio"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-primary/20 bg-primary/5 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="Título (opcional)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={150}
              className="bg-surface border-border"
            />
            <textarea
              placeholder="Escribe el comunicado aquí..."
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={2000}
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted">{content.length}/2000 caracteres</span>
              <Button type="submit" disabled={!content.trim() || submitting} className="gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
                Publicar Anuncio
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Megaphone className="h-12 w-12 text-border mb-4" />
          <p className="font-medium">No hay anuncios publicados</p>
          <p className="text-sm mt-1">Los comunicados a la organización aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(a => (
            <Card key={a.id} className="p-5 hover:border-border/80 transition-colors">
              <div className="flex gap-4">
                <Avatar src={a.authorAvatarUrl ?? undefined} fallback={a.authorName[0]} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{a.authorName}</span>
                      <Badge variant="outline" className="text-[9px] py-0 h-4 border-primary/20 text-primary capitalize">
                        {a.authorRole?.toLowerCase()}
                      </Badge>
                      <span className="text-xs text-muted">{formatDate(a.createdAt)}</span>
                    </div>
                  </div>
                  {a.title && (
                    <h3 className="font-bold text-base mb-1">{a.title}</h3>
                  )}
                  <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{a.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
