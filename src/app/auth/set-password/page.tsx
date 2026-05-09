"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasLength = password.length >= 8 && password.length <= 20;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const isMatch = password !== "" && password === confirmPassword;
  const isValid = hasLength && hasUpperCase && hasSpecialChar && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      // 1. Obtener sesion actual — usar sub del JWT como UUID real de Keycloak
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      let keycloakId: string | undefined;
      try {
        const payload = JSON.parse(atob(session?.accessToken?.split(".")[1] ?? ""));
        keycloakId = payload.sub;
      } catch {
        keycloakId = session?.keycloakId;
      }

      if (!keycloakId) {
        setError("No se pudo obtener la sesion. Intenta iniciar sesion de nuevo.");
        setLoading(false);
        return;
      }

      // 2. Llamar al backend para actualizar la contrasena y limpiar mustChangePassword
      const res = await fetch(`/api/proxy/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: keycloakId, email, newPassword: password.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al actualizar la contrasena");
        setLoading(false);
        return;
      }

      // 3. Limpiar sesion actual (tiene mustChangePassword:true) y re-autenticar con nueva contrasena
      await signOut({ redirect: false });
      const loginResult = await signIn("credentials", {
        redirect: false,
        email,
        password: password.trim(),
      });

      if (loginResult?.error) {
        window.location.href = "/login";
        return;
      }

      // 4. Dejar que /auth/redirect determine el dashboard segun rol
      window.location.href = "/auth/redirect";
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ backgroundColor: "#020817" }}>
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Establecer contrasena</h1>

        <p className="text-sm text-slate-400 leading-relaxed px-2">
          Tu cuenta fue creada por un administrador. Por seguridad, debes establecer una contrasena personal antes de continuar.
        </p>

        {email && (
          <div className="bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl">
            <p className="text-sm font-semibold text-slate-200">{email}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Nueva contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-amber-500 focus:ring-amber-500/20 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="text-xs space-y-2 px-2 text-slate-400">
            <p>Tu contrasena debe tener:</p>
            <p className={`flex items-center gap-2 transition-colors ${hasLength ? "text-emerald-400" : ""}`}>
              <span className="text-lg">{hasLength ? "✓" : "○"}</span> 8 a 20 caracteres
            </p>
            <p className={`flex items-center gap-2 transition-colors ${hasUpperCase ? "text-emerald-400" : ""}`}>
              <span className="text-lg">{hasUpperCase ? "✓" : "○"}</span> Al menos una mayuscula
            </p>
            <p className={`flex items-center gap-2 transition-colors ${hasSpecialChar ? "text-emerald-400" : ""}`}>
              <span className="text-lg">{hasSpecialChar ? "✓" : "○"}</span> Al menos un caracter especial
            </p>
            <p className={`flex items-center gap-2 transition-colors ${isMatch ? "text-emerald-400" : ""}`}>
              <span className="text-lg">{isMatch ? "✓" : "○"}</span> Las dos contrasenas coinciden
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <Input
              type="password"
              placeholder="Confirmar contrasena"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-amber-500 focus:ring-amber-500/20 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-6 rounded-xl transition-all disabled:opacity-50 mt-6"
          >
            {loading ? "Guardando..." : "Continuar y Finalizar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#020817" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}