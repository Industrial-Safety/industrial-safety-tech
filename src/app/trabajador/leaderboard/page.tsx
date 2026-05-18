"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingEntry {
  position: number;
  userId: string;
  userName: string;
  totalPoints: number;
}

function Initials({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const parts = name?.trim().split(" ") ?? [];
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : (parts[0]?.[0] ?? "?");
  return (
    <div className={cn(
      "rounded-full flex items-center justify-center font-bold text-white select-none shrink-0",
      className
    )} style={style}>
      {initials.toUpperCase()}
    </div>
  );
}

const PODIUM_COLORS = [
  { border: "border-warning", bg: "bg-warning/10", text: "text-warning", badge: "bg-warning text-black", h: "h-40" },
  { border: "border-slate-300", bg: "bg-surface-secondary/50", text: "text-slate-300", badge: "bg-slate-300 text-slate-800", h: "h-32" },
  { border: "border-amber-600", bg: "bg-surface-secondary/50", text: "text-amber-500", badge: "bg-amber-600 text-white", h: "h-24" },
];

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/exams/ranking?size=20&page=0")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const currentUserId = (session as any)?.keycloakId as string | undefined;
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumConfig = [PODIUM_COLORS[1], PODIUM_COLORS[0], PODIUM_COLORS[2]];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-warning" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-warning/20 text-warning rounded-full mb-4">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Ranking de Desempeño</h1>
          <p className="text-muted max-w-lg mx-auto">
            Compite con tus compañeros. Los puntos se obtienen por altas calificaciones en exámenes de seguridad.
          </p>
        </div>
        <Card className="bg-surface/50 border-border">
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-muted">Aún no hay puntajes registrados.</p>
            <p className="text-sm text-muted mt-1">Completa exámenes para aparecer en el ranking.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">

      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-warning/20 text-warning rounded-full mb-4">
          <Trophy className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Ranking de Desempeño</h1>
        <p className="text-muted max-w-lg mx-auto">
          Compite con tus compañeros. Los puntos se obtienen por altas calificaciones en exámenes de seguridad.
        </p>
      </div>

      {/* Podium Top 3 */}
      {top3.length >= 1 && (
        <div className="grid grid-cols-3 gap-4 items-end mb-12 h-64">
          {podiumOrder.map((entry, i) => {
            if (!entry) return <div key={i} />;
            const cfg = podiumConfig[i];
            const isMe = entry.userId === currentUserId;
            return (
              <div key={entry.userId} className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700">
                <Initials
                  name={entry.userName}
                  className={cn(
                    "h-16 w-16 text-lg border-4 ring-4 ring-background mb-4 shadow-lg",
                    cfg.border,
                    i === 1 ? "h-24 w-24 text-xl" : "",
                    isMe ? "ring-primary" : ""
                  )}
                  style={{ backgroundColor: i === 1 ? "#ca8a04" : i === 0 ? "#94a3b8" : "#92400e" } as any}
                />
                {i === 1 && (
                  <div className="absolute -top-6 text-warning animate-bounce">
                    <Trophy className="h-8 w-8 fill-warning text-warning" />
                  </div>
                )}
                <Badge className={cn("mb-2 font-bold pointer-events-none", cfg.badge, i === 1 ? "scale-110" : "")}>
                  #{entry.position}
                </Badge>
                <div className={cn(
                  "w-full rounded-t-xl flex flex-col items-center justify-center p-2 text-center border-t-4 relative overflow-hidden",
                  cfg.border, cfg.bg, cfg.h
                )}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <p className={cn("font-bold text-sm line-clamp-1 z-10", cfg.text)}>
                    {entry.userName}
                    {isMe && <span className="ml-1 text-[10px] bg-primary text-primary-foreground px-1 rounded">Tú</span>}
                  </p>
                  <p className={cn("font-mono font-bold mt-1 z-10", cfg.text, i === 1 ? "text-lg" : "")}>
                    {entry.totalPoints.toLocaleString()} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <Card className="bg-surface/50 border-border shadow-xl">
        <CardHeader className="pb-3 border-b border-border/50 bg-black/10">
          <div className="flex justify-between items-center px-2">
            <CardTitle className="text-lg">Clasificación General</CardTitle>
            <Badge variant="outline" className="border-primary text-primary">Temporada 2026</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {entries.map((entry) => {
              const isMe = entry.userId === currentUserId;
              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-4 p-4 transition-colors hover:bg-surface-secondary/50",
                    isMe && "bg-primary/5 border-l-4 border-primary"
                  )}
                >
                  <div className="w-8 text-center font-mono font-bold text-lg text-muted">
                    {entry.position <= 3 ? (
                      <span className={entry.position === 1 ? "text-warning" : entry.position === 2 ? "text-slate-300" : "text-amber-600"}>
                        {entry.position}
                      </span>
                    ) : entry.position}
                  </div>

                  <Initials
                    name={entry.userName}
                    className="h-10 w-10 text-sm shrink-0"
                    style={{ backgroundColor: isMe ? "hsl(var(--primary))" : "#334155" } as any}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground truncate flex items-center gap-2">
                      {entry.userName}
                      {isMe && (
                        <Badge className="h-5 px-1 bg-primary text-primary-foreground text-[9px] uppercase tracking-wider">
                          Tú
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted">Trabajador</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-warning" />
                    <span className="font-medium text-warning">{entry.totalPoints.toLocaleString()}</span>
                    <span className="text-muted text-xs">pts</span>
                  </div>

                  <div className="font-mono font-bold text-lg text-right w-24 shrink-0 text-foreground sm:hidden">
                    {entry.totalPoints.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
