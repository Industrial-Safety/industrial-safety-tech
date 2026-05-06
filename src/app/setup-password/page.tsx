"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from "lucide-react"

export default function SetupPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    // Aquí llamaremos a tu API para actualizar la clave y marcar como "no es primera vez"
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin") // O al dashboard que le toque
      }, 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/40 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-surface/50 backdrop-blur-xl border-border shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {!success ? (
          <>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Bienvenido al Sistema</CardTitle>
                <CardDescription>Para proteger tu cuenta, por favor establece una contraseña segura.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-surface-secondary/50 border-transparent focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-surface-secondary/50 border-transparent focus:border-primary"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full h-11 text-lg font-bold gap-2 group" disabled={loading}>
                    {loading ? "Configurando..." : (
                      <>
                        Activar Cuenta
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <CardContent className="py-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-success/20 flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">¡Cuenta Activada!</h2>
              <p className="text-muted italic">Redirigiéndote a tu panel de seguridad...</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
