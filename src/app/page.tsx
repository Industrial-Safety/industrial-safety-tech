import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LandingNav from "@/components/layout/landing-nav";
import CameraMockup from "@/components/layout/camera-mockup";
import SafetyCycle from "@/components/layout/safety-cycle";
import {
  ShieldCheck,
  Award,
  Leaf,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  BellRing,
  TrendingDown,
  FileText,
  LayoutDashboard,
} from "lucide-react";

const certifications = [
  {
    iso: "ISO 45001",
    title: "Seguridad y Salud en el Trabajo",
    description:
      "Sistema de Gestión de Seguridad y Salud en el Trabajo. Garantiza la prevención de lesiones, la reducción de riesgos laborales y el cumplimiento legal en materia de SST.",
    icon: ShieldCheck,
  },
  {
    iso: "ISO 9001",
    title: "Gestión de la Calidad",
    description:
      "Estándar internacional para sistemas de gestión de calidad. Asegura la mejora continua, la satisfacción del cliente y la estandarización de procesos operativos.",
    icon: Award,
  },
  {
    iso: "ISO 14001",
    title: "Gestión Ambiental",
    description:
      "Marco para la gestión responsable del impacto ambiental. Minimiza la huella ecológica de las operaciones industriales y asegura el cumplimiento regulatorio ambiental.",
    icon: Leaf,
  },
];

const keyCapabilities = [
  { icon: BellRing, text: "Alertas de IA en tiempo real." },
  { icon: TrendingDown, text: "Reducción de tasa de incidentes." },
  { icon: ShieldCheck, text: "Control de vigencia de EPP." },
  { icon: FileText, text: "Digitalización de reportes." },
  { icon: LayoutDashboard, text: "Panel de control gerencial." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />

      {/* ======================== HERO SECTION ======================== */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute -top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-surface px-4 py-1.5 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Plataforma empresarial en producción
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Nuestra Tecnología en{" "}
            <span className="text-primary">Prevención de Riesgos</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            Líderes en seguridad industrial con inteligencia artificial. Detectamos infracciones
            de EPP en tiempo real, gestionamos certificados y controlamos inventarios para las
            operaciones más exigentes.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login">
              <Button variant="primary" size="lg">
                Solicitar Demostración
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="secondary" size="lg">
                Ver Tecnología en Acción
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ======================== CAMERA MOCKUP ======================== */}
      <section id="demo" className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-3">
              Demostración en Vivo
            </Badge>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Detección de EPP por Visión Artificial
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Cada cámara analiza en tiempo real el cumplimiento del equipo de protección personal.
              Las cajas delimitadoras verdes indican detección exitosa con alta confianza.
            </p>
          </div>
          <CameraMockup />
        </div>
      </section>

      {/* ======================== VALUE PROPOSITION ======================== */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left column — Descriptive text (8 cols) */}
            <div className="lg:col-span-8">
              {/* Block 1 */}
              <div className="border-b border-slate-800 pb-8 mb-8">
                <h2 className="mb-4 text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                  Prevención Activa impulsada por Inteligencia Artificial
                </h2>
                <p className="text-base leading-relaxed text-muted">
                  Nuestra plataforma transforma la seguridad industrial de un proceso reactivo a
                  uno proactivo. Mediante el análisis de video en tiempo real, detectamos la
                  ausencia de Equipos de Protección Personal (EPP) y emitimos alertas antes de
                  que ocurra un incidente.
                </p>
              </div>

              {/* Block 2 */}
              <div>
                <h2 className="mb-4 text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                  Trazabilidad Total y Cero Papel
                </h2>
                <p className="text-base leading-relaxed text-muted">
                  Digitaliza el control de inventarios de EPP, la emisión de certificados de
                  capacitación y los reportes de inspección. Elimina los registros manuales en
                  papel, reduciendo errores y garantizando que toda tu operación cumpla con las
                  normativas internacionales al instante.
                </p>
              </div>
            </div>

            {/* Right column — Capabilities card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-slate-800 bg-surface p-8">
                <h3 className="mb-6 text-xl font-bold text-foreground">Capacidades Clave</h3>

                <ul className="flex flex-col">
                  {keyCapabilities.map((cap, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-4 py-4 ${
                        i < keyCapabilities.length - 1 ? "border-b border-slate-800" : ""
                      }`}
                    >
                      <cap.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-slate-300">{cap.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href="/login" className="block">
                    <button className="flex h-12 w-full items-center justify-center rounded-lg bg-amber-500 px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-600">
                      SOLICITAR DEMOSTRACIÓN
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SAFETY CYCLE ======================== */}
      <SafetyCycle />

      {/* ======================== CERTIFICATIONS ======================== */}
      <section id="certifications" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge variant="secondary" className="mb-3">
              Respaldo Internacional
            </Badge>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Estándares y Certificaciones Internacionales
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Nuestra plataforma cumple con los estándares más exigentes de la industria,
              asegurando calidad, seguridad y responsabilidad ambiental en cada operación.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {certifications.map((cert) => (
              <Card
                key={cert.iso}
                className="group rounded-xl border border-slate-800 bg-surface p-0 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]"
              >
                <CardContent className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                    <cert.icon className="h-8 w-8" />
                  </div>

                  <div className="mb-2 inline-block rounded bg-primary/10 px-2.5 py-1 text-xs font-bold font-mono text-primary">
                    {cert.iso}
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    {cert.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted">
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CTA STRIP ======================== */}
      <section className="relative z-10 border-y border-slate-800 bg-surface px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            ¿Listo para transformar tu operación?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Reduce incidentes, automatiza el cumplimiento y protege a tu equipo con tecnología de punta.
          </p>
          <Link href="/login" className="mt-6 inline-block">
            <Button variant="primary" size="lg">
              Acceder al Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer id="contact" className="relative z-10 border-t border-slate-800 bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Column 1: Brand */}
            <div className="md:col-span-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <ShieldCheck className="h-5 w-5 text-slate-950" />
                </div>
                <span className="text-base font-bold text-foreground">PrevenciónTech</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                Plataforma líder en gestión de seguridad industrial impulsada por inteligencia
                artificial. Protegiendo operaciones en toda Latinoamérica.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-sm text-muted transition-colors hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-muted transition-colors hover:text-foreground">
                    Portal de Certificados
                  </Link>
                </li>
                <li>
                  <a href="#demo" className="text-sm text-muted transition-colors hover:text-foreground">
                    Detección IA
                  </a>
                </li>
                <li>
                  <a href="#certifications" className="text-sm text-muted transition-colors hover:text-foreground">
                    Certificaciones
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Soporte
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted transition-colors hover:text-foreground">
                    Documentación API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted transition-colors hover:text-foreground">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted transition-colors hover:text-foreground">
                    Estado del Servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted transition-colors hover:text-foreground">
                    Política de Privacidad
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Contacto
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Av. Industrial 1250, Piso 8<br />
                    Ciudad de México, CDMX 06600
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href="mailto:contacto@prevenciontech.com" className="hover:text-foreground">
                    contacto@prevenciontech.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>+52 (55) 1234-5678</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-muted">
              &copy; 2026 PrevenciónTech. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
