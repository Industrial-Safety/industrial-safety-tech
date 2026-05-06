import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        idToken?: string;
        dbId?: string | number;
        keycloakId?: string;
        roles?: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        idToken?: string;
        dbId?: string | number;
        keycloakId?: string;
        dbName?: string;
        roles?: string[];
        expiresAt?: number;
    }
}

import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    providers: [
        Keycloak({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
            authorization: {
                params: {
                    prompt: "select_account"
                }
            }
        }),
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                try {
                    const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            client_id: process.env.KEYCLOAK_CLIENT_ID_MANUAL!,
                            client_secret: process.env.KEYCLOAK_CLIENT_SECRET_MANUAL!,
                            grant_type: "password",
                            username: credentials.email as string,
                            password: credentials.password as string,
                            scope: "openid",
                        }),
                    });
                    const tokens = await response.json();
                    if (!response.ok) {
                        console.error("DEBUG [Auth]: Keycloak rechazó las credenciales:", tokens);
                        return null;
                    }

                    // Extraemos el UUID real del token de Keycloak
                    const payloadBase64 = tokens.access_token.split(".")[1];
                    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
                    const keycloakUuid = payload.sub;

                    console.log("DEBUG [Auth]: Login manual exitoso. UUID:", keycloakUuid);

                    return {
                        id: keycloakUuid, // Ahora el ID es el UUID real, no el email
                        name: "Admin",
                        email: credentials.email as string,
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                        idToken: tokens.id_token,
                        expiresIn: tokens.expires_in
                    };
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account && user) {
                const accessToken = (account.access_token || (user as any).accessToken) as string;
                const refreshToken = (account.refresh_token || (user as any).refreshToken) as string;
                const idToken = (account.id_token || (user as any).idToken) as string;

                // Extraemos roles del token
                let roles: string[] = [];
                try {
                    const payloadBase64 = accessToken.split(".")[1];
                    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
                    roles = payload.realm_access?.roles || [];
                } catch (e) {
                    console.error("Error parsing token roles", e);
                }
                
                // Determinamos el rol principal
                let primaryRole = "ROLE_ALUMNO";
                if (roles.includes("ADMINISTRADOR") || roles.includes("ROLE_ADMINISTRADOR")) primaryRole = "ROLE_ADMINISTRADOR";
                else if (roles.includes("INSTRUCTOR") || roles.includes("ROLE_INSTRUCTOR")) primaryRole = "ROLE_INSTRUCTOR";

                let dbId = token.dbId;
                // Sincronización con el backend
                try {
                    const res = await fetch(`${process.env.API_URL}/api/v1/users/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: user.name?.split(" ")[0] || "Admin",
                            lastName: user.name?.split(" ").slice(1).join(" ") || "Prevencion",
                            email: user.email,
                            password: "oauth_user_password",
                            role: primaryRole
                        })
                    });
                    if (res.ok) {
                        const dbUser = await res.json();
                        dbId = dbUser.id;
                        token.dbName = `${dbUser.name} ${dbUser.lastName}`;
                        console.log("DEBUG [Auth]: Sincronización exitosa. ID DB:", dbId);
                    }
                } catch (err) {
                    console.error("DEBUG [Auth]: Error sincronizando", err);
                }

                return {
                    ...token,
                    accessToken,
                    refreshToken,
                    idToken,
                    dbId,
                    keycloakId: token.sub,
                    roles,
                    expiresAt: account.expires_at 
                        ? account.expires_at * 1000 
                        : Date.now() + ((user as any).expiresIn * 1000),
                };
            }

            if (Date.now() < (token.expiresAt as number)) return token;

            // Refresh token logic...
            try {
                const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        client_id: process.env.KEYCLOAK_CLIENT_ID_MANUAL!,
                        client_secret: process.env.KEYCLOAK_CLIENT_SECRET_MANUAL!,
                        grant_type: "refresh_token",
                        refresh_token: token.refreshToken as string,
                    }),
                });
                const tokens = await response.json();
                if (!response.ok) throw tokens;
                return {
                    ...token,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token ?? token.refreshToken,
                    expiresAt: Date.now() + (tokens.expires_in * 1000),
                };
            } catch (error) {
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.idToken = token.idToken as string;
            session.dbId = token.dbId;
            session.keycloakId = token.keycloakId as string;
            session.roles = token.roles;
            if (token.dbName && session.user) {
                session.user.name = token.dbName as string;
            }
            // @ts-ignore
            session.error = token.error;
            return session;
        }
    }
})
