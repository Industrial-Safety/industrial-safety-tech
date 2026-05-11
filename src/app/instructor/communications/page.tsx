"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Send, Headphones, UserCircle, MoreVertical,
  ChevronLeft, Inbox, ShieldAlert, MessageSquare, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface ForumPost {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorRole: string | null;
  authorAvatarUrl: string | null;
  content: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  authorId: string;
  authorName: string;
  authorRole: string | null;
  authorAvatarUrl: string | null;
  content: string;
  createdAt: string;
}

interface CourseThread {
  courseId: string;
  courseTitle: string;
  posts: ForumPost[];
  lastActivity: string;
  unread: number;
}

const ADMIN_CONTACTS = [
  {
    id: "adm-ticket-812",
    name: "Ticket #812 - Problema Servidor",
    role: "Soporte Técnico Sistema",
    isAdmin: true,
    lastMsg: "Hemos purgado la caché. Intenta subir el video de nuevo.",
    time: "Lun",
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: "me", text: "Hola equipo de IT. Tengo un error al subir un video de 500MB en el módulo de EPP.", time: "09:00 AM" },
      { id: 2, sender: "them", text: "Hola Roberto. Hemos diagnosticado el problema, era un colapso en la caché del S3 Bucket.", time: "05:00 PM" },
      { id: 3, sender: "them", text: "Hemos purgado la caché. Intenta subir el video de nuevo.", time: "05:15 PM" },
    ],
  },
];

export default function CommunicationsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"students" | "admin">("students");
  const [threads, setThreads] = useState<CourseThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<CourseThread | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [adminInput, setAdminInput] = useState("");
  const [adminChats, setAdminChats] = useState(ADMIN_CONTACTS);
  const [activeAdminId, setActiveAdminId] = useState(ADMIN_CONTACTS[0].id);

  useEffect(() => {
    if (activeTab === "students") loadForumThreads();
  }, [activeTab, session?.dbId]);

  const loadForumThreads = async () => {
    if (!session?.dbId) return;
    setLoading(true);
    try {
      const coursesRes = await fetch("/api/proxy/course/my-courses");
      if (!coursesRes.ok) return;
      const courses: any[] = await coursesRes.json();

      const built: CourseThread[] = [];
      for (const course of courses) {
        const postsRes = await fetch(`/api/proxy/chat/forum/${course.id}`);
        if (!postsRes.ok) continue;
        const posts: ForumPost[] = await postsRes.json();
        if (posts.length === 0) continue;
        const lastPost = posts[0];
        const unread = posts.filter(p =>
          !p.replies.some(r => r.authorId === (session.dbId as string))
        ).length;
        built.push({
          courseId: course.id,
          courseTitle: course.title,
          posts,
          lastActivity: lastPost.createdAt,
          unread,
        });
      }
      setThreads(built);
      if (built.length > 0) setSelectedThread(built[0]);
    } catch (e) {
      console.error("Error cargando foros:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!reply.trim() || !session) return;
    setSending(true);
    try {
      const body = {
        authorId: session.dbId ?? session.user?.email ?? "instructor",
        authorName: session.user?.name ?? "Instructor",
        authorRole: "INSTRUCTOR",
        authorAvatarUrl: session.user?.image ?? null,
        content: reply.trim(),
      };
      const res = await fetch(`/api/proxy/chat/forum/${selectedThread?.courseId}/${postId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setReply("");
        loadForumThreads();
      }
    } catch (e) {
      console.error("Error enviando respuesta:", e);
    } finally {
      setSending(false);
    }
  };

  const handleAdminSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInput.trim()) return;
    setAdminChats(prev => prev.map(c => {
      if (c.id !== activeAdminId) return c;
      return {
        ...c,
        messages: [...c.messages, {
          id: Date.now(),
          sender: "me",
          text: adminInput.trim(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }],
        lastMsg: adminInput.trim(),
        time: "Ahora",
      };
    }));
    setAdminInput("");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 3_600_000) return `Hace ${Math.floor(diff / 60_000)} min`;
    if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const filteredThreads = threads.filter(t =>
    t.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const activeAdmin = adminChats.find(c => c.id === activeAdminId);

  return (
    <div className="h-[calc(100vh-10rem)] bg-background flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 rounded-xl overflow-hidden pb-16 md:pb-0">

      {/* Sidebar */}
      <Card className={cn(
        "w-full md:w-80 lg:w-96 flex-col shrink-0 border-border bg-surface/50 overflow-hidden h-[calc(100vh-14rem)] md:h-full",
        mobileView === "chat" ? "hidden md:flex" : "flex"
      )}>
        <div className="flex border-b border-border bg-surface-secondary/30 shrink-0">
          <button
            onClick={() => { setActiveTab("students"); setMobileView("list"); }}
            className={cn("flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2",
              activeTab === "students" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted border-b-2 border-transparent hover:text-foreground")}
          >
            <Inbox className="h-4 w-4" /> Alumnos
          </button>
          <button
            onClick={() => { setActiveTab("admin"); setMobileView("list"); }}
            className={cn("flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2",
              activeTab === "admin" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted border-b-2 border-transparent hover:text-foreground")}
          >
            <ShieldAlert className="h-4 w-4" /> IT Support
          </button>
        </div>

        <div className="p-4 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input
              placeholder="Buscar..."
              className="pl-9 bg-surface-secondary/50 border-border"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === "students" && (
            loading ? (
              <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-muted" /></div>
            ) : filteredThreads.length === 0 ? (
              <p className="p-4 text-sm text-muted text-center">Sin mensajes de alumnos</p>
            ) : filteredThreads.map(thread => (
              <button
                key={thread.courseId}
                onClick={() => { setSelectedThread(thread); setMobileView("chat"); }}
                className={cn(
                  "w-full text-left p-3 flex gap-3 rounded-lg transition-colors border",
                  selectedThread?.courseId === thread.courseId
                    ? "bg-primary/10 border-primary/30"
                    : "bg-transparent border-transparent hover:bg-surface-secondary"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {thread.courseTitle.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold truncate">{thread.courseTitle}</span>
                    <span className="text-[10px] text-muted whitespace-nowrap">{formatDate(thread.lastActivity)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-muted truncate">
                      {thread.posts[0]?.content.slice(0, 50)}...
                    </p>
                    {thread.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center shrink-0 text-[10px]">
                        {thread.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}

          {activeTab === "admin" && adminChats.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveAdminId(c.id); setMobileView("chat"); }}
              className={cn(
                "w-full text-left p-3 flex gap-3 rounded-lg transition-colors border",
                activeAdminId === c.id
                  ? "bg-primary/10 border-primary/30"
                  : "bg-transparent border-transparent hover:bg-surface-secondary"
              )}
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-black shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-primary truncate">{c.name}</span>
                  <span className="text-[10px] text-muted">{c.time}</span>
                </div>
                <p className="text-xs text-muted truncate">{c.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Panel derecho */}
      <Card className={cn(
        "flex-1 flex-col border-border bg-surface/50 overflow-hidden h-[calc(100vh-14rem)] md:h-full",
        mobileView === "list" ? "hidden md:flex" : "flex"
      )}>

        {/* --- Vista alumnos (foro por hilos) --- */}
        {activeTab === "students" && selectedThread && (
          <>
            <div className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 md:px-6 bg-surface-secondary/20">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 text-muted" onClick={() => setMobileView("list")}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="font-bold text-sm">Foro: {selectedThread.courseTitle}</h3>
                  <p className="text-xs text-muted">{selectedThread.posts.length} pregunta(s)</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted hover:text-foreground">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {selectedThread.posts.map(post => (
                <div key={post.id} className="space-y-3">
                  {/* Pregunta */}
                  <div className="flex gap-4">
                    <Avatar src={post.authorAvatarUrl ?? undefined} fallback={<UserCircle className="h-5 w-5" />} className="shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{post.authorName}</span>
                        <span className="text-xs text-muted">{formatDate(post.createdAt)}</span>
                      </div>
                      <p className="text-sm bg-surface-secondary/40 p-3 rounded-lg rounded-tl-none border border-border/50">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {/* Respuestas existentes */}
                  {post.replies.map((r, ri) => (
                    <div key={ri} className="flex gap-4 ml-12">
                      <Avatar src={r.authorAvatarUrl ?? undefined} fallback={r.authorName[0]}
                        className={cn("shrink-0", r.authorRole === "INSTRUCTOR" && "ring-2 ring-primary/50")} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("font-semibold text-sm", r.authorRole === "INSTRUCTOR" && "text-primary")}>
                            {r.authorName}
                          </span>
                          {r.authorRole === "INSTRUCTOR" && (
                            <Badge variant="outline" className="text-[9px] py-0 h-4 border-primary/20 text-primary">Instructor</Badge>
                          )}
                          <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                        </div>
                        <p className={cn("text-sm p-3 rounded-lg rounded-tl-none border", r.authorRole === "INSTRUCTOR"
                          ? "bg-primary/5 border-primary/20"
                          : "bg-surface-secondary/40 border-border/50"
                        )}>
                          {r.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Respuesta del instructor */}
                  <div className="ml-12 flex gap-3 items-center">
                    <Avatar src={session?.user?.image ?? undefined} fallback={(session?.user?.name ?? "I")[0]}
                      className="shrink-0 ring-2 ring-primary/50" />
                    <div className="relative flex-1">
                      <Input
                        placeholder="Responder como instructor..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(post.id); } }}
                        className="pr-12 bg-surface border-border"
                      />
                      <Button
                        size="icon" variant="ghost" type="button"
                        disabled={!reply.trim() || sending}
                        onClick={() => handleReply(post.id)}
                        className="absolute right-1 top-1 h-8 w-8 text-primary hover:bg-primary/10"
                      >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* --- Vista admin (chat simple) --- */}
        {activeTab === "admin" && activeAdmin && (
          <>
            <div className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 md:px-6 bg-surface-secondary/20">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 text-muted" onClick={() => setMobileView("list")}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-black">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary">{activeAdmin.name}</h3>
                  <p className="text-xs text-muted">{activeAdmin.role}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              {activeAdmin.messages.map((msg, i) => {
                const isMe = msg.sender === "me";
                return (
                  <div key={i} className={cn("flex max-w-[80%] flex-col", isMe ? "self-end items-end" : "self-start items-start")}>
                    <div className={cn("p-3 rounded-2xl text-sm shadow-sm",
                      isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-surface-secondary border border-border rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted mt-1 px-1">{msg.time} {isMe && "✓✓"}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-border bg-surface-secondary/10 shrink-0">
              <form onSubmit={handleAdminSend} className="flex gap-2">
                <Input
                  placeholder="Escribir mensaje a IT..."
                  className="flex-1 bg-surface border-border"
                  value={adminInput}
                  onChange={e => setAdminInput(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={!adminInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}

        {/* Estado vacío */}
        {((activeTab === "students" && !selectedThread) || (activeTab === "admin" && !activeAdmin)) && (
          <div className="flex-1 flex flex-col items-center justify-center text-muted">
            <MessageSquare className="h-12 w-12 text-border mb-4" />
            <p>Selecciona una conversación</p>
          </div>
        )}
      </Card>
    </div>
  );
}
