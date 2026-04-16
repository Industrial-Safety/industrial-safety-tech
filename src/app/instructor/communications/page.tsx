"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Headphones, UserCircle, MoreVertical, Paperclip, ChevronLeft, Inbox, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Contacts Base
const CONTACTS_STUDENTS = [
  {
    id: "stu-1",
    name: "Foro: Riesgo Eléctrico (Carlos D.)",
    role: "Operador de Planta",
    avatar: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop&crop=faces",
    isAdmin: false,
    lastMsg: "No me quedó claro la diferencia entre Alta y Media tensión...",
    time: "10:30 AM",
    unread: 1,
    online: true,
    messages: [
      { id: 1, sender: "them", text: "Profesor, buenas tardes. En el módulo 3 no me quedó claro la diferencia entre Alta y Media tensión según la normativa ISO.", time: "10:15 AM" }
    ]
  },
  {
    id: "stu-2",
    name: "Foro: EPP Avanzado (Ana T.)",
    role: "Supervisor HSE",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    isAdmin: false,
    lastMsg: "Perfecto, aplicaré ese mismo protocolo.",
    time: "Ayer",
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: "them", text: "¿Puedo usar la mascarilla 3M 6000 para químicos?", time: "09:02 AM" },
      { id: 2, sender: "me", text: "Correcto Ana, la mascarilla 3M serie 6000 también te sirve si le colocas los filtros 6003 (gases ácidos).", time: "05:00 PM" },
      { id: 3, sender: "them", text: "Perfecto, aplicaré ese mismo protocolo.", time: "10:30 AM" }
    ]
  }
];

const CONTACTS_ADMIN = [
  {
    id: "adm-ticket-812",
    name: "Ticket #812 - Problema Servidor",
    role: "Soporte Técnico Sistema",
    avatar: "",
    isAdmin: true,
    lastMsg: "Hemos purgado la caché. Intenta subir el video de nuevo.",
    time: "Lun",
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: "me", text: "Hola equipo de IT. Tengo un error al subir un video de 500MB en el módulo de EPP.", time: "09:00 AM" },
      { id: 2, sender: "them", text: "Hola Roberto. Hemos diagnosticado el problema, era un colapso en la caché del S3 Bucket.", time: "05:00 PM" },
      { id: 3, sender: "them", text: "Hemos purgado la caché. Intenta subir el video de nuevo.", time: "05:15 PM" }
    ]
  }
];

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<"students" | "admin">("students");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [inputText, setInputText] = useState("");

  const [studentChats, setStudentChats] = useState(CONTACTS_STUDENTS);
  const [adminChats, setAdminChats] = useState(CONTACTS_ADMIN);

  const activeContactsList = activeTab === "students" ? studentChats : adminChats;
  // Initialize with first contact if available, though handled dynamically below
  const [activeChatId, setActiveChatId] = useState(studentChats[0].id);

  // If changing tabs, auto-select the first of the new tab
  const handleTabChange = (tab: "students" | "admin") => {
    setActiveTab(tab);
    setMobileView("list");
    const newList = tab === "students" ? studentChats : adminChats;
    if(newList.length > 0) setActiveChatId(newList[0].id);
  };

  const activeContact = activeContactsList.find(c => c.id === activeChatId) || null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (activeTab === "students") {
      setStudentChats(studentChats.map(c => {
        if (c.id === activeChatId) {
           return { ...c, messages: [...c.messages, newMessage], lastMsg: inputText, time: "Ahora" };
        }
        return c;
      }));
    } else {
      setAdminChats(adminChats.map(c => {
        if (c.id === activeChatId) {
           return { ...c, messages: [...c.messages, newMessage], lastMsg: inputText, time: "Ahora" };
        }
        return c;
      }));
    }
    
    setInputText("");
  };

  const filteredContacts = activeContactsList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-10rem)] bg-background flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 rounded-xl overflow-hidden pb-16 md:pb-0">
      
      {/* Sidebar: Contacts List */}
      <Card className={cn(
        "w-full md:w-80 lg:w-96 flex-col shrink-0 border-border bg-surface/50 overflow-hidden h-[calc(100vh-14rem)] md:h-full",
        mobileView === "chat" ? "hidden md:flex" : "flex"
      )}>
        
        <div className="flex border-b border-border bg-surface-secondary/30 shrink-0">
           <button 
             onClick={() => handleTabChange('students')}
             className={cn("flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2", activeTab === 'students' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted border-b-2 border-transparent hover:text-foreground')}
           >
             <Inbox className="h-4 w-4" /> Alumnos
           </button>
           <button 
             onClick={() => handleTabChange('admin')}
             className={cn("flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2", activeTab === 'admin' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted border-b-2 border-transparent hover:text-foreground')}
           >
             <ShieldAlert className="h-4 w-4" /> IT Support
           </button>
        </div>

        <div className="p-4 border-b border-border space-y-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input 
              placeholder={activeTab === 'students' ? "Buscar alumno o foro..." : "Buscar ticket de soporte..."} 
              className="pl-9 bg-surface-secondary/50 border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => {
                setActiveChatId(contact.id);
                setMobileView("chat");
              }}
              className={cn(
                "w-full text-left p-3 flex gap-3 rounded-lg transition-colors border",
                activeChatId === contact.id 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-transparent border-transparent hover:bg-surface-secondary"
              )}
            >
              <div className="relative shrink-0">
                {contact.isAdmin ? (
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-black">
                    <Headphones className="h-5 w-5" />
                  </div>
                ) : (
                  <Avatar src={contact.avatar} fallback={<UserCircle className="h-6 w-6" />} />
                )}
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden text-sm pt-0.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={cn("font-bold truncate", contact.isAdmin && "text-primary")}>{contact.name}</span>
                  <span className="text-[10px] text-muted whitespace-nowrap">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="text-xs text-muted truncate">{contact.lastMsg}</p>
                  {contact.unread > 0 && (
                    <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center shrink-0 text-[10px]">
                      {contact.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filteredContacts.length === 0 && (
            <div className="p-4 text-center text-sm text-muted">Bandeja vacía</div>
          )}
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card className={cn(
        "flex-1 flex-col border-border bg-surface/50 overflow-hidden h-[calc(100vh-14rem)] md:h-full",
        mobileView === "list" ? "hidden md:flex" : "flex"
      )}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 md:px-6 bg-surface-secondary/20">
              <div className="flex items-center gap-2 md:gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden shrink-0 h-8 w-8 text-muted hover:text-foreground"
                  onClick={() => setMobileView("list")}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="relative">
                  {activeContact.isAdmin ? (
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-black">
                      <Headphones className="h-5 w-5" />
                    </div>
                  ) : (
                    <Avatar src={activeContact.avatar} fallback={<UserCircle className="h-6 w-6" />} />
                  )}
                  {activeContact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className={cn("font-bold text-sm", activeContact.isAdmin && "text-primary")}>
                    {activeContact.name}
                  </h3>
                  <p className="text-xs text-muted">{activeContact.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted hover:text-foreground">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col relative w-full">
              {activeContact.messages.map((msg, idx) => {
                const isMe = msg.sender === "me";
                return (
                  <div key={idx} className={cn("flex max-w-[80%] flex-col", isMe ? "self-end items-end" : "self-start items-start")}>
                    <div 
                      className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm",
                        isMe 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-surface-secondary border border-border rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted mt-1 px-1">
                      {msg.time} {isMe && "✓✓"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border bg-surface-secondary/10 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted hover:text-foreground">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  placeholder={activeTab === 'students' ? "Responder al foro..." : "Escribir mensaje a IT que incluye log de error..."}
                  className="flex-1 bg-surface border-border"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button type="submit" size="icon" className="shrink-0" disabled={!inputText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-muted">
              <MessageSquare className="h-12 w-12 text-border mb-4" />
              <p>Selecciona una conversación para responder</p>
           </div>
        )}
      </Card>

    </div>
  );
}
