"use client"

import { SessionProvider, useSession, signOut } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if ((session as any)?.error === "RefreshAccessTokenError") {
      signOut({ redirect: false }).then(() => {
        router.push("/login")
      })
    }
  }, [session, router])

  return <>{children}</>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  )
}