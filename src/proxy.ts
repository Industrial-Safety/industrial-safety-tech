import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 1. Definir rutas públicas (accesibles sin login)
  const isPublicRoute = ["/login", "/register", "/api/auth", "/", "/auth/login-redirect", "/auth/success", "/auth/set-password"].some((route) =>
    pathname === route || pathname.startsWith("/api/auth") || pathname.startsWith("/auth/")
  );

  // 2. Si no está logueado y la ruta no es pública, lo mandamos al login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Lógica para usuarios logueados
  if (isLoggedIn) {
    // Extraer y decodificar el token de Keycloak para obtener los roles
    const accessToken = req.auth?.accessToken;
    let roles: string[] = [];

    if (accessToken) {
      try {
        const payloadBase64 = accessToken.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        roles = payload.realm_access?.roles || [];
      } catch (error) {
        console.error("Error decodificando JWT en el middleware:", error);
      }
    }

    // Keycloak puede enviar roles como "ADMINISTRADOR" o "ROLE_ADMINISTRADOR"
    const hasRole = (role: string) => roles.includes(role) || roles.includes(`ROLE_${role}`);

    const isAdmin = hasRole("ADMINISTRADOR");
    const isGerencia = hasRole("GERENCIA_GENERAL");
    const isJefeSeguridad = hasRole("JEFE_SEGURIDAD");
    const isLogistica = hasRole("LOGISTICA_ALMACEN");
    const isMarketing = hasRole("MARKETING");
    const isTrabajador = hasRole("TRABAJADOR");
    const isInstructor = hasRole("INSTRUCTOR");
    const isAlumno = hasRole("ALUMNO");

    // Determinar la ruta de destino según el rol
    let targetDashboard = "/student";
    if (isAdmin) targetDashboard = "/select-role";
    else if (isGerencia) targetDashboard = "/gerencia";
    else if (isJefeSeguridad) targetDashboard = "/jefatura";
    else if (isLogistica) targetDashboard = "/logistica";
    else if (isMarketing) targetDashboard = "/marketing";
    else if (isTrabajador) targetDashboard = "/trabajador";
    else if (isInstructor) targetDashboard = "/instructor";

    // 3. Redirección basada en ROLES
    if (pathname === "/login" || pathname === "/register" || pathname === "/") {
      return NextResponse.redirect(new URL(targetDashboard, req.nextUrl));
    }


    // 5. Control de Acceso (Protección de rutas)
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL(targetDashboard, req.nextUrl));
    }
    if (pathname.startsWith("/gerencia") && !isGerencia && !isAdmin) {
      return NextResponse.redirect(new URL(targetDashboard, req.nextUrl));
    }
    if (pathname.startsWith("/jefatura") && !isJefeSeguridad && !isAdmin) {
      return NextResponse.redirect(new URL(targetDashboard, req.nextUrl));
    }
  }

  return NextResponse.next();
});

// 5. Configurar el "Matcher" para decirle a Next.js en qué rutas correr este middleware
export const config = {
  // Ignorar las rutas de estáticos, imágenes de next y la carpeta api (excepto auth)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
