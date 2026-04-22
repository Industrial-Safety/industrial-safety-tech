"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Headphones, UserCircle, MoreVertical, Paperclip, ChevronLeft, MessageSquare, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Contacts Base para Jefe de Seguridad
const CONTACTS = [
  {
    id: "c-support",
    name: "Soporte Técnico Nivel 2",
    role: "Administración de Sistemas",
    avatar: "",
    isSupport: true,
    lastMsg: "El firmware de la cámara 3 ha sido actualizado correctamente.",
    time: "10:30 AM",
    unread: 1,
    online: true,
    messages: [
      { id: 1, sender: "me", text: "Hola, la cámara de detección IA de la zona de carga está perdiendo conexión intermitentemente.", time: "10:15 AM" },
      { id: 2, sender: "them", text: "Hola Jefe. Estamos revisando los logs de red de esa zona.", time: "10:25 AM" },
      { id: 3, sender: "them", text: "El firmware de la cámara 3 ha sido actualizado correctamente. Ya no deberías tener cortes.", time: "10:30 AM" }
    ]
  },
  {
    id: "c-inst-carlos",
    name: "Carlos Mendoza",
    role: "Supervisor de Planta",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces",
    isSupport: false,
    lastMsg: "Los arneses de altura ya fueron entregados al equipo B.",
    time: "Ayer",
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: "me", text: "Carlos, por favor asegúrate de repartir el EPP asignado hoy en la mañana.", time: "09:00 AM" },
      { id: 2, sender: "them", text: "Recibido. Me encargo ahora mismo.", time: "09:15 AM" },
      { id: 3, sender: "them", text: "Los arneses de altura ya fueron entregados al equipo B.", time: "05:00 PM" }
    ]
  },
  {
    id: "c-inst-elena",
    name: "Dra. Elena Silva",
    role: "Instructora de SSO",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    isSupport: false,
    lastMsg: "El curso de espacios confinados ya está disponible para revisión.",
    time: "Lun",
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: "them", text: "El curso de espacios confinados ya está disponible para revisión.", time: "10:00 AM" }
    ]
  }
];

export default function JefeSupportPage() {
  const [search, setSearch] = useState("");
  const [activeChatId, setActiveChatId] = useState(CONTACTS[0].id);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [inputText, setInputText] = useState("");
  
  const [contacts, setContacts] = useState(CONTACTS);

  const activeContact = contacts.find(c => c.id === activeChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    // Simulate sending message locally
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setContacts(contacts.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMsg: inputText,
          time: "Ahora"
        };
      }
      return c;
    }));
    setInputText("");
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <LifeBuoy className="h-6 w-6 text-amber-500" />
          Soporte y Comunicación
        </h1>
        <p className="text-sm text-muted">Centro de comunicación en tiempo real con Soporte Técnico, Instructores y Supervisores.</p>
      </div>

      <div className="h-[calc(100vh-14rem)] bg-background flex flex-col md:flex-row gap-6 rounded-xl overflow-hidden border border-slate-800">
        
        {/* Sidebar: Contacts List */}
        <Card className={cn(
          "w-full md:w-80 lg:w-96 flex-col shrink-0 border-none rounded-none border-r border-slate-800 bg-surface/50 overflow-hidden h-full",
          mobileView === "chat" ? "hidden md:flex" : "flex"
        )}>
          <div className="p-4 border-b border-slate-800 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input 
                placeholder="Buscar chats..." 
                className="pl-9 bg-slate-900 border-slate-800 focus-visible:ring-amber-500"
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
                    ? "bg-amber-500/10 border-amber-500/30" 
                    : "bg-transparent border-transparent hover:bg-surface-secondary"
                )}
              >
                <div className="relative shrink-0">
                  {contact.isSupport ? (
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                      <Headphones className="h-5 w-5" />
                    </div>
                  ) : (
                    <Avatar src={contact.avatar} fallback={<UserCircle className="h-6 w-6 text-slate-400" />} />
                  )}
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden text-sm">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={cn("font-bold truncate", contact.isSupport && "text-blue-400", activeChatId === contact.id && !contact.isSupport && "text-amber-500")}>
                      {contact.name}
                    </span>
                    <span className="text-[10px] text-muted whitespace-nowrap">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-muted truncate">{contact.lastMsg}</p>
                    {contact.unread > 0 && (
                      <Badge className="bg-rose-500 hover:bg-rose-600 h-5 w-5 rounded-full p-0 flex items-center justify-center shrink-0 text-[10px] text-white border-0">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {filteredContacts.length === 0 && (
              <div className="p-4 text-center text-sm text-muted">No se encontraron chats</div>
            )}
          </div>
        </Card>

        {/* Main Chat Area */}
        <Card className={cn(
          "flex-1 flex-col border-none rounded-none bg-surface/30 overflow-hidden h-[calc(100vh-14rem)] md:h-full",
          mobileView === "list" ? "hidden md:flex" : "flex"
        )}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="h-16 shrink-0 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-slate-900/50">
                <div className="flex items-center gap-2 md:gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden shrink-0 h-8 w-8 text-slate-400 hover:text-white"
                    onClick={() => setMobileView("list")}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative">
                    {activeContact.isSupport ? (
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                        <Headphones className="h-5 w-5" />
                      </div>
                    ) : (
                      <Avatar src={activeContact.avatar} fallback={<UserCircle className="h-6 w-6 text-slate-400" />} />
                    )}
                    {activeContact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className={cn("font-bold text-sm", activeContact.isSupport ? "text-blue-400" : "text-white")}>
                      {activeContact.name}
                    </h3>
                    <p className="text-xs text-slate-400">{activeContact.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
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
                            ? "bg-amber-600 text-white rounded-tr-none" 
                            : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none"
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                        {msg.time} {isMe && <span className="text-amber-500">✓✓</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                  <Button type="button" variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-white">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input 
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-slate-800 border-slate-700 focus-visible:ring-amber-500"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white" disabled={!inputText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <MessageSquare className="h-12 w-12 text-slate-700 mb-4" />
                <p>Selecciona un chat para empezar a conversar</p>
             </div>
          )}
        </Card>

      </div>
    </div>
  );
}
