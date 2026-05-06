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
    // Si intenta acceder a login o register estando logueado, lo redirigimos
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/student", req.nextUrl));
    }

    // Extraer y decodificar el token de Keycloak para obtener los roles
    const accessToken = req.auth?.accessToken;
    let roles: string[] = [];

    if (accessToken) {
      try {
        // En Edge Runtime (Middleware) usamos atob() para decodificar base64
        const payloadBase64 = accessToken.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        
        // Keycloak inyecta los roles del realm en `realm_access.roles`
        roles = payload.realm_access?.roles || [];
      } catch (error) {
        console.error("Error decodificando JWT en el middleware:", error);
      }
    }

    // Definir los roles según tu captura de Keycloak
    const isAdmin = roles.includes("ROLE_ADMINISTRADOR");
    const isGerencia = roles.includes("ROLE_GERENCIA_GENERAL");
    const isJefeSeguridad = roles.includes("ROLE_JEFE_SEGURIDAD");
    const isLogistica = roles.includes("ROLE_LOGISTICA_ALMACEN");
    const isMarketing = roles.includes("ROLE_MARKETING");
    const isTrabajador = roles.includes("ROLE_TRABAJADOR");
    const isInstructor = roles.includes("ROLE_INSTRUCTOR");
    const isAlumno = roles.includes("ROLE_ALUMNO");

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
