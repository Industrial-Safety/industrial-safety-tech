"use client";

import { useEffect } from "react";

export default function AuthSuccessClient({ newUserEmail }: { newUserEmail?: string }) {
  useEffect(() => {
    const targetUrl = newUserEmail 
      ? `/auth/set-password?email=${encodeURIComponent(newUserEmail)}` 
      : "/";

    if (window.opener) {
      window.opener.location.href = targetUrl;
      window.close();
    } else {
      window.location.href = targetUrl;
    }
  }, [newUserEmail]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="text-sm text-muted-foreground font-medium">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
