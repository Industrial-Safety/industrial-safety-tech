import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { CartDropdown } from "@/components/layout/cart-dropdown";

export default function LandingNav() {
  return (
    <header className="fixed left-1/2 top-6 z-50 w-[95%] max-w-5xl -translate-x-1/2 rounded-full border border-slate-800 bg-background/80 px-6 py-3 shadow-2xl shadow-black/50 backdrop-blur-md">
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
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
          <a href="/#demo" className="cursor-pointer text-sm font-medium text-muted transition-colors hover:text-foreground">
            Demostración
          </a>
          <a href="/#safety-cycle" className="cursor-pointer text-sm font-medium text-muted transition-colors hover:text-foreground">
            Soluciones
          </a>
          <a href="/#cursos" className="cursor-pointer text-sm font-medium text-muted transition-colors hover:text-foreground">
            Cursos
          </a>
          <a href="/#certifications" className="cursor-pointer text-sm font-medium text-muted transition-colors hover:text-foreground">
            Certificaciones
          </a>
          <a href="/#contact" className="cursor-pointer text-sm font-medium text-muted transition-colors hover:text-foreground">
            Contacto
          </a>
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden md:block flex-shrink-0 cursor-pointer" title="Perú">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 3 2" className="block rounded-sm shadow-sm">
              <rect width="1" height="2" fill="#D91023"/>
              <rect width="1" height="2" x="1" fill="#FFFFFF"/>
              <rect width="1" height="2" x="2" fill="#D91023"/>
            </svg>
          </div>
          <CartDropdown />
          <Link href="/login" className="cursor-pointer">
            <Button variant="primary" size="sm" className="cursor-pointer rounded-full px-6 shadow-md">
              Acceder
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
