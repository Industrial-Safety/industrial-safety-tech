import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  const refreshToken = (session as any)?.refreshToken;

  // 1. Back-channel logout a Keycloak (server → Keycloak, el usuario nunca lo ve)
  if (refreshToken) {
    try {
      await fetch(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
            refresh_token: refreshToken,
          }),
        }
      );
    } catch {
      // Si Keycloak no responde, igual destruimos la sesión local
    }
  }

  // 2. Destruir sesión de NextAuth
  const idToken = (session as any)?.idToken;
  await signOut({ redirect: false });

  // 3. Front-channel logout: redirige al navegador a Keycloak para que limpie su cookie SSO
  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const params = new URLSearchParams({ post_logout_redirect_uri: appUrl });
  if (idToken) params.set("id_token_hint", idToken);
  else params.set("client_id", process.env.KEYCLOAK_CLIENT_ID!);

  redirect(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params.toString()}`);
}
