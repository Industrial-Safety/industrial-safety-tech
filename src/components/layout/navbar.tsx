"use client";

import { MockUser } from "@/features/auth/mocks/auth.mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const roleLabels: Record<MockUser["role"], string> = {
  admin: "Administrador",
  supervisor: "Supervisor",
  operator: "Operador",
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-surface px-6">
      <h2 className="text-sm font-medium text-muted">
        Panel de Control
      </h2>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-secondary text-muted">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {roleLabels[user.role]}
              </Badge>
            </div>
          </div>
        )}

        <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
