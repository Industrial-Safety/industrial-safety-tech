"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const LEADERBOARD_DATA = [
  { rank: 1, name: "María Pérez", role: "Supervisora de Planta", score: 9850, exams: 100, safety: 100, image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=faces" },
  { rank: 2, name: "Alex Rivera", role: "Operario Especializado", score: 9200, exams: 95, safety: 100, image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop&crop=faces", isCurrentUser: true },
  { rank: 3, name: "Jorge Mendoza", role: "Técnico de Mantenimiento", score: 8900, exams: 90, safety: 98, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces" },
  { rank: 4, name: "Lucía Gómez", role: "Operaria", score: 8500, exams: 85, safety: 95, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces" },
  { rank: 5, name: "Carlos Ruiz", role: "Logística", score: 7800, exams: 80, safety: 90, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces" },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-warning/20 text-warning rounded-full mb-4">
          <Trophy className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Ranking de Desempeño</h1>
        <p className="text-muted max-w-lg mx-auto">Compite con tus compañeros. Los puntos se obtienen por altas calificaciones en exámenes y 0 infracciones de seguridad detectadas por inteligencia artificial.</p>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-3 gap-4 items-end mb-12 h-64">
        {/* Pos 2 */}
        <div className="flex flex-col items-center animate-in slide-in-from-bottom-[50%] duration-700 delay-100">
          <Avatar src={LEADERBOARD_DATA[1].image} size="xl" className="border-4 border-slate-300 ring-4 ring-background mb-4" />
          <Badge className="bg-slate-300 text-slate-800 mb-2 font-bold pointer-events-none">#2</Badge>
          <div className="w-full bg-surface-secondary/50 rounded-t-xl h-32 flex flex-col items-center justify-center p-2 text-center border-t-4 border-slate-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-300/10 to-transparent"></div>
            <p className="font-bold text-sm line-clamp-1 z-10">{LEADERBOARD_DATA[1].name}</p>
            <p className="font-mono text-primary font-bold mt-1 z-10">{LEADERBOARD_DATA[1].score} pts</p>
          </div>
        </div>

        {/* Pos 1 */}
        <div className="flex flex-col items-center animate-in slide-in-from-bottom-full duration-700">
          <Avatar src={LEADERBOARD_DATA[0].image} size="xl" className="border-4 border-warning ring-4 ring-background mb-4 h-24 w-24 shadow-lg shadow-warning/20 group relative" />
          <div className="absolute -top-6 text-warning animate-bounce"><Trophy className="h-8 w-8 fill-warning text-warning" /></div>
          <Badge className="bg-warning text-black mb-2 font-bold pointer-events-none scale-110">#1</Badge>
           <div className="w-full bg-warning/10 rounded-t-xl h-40 flex flex-col items-center justify-center p-2 text-center border-t-4 border-warning relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-warning/20 to-transparent"></div>
            <p className="font-bold text-sm line-clamp-1 z-10 text-warning">{LEADERBOARD_DATA[0].name}</p>
            <p className="font-mono text-warning font-bold text-lg mt-1 z-10">{LEADERBOARD_DATA[0].score} pts</p>
          </div>
        </div>

        {/* Pos 3 */}
        <div className="flex flex-col items-center animate-in slide-in-from-bottom-[30%] duration-700 delay-200">
          <Avatar src={LEADERBOARD_DATA[2].image} size="xl" className="border-4 border-amber-600 ring-4 ring-background mb-4" />
          <Badge className="bg-amber-600 text-white mb-2 font-bold pointer-events-none">#3</Badge>
           <div className="w-full bg-surface-secondary/50 rounded-t-xl h-24 flex flex-col items-center justify-center p-2 text-center border-t-4 border-amber-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent"></div>
            <p className="font-bold text-sm line-clamp-1 z-10">{LEADERBOARD_DATA[2].name}</p>
            <p className="font-mono text-amber-500 font-bold mt-1 z-10">{LEADERBOARD_DATA[2].score} pts</p>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
       <Card className="bg-surface/50 border-border shadow-xl">
        <CardHeader className="pb-3 border-b border-border/50 bg-black/10">
          <div className="flex justify-between items-center px-2">
            <CardTitle className="text-lg">Clasificación General</CardTitle>
            <Badge variant="outline" className="border-primary text-primary">Temporada 2026</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {LEADERBOARD_DATA.map((user) => (
              <div 
                key={user.rank} 
                className={cn(
                  "flex items-center gap-4 p-4 transition-colors hover:bg-surface-secondary/50",
                  user.isCurrentUser && "bg-primary/5 border-l-4 border-primary"
                )}
              >
                <div className="w-8 text-center font-mono font-bold text-lg text-muted">
                  {user.rank}
                </div>
                <Avatar src={user.image} size="lg" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground truncate flex items-center gap-2">
                    {user.name} 
                    {user.isCurrentUser && <Badge className="h-5 px-1 bg-primary text-primary-foreground text-[9px] uppercase tracking-wider">Tú</Badge>}
                  </div>
                  <p className="text-xs text-muted truncate">{user.role}</p>
                </div>

                <div className="hidden sm:flex items-center gap-6 text-sm">
                  <div className="flex flex-col items-center w-20">
                    <span className="text-muted text-[10px] uppercase font-semibold">Exámenes</span>
                    <span className="font-bold text-success flex items-center gap-1"><Star className="h-3 w-3" /> {user.exams}%</span>
                  </div>
                  <div className="flex flex-col items-center w-20">
                    <span className="text-muted text-[10px] uppercase font-semibold">Seguridad</span>
                    <span className="font-bold text-primary flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {user.safety}%</span>
                  </div>
                </div>

                <div className="font-mono font-bold text-lg text-right w-24 shrink-0 text-foreground">
                  {user.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
