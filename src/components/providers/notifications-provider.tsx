"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { toast } from "sonner";

type AlertPayload = {
  title?: string;
  message?: string;
  success?: boolean;
  timestamp?: string;
};

/**
 * Subscribes to /topic/notifications/{userId} on the notification-service WebSocket
 * and surfaces purchase confirmations as toasts. Mounted once at the app root.
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const userId =
      (session?.keycloakId as string | undefined) ??
      (session?.dbId !== undefined ? String(session.dbId) : undefined);

    if (!userId) return;

    const wsUrl = process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL;
    if (!wsUrl) {
      console.warn("[ws] NEXT_PUBLIC_NOTIFICATION_WS_URL not set");
      return;
    }

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 4000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      onConnect: () => {
        const destination = `/topic/notifications/${userId}`;
        subscriptionRef.current = client.subscribe(destination, (message: IMessage) => {
          try {
            const payload = JSON.parse(message.body) as AlertPayload;
            const title = payload.title ?? "Notificación";
            const description = payload.message ?? "";
            if (payload.success === false) {
              toast.error(title, { description });
            } else {
              toast.success(title, { description });
            }
            // Re-broadcast for components that need to react (e.g. /carrito waiting screen).
            window.dispatchEvent(
              new CustomEvent("purchase-notification", { detail: payload })
            );
          } catch (err) {
            console.error("[ws] Failed to parse alert", err);
          }
        });
      },
      onStompError: (frame) => {
        console.warn("[ws] STOMP error", frame.headers["message"], frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      try {
        subscriptionRef.current?.unsubscribe();
      } catch {}
      subscriptionRef.current = null;
      client.deactivate().catch(() => {});
      clientRef.current = null;
    };
  }, [status, session?.keycloakId, session?.dbId]);

  return <>{children}</>;
}
