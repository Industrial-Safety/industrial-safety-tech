"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GerenciaSidebar from "@/components/layout/GerenciaSidebar";
import Navbar from "@/components/layout/navbar";

export default function GerenciaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Basic auth logic matching other roles
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      // Un-comment below to enforce login
      // router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <GerenciaSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
