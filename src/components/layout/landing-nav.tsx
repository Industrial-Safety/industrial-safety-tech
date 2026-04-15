import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function LandingNav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-800 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-foreground">
              PrevenciónTech
            </span>
            <span className="text-[10px] font-medium leading-none tracking-widest text-muted uppercase">
              Seguridad Industrial
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#demo" className="text-sm text-muted hover:text-foreground transition-colors">
            Demostración
          </a>
          <a href="#safety-cycle" className="text-sm text-muted hover:text-foreground transition-colors">
            Soluciones
          </a>
          <a href="#certifications" className="text-sm text-muted hover:text-foreground transition-colors">
            Certificaciones
          </a>
          <a href="#contact" className="text-sm text-muted hover:text-foreground transition-colors">
            Contacto
          </a>
        </nav>

        <Link href="/login">
          <Button variant="primary" size="sm">
            Acceso al Dashboard
          </Button>
        </Link>
      </div>
    </header>
  );
}
