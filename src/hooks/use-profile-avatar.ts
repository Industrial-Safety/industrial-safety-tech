"use client";

import { useState, useEffect } from "react";

const EVENT = "profile-avatar-updated";

export function useProfileAvatar(email: string | undefined) {
  const key = email ? `avatar_${email}` : null;

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(() => {
    if (typeof window === "undefined" || !key) return undefined;
    return localStorage.getItem(key) ?? undefined;
  });

  useEffect(() => {
    if (!key) return;
    const stored = localStorage.getItem(key);
    if (stored) setAvatarUrl(stored);

    const handler = () => {
      const updated = localStorage.getItem(key);
      setAvatarUrl(updated ?? undefined);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [key]);

  const updateAvatar = (base64: string) => {
    if (!key) return;
    localStorage.setItem(key, base64);
    setAvatarUrl(base64);
    window.dispatchEvent(new Event(EVENT));
  };

  return { avatarUrl, updateAvatar };
}
