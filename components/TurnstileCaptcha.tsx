"use client";

import { useEffect, useRef } from "react";

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void;
}

export default function TurnstileCaptcha({ onVerify }: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.error("Turnstile Site Key is missing");
      return;
    }

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        containerRef.current.innerHTML = "";

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: (token: string) => {
            onVerifyRef.current(token);
          },
        });
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);

      return () => clearInterval(interval);
    }

    // Cleanup on unmount
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-16.25 flex items-center justify-center mx-auto"
    />
  );
}

// Add type definition for window.turnstile
declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}
