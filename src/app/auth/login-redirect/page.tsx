"use client";

import { useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginRedirectContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");

  useEffect(() => {
    if (provider) {
      // Llamamos a signIn que hace la petición POST internamente y redirige al Keycloak real
      signIn("keycloak", { callbackUrl: "/auth/success" }, { kc_idp_hint: provider });
    }
  }, [provider]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
    </div>
  );
}

export default function LoginRedirect() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div></div>}>
      <LoginRedirectContent />
    </Suspense>
  );
}
