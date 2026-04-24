import Link from "next/link";
import LoginForm from "@/features/auth/components/login-form";
import { Shield, Camera } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px] z-0 pointer-events-none" />

      {/* Left — Login Form */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-md bg-surface/40 backdrop-blur-xl border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl shadow-black/50">
          <Link href="/" className="mb-10 flex items-center gap-3 w-fit group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight text-foreground group-hover:text-amber-400 transition-colors">
                PrevenciónTech
              </span>
              <span className="text-[10px] font-medium leading-none tracking-widest text-muted uppercase">
                Acceso al Portal
              </span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-foreground">Bienvenido de vuelta</h1>
          <p className="mt-2 text-sm text-slate-400 mb-8">
            Ingresa tus credenciales para acceder a tu panel de control.
          </p>

          <LoginForm />
        </div>
      </div>

      {/* Right — Branding panel (hidden on mobile) */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
            alt="Industrial Safety" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 flex h-full flex-col justify-end p-16">
          <div className="max-w-lg mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
              <Shield className="h-4 w-4" />
              Plataforma N°1 en Latam
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              Seguridad Industrial <span className="text-amber-500">Inteligente</span>
            </h2>
            <p className="text-lg text-slate-300 drop-shadow-md">
              Una plataforma integral para gestionar la detección de EPP con IA
              y el cumplimiento normativo en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-700/50">
            <div className="bg-surface/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-surface/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Camera className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-slate-200">Detección IA</span>
            </div>
            <div className="bg-surface/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-surface/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-200">Cumplimiento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
