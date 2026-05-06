import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  const idToken = session?.idToken;

  // 1. Destruimos la sesión de NextAuth
  await signOut({ redirect: false });

  // 2. Construimos la URL de logout de Keycloak
  const keycloakLogoutUrl = new URL(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`
  );
  keycloakLogoutUrl.searchParams.set("client_id", process.env.KEYCLOAK_CLIENT_ID!);
  keycloakLogoutUrl.searchParams.set(
    "post_logout_redirect_uri",
    process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  );

  // Con id_token_hint, Keycloak hace el logout SILENCIOSO (sin pantalla de confirmación)
  if (idToken) {
    keycloakLogoutUrl.searchParams.set("id_token_hint", idToken);
  }

  redirect(keycloakLogoutUrl.toString());
}
