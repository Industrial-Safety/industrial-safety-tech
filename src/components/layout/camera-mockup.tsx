"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Circle, Maximize2 } from "lucide-react";

interface BoundingBox {
  id: number;
  label: string;
  confidence: number;
  status: "ok" | "warning";
  top: string;
  left: string;
  width: string;
  height: string;
}

const detections: BoundingBox[] = [
  { id: 1, label: "Casco", confidence: 99, status: "ok", top: "12%", left: "30%", width: "38%", height: "18%" },
  { id: 2, label: "Lentes", confidence: 95, status: "ok", top: "34%", left: "35%", width: "28%", height: "10%" },
  { id: 3, label: "Chaleco", confidence: 97, status: "ok", top: "48%", left: "28%", width: "42%", height: "25%" },
  { id: 4, label: "Guantes", confidence: 92, status: "ok", top: "72%", left: "22%", width: "18%", height: "14%" },
  { id: 5, label: "Guantes", confidence: 91, status: "ok", top: "72%", left: "58%", width: "18%", height: "14%" },
];

export default function CameraMockup() {
  const [scanLine, setScanLine] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
      setCurrentTime(new Date());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Camera top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">CAM-N03 &mdash; EN VIVO</span>
          </div>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-muted">
            1920&times;1080 &bull; 30fps
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-slate-400">
            {currentTime.toLocaleTimeString("es-ES", { hour12: false })}
          </span>
          <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
        </div>
      </div>

      {/* Camera viewport */}
      <div className="relative aspect-video w-full overflow-hidden">
        {/* Background: dark grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,23,0.7)_100%)]" />

        {/* Grain overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Silhouette placeholder (human figure) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Head */}
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-700/30 border border-slate-600/20" />
            {/* Body */}
            <div className="mx-auto -mt-2 h-32 w-24 rounded-lg bg-slate-700/20 border border-slate-600/20" />
            {/* Legs */}
            <div className="mt-1 flex justify-center gap-3">
              <div className="h-20 w-8 rounded-b-lg bg-slate-700/20 border border-slate-600/20" />
              <div className="h-20 w-8 rounded-b-lg bg-slate-700/20 border border-slate-600/20" />
            </div>
          </div>
        </div>

        {/* Bounding boxes */}
        {detections.map((box) => {
          const borderColor = box.status === "ok" ? "border-emerald-500" : "border-yellow-500";
          const badgeVariant = box.status === "ok" ? "success" : "warning";
          return (
            <div
              key={box.id}
              className={`absolute rounded-lg border-2 ${borderColor} shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all duration-700`}
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
              }}
            >
              {/* Corner accents */}
              <div className={`absolute -left-0.5 -top-0.5 h-2.5 w-2.5 border-l-2 border-t-2 ${borderColor}`} />
              <div className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 border-r-2 border-t-2 ${borderColor}`} />
              <div className={`absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 border-b-2 border-l-2 ${borderColor}`} />
              <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 border-b-2 border-r-2 ${borderColor}`} />

              {/* Label */}
              <div className="absolute -top-7 left-0">
                <Badge variant={badgeVariant} className="text-[10px] font-mono">
                  {box.label}: {box.confidence}% &mdash; {box.status === "ok" ? "OK" : "REV"}
                </Badge>
              </div>
            </div>
          );
        })}

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          style={{ top: `${scanLine}%` }}
        />

        {/* Bottom status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent px-4 pb-4 pt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="success" className="text-[10px]">
                EPP: COMPLETO
              </Badge>
              <span className="text-[10px] font-mono text-slate-500">
                IA v2.4.1 &bull; Confianza global: 96.8%
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {currentTime.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
