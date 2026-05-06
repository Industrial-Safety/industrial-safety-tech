"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "usuario@ejemplo.com";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // 1. Aquí deberías llamar al endpoint de tu backend para actualizar la contraseña.
      // Ya que tienes el correo, puedes mandarlo para que se asigne la nueva clave.
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update-password`, {
      //   method: "PUT", // o POST
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password })
      // });

      // Opcional: Borramos la cookie para que no vuelva a caer aquí
      document.cookie = "is_new_oauth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 2. Cerramos el popup para que la ventana principal haga la redirección
      if (window.opener) {
        window.close();
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError("Ocurrió un error al establecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const hasLength = password.length >= 8 && password.length <= 20;
  const hasLettersAndNumbers = /(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
  const isMatch = password !== "" && password === confirmPassword;

  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ backgroundColor: "#020817" }}>
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Establecer contraseña</h1>
        
        <p className="text-sm text-slate-400 leading-relaxed px-2">
          Para mejorar la seguridad de tu cuenta y evitar problemas de inicio de sesión por no poder recibir códigos de verificación, establece una contraseña de acceso.
        </p>

        <div className="bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl">
          <p className="text-sm font-semibold text-slate-200">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <Input 
              type="password" 
              placeholder="Nueva contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-amber-500 focus:ring-amber-500/20 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="text-xs space-y-2 px-2 text-slate-400">
            <p>Tu contraseña debe tener:</p>
            <p className={`flex items-center gap-2 transition-colors ${hasLength ? "text-emerald-400" : ""}`}>
              <span className="text-lg">{hasLength ? "✓" : "○"}</span> 8 a 20 caracteres
            </p>
            <p className={`flex items-center gap-2 transition-colors ${hasLettersAndNumbers ? "text-emerald-400" : ""}`}>
              <span className="text-lg">{hasLettersAndNumbers ? "✓" : "○"}</span> Letras y números
            </p>
            <p className={`flex items-center gap-2 transition-colors ${isMatch ? "text-emerald-400" : ""}`}>
              <span className="text-lg">{isMatch ? "✓" : "○"}</span> Las dos contraseñas coinciden
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <Input 
              type="password" 
              placeholder="Confirmar contraseña" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-amber-500 focus:ring-amber-500/20 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={!hasLength || !hasLettersAndNumbers || !isMatch || loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-6 rounded-xl transition-all disabled:opacity-50 mt-6"
          >
            {loading ? "Guardando..." : "Continuar y Finalizar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
