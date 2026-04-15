import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, HardHat, Camera, ClipboardCheck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Gestión de Certificados",
    description:
      "Emite, valida y renueva certificados de seguridad industrial con trazabilidad completa.",
  },
  {
    icon: Camera,
    title: "Detección de EPP por IA",
    description:
      "Monitoreo en tiempo real con cámaras inteligentes que detectan el uso correcto de equipo de protección.",
  },
  {
    icon: HardHat,
    title: "Inventario de EPP",
    description:
      "Control de stock automatizado con alertas de reposición y seguimiento de caducidad.",
  },
  {
    icon: ClipboardCheck,
    title: "Cumplimiento Normativo",
    description:
      "Dashboards gerenciales con métricas de cumplimiento, incidentes y tendencias operativas.",
  },
];

export default function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-surface px-4 py-1.5 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Plataforma SaaS en producción
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Gestión de Seguridad{" "}
          <span className="text-primary">Inteligente</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
          Certificados digitales, detección de EPP por inteligencia artificial e inventario
          automatizado. Todo en una sola plataforma diseñada para la industria moderna.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Comenzar Ahora
            </Button>
          </Link>
          <a href="#modules">
            <Button variant="secondary" size="lg">
              Ver Módulos
            </Button>
          </a>
        </div>
      </div>

      {/* Feature cards */}
      <div id="features" className="relative z-10 mx-auto mt-24 max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-800 bg-surface p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div id="modules" className="relative z-10 mx-auto mt-24 w-full max-w-4xl rounded-xl border border-slate-800 bg-surface p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          ¿Listo para transformar tu operación?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Reduce incidentes, automatiza el cumplimiento y protege a tu equipo con tecnología de punta.
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button variant="primary" size="lg">
            Acceder al Dashboard
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-24 pb-8 text-center text-sm text-muted">
        &copy; {new Date().getFullYear()} Industrial Safety. Todos los derechos reservados.
      </footer>
    </section>
  );
}
