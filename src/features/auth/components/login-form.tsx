"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenticateUser } from "../mocks/auth.mock";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const user = authenticateUser(email, password);

    if (user) {
      // Store mock session
      sessionStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      setError("Credenciales inválidas. Intenta de nuevo.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          Correo electrónico
        </label>
        <Input
          id="email"
          type="email"
          placeholder="admin@industrial-safety.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="password">
          Contraseña
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="rounded-lg border border-rose-600/30 bg-rose-600/10 px-4 py-2 text-sm text-rose-400">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={loading}>
        {loading ? "Ingresando…" : "Iniciar Sesión"}
      </Button>

      <p className="text-center text-xs text-muted">
        Demo: admin@industrial-safety.com / admin123
      </p>
    </form>
  );
}
