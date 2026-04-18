"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Headphones, UserCircle, MoreVertical, Paperclip, ChevronLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Contacts Base
const CONTACTS = [
  {
    id: "c-support",
    name: "Soporte Técnico IS",
    role: "Equipo de Soporte",
    avatar: "",
    isSupport: true,
    lastMsg: "Te hemos asignado el curso de forma manual.",
    time: "10:30 AM",
    unread: 1,
    online: true,
    messages: [
      { id: 1, sender: "me", text: "Hola, tengo un problema. El curso de EPP no marca mi progreso aunque ya vi el video 2 veces.", time: "10:15 AM" },
      { id: 2, sender: "them", text: "Hola Alex. Gracias por comunicarte.", time: "10:25 AM" },
      { id: 3, sender: "them", text: "Te hemos asignado el progreso del curso de forma manual y he reportado el bug a ingeniería. Ya puedes dar tu examen.", time: "10:30 AM" }
    ]
  },
  {
    id: "c-inst-roberto",
    name: "Ing. Roberto Martínez",
    role: "Instructor de EPP Avanzado",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces",
    isSupport: false,
    lastMsg: "Correcto, la mascarilla 3M serie 6000 también te sirve.",
    time: "Ayer",
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: "me", text: "Profesor Roberto, una consulta respecto al módulo 2.", time: "09:00 AM" },
      { id: 2, sender: "me", text: "¿Puedo usar la mascarilla 3M 6000 para químicos en lugar de la que sale en el video?", time: "09:02 AM" },
      { id: 3, sender: "them", text: "Correcto, la mascarilla 3M serie 6000 también te sirve si le colocas los filtros 6003 (gases ácidos).", time: "05:00 PM" }
    ]
  },
  {
    id: "c-inst-elena",
    name: "Dra. Elena Silva",
    role: "Instructora de P. Auxilios",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    isSupport: false,
    lastMsg: "Recuerda repasar el RCP de cara al examen del viernes.",
    time: "Lun",
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: "them", text: "Recuerda repasar el RCP de cara al examen del viernes.", time: "10:00 AM" }
    ]
  }
];

export default function SupportChatPage() {
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
    <div className="h-[calc(100vh-10rem)] bg-background flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 rounded-xl overflow-hidden">
      
      {/* Sidebar: Contacts List */}
      <Card className={cn(
        "w-full md:w-80 lg:w-96 flex-col shrink-0 border-border bg-surface/50 overflow-hidden h-full",
        mobileView === "chat" ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-border space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Comunicaciones</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input 
              placeholder="Buscar chats..." 
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
                {contact.isSupport ? (
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
              <div className="flex-1 min-w-0 overflow-hidden text-sm">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={cn("font-bold truncate", contact.isSupport && "text-primary")}>{contact.name}</span>
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
            <div className="p-4 text-center text-sm text-muted">No se encontraron chats</div>
          )}
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card className={cn(
        "flex-1 flex-col border-border bg-surface/50 overflow-hidden h-[calc(100vh-10rem)] md:h-full",
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
                  {activeContact.isSupport ? (
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
                  <h3 className={cn("font-bold text-sm", activeContact.isSupport && "text-primary")}>
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
            <div className="p-4 border-t border-border bg-surface-secondary/10">
              <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted hover:text-foreground">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  placeholder="Escribe un mensaje..."
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
              <p>Selecciona un chat para empezar a conversar</p>
           </div>
        )}
      </Card>

    </div>
  );
}
