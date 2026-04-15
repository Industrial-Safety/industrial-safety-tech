import Link from "next/link";
import LoginForm from "@/features/auth/components/login-form";
import { Shield, Camera, HardHat } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-slate-950">IS</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Industrial Safety</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground">Bienvenido de vuelta</h1>
          <p className="mt-2 text-sm text-muted">
            Ingresa tus credenciales para acceder al dashboard.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right — Branding panel (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-surface border-l border-slate-800 p-12 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Seguridad Industrial Inteligente</h2>
          <p className="mt-4 text-muted">
            Una plataforma integral para gestionar certificados, detectar infracciones de EPP con IA
            y controlar el inventario de equipo de protección en tiempo real.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-xs text-muted">Detección IA</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <HardHat className="h-6 w-6 text-primary" />
              <span className="text-xs text-muted">Inventario</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xs text-muted">Certificados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
