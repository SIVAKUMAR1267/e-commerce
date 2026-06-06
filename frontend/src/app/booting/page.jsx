"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function BootingPage() {
  const router = useRouter();
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const pingServer = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/health`,
          {
            timeout: 10000,
          }
        );

        if (!mounted) return;

        if (response.status >= 200 && response.status < 300) {
          router.replace("/");
          return;
        }
      } catch (err) {
        console.log("Backend still sleeping...");
      }

      if (mounted) {
        timerRef.current = setTimeout(pingServer, 3000);
      }
    };

    pingServer();

    return () => {
      mounted = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone flex items-center justify-center p-6">
      <div className="bg-white border-8 border-black p-12 shadow-neo-xl rotate-[-1deg] text-center max-w-lg w-full">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
          SYSTEM BOOTING
        </h1>

        <p className="font-bold text-lg uppercase mb-8 text-black/70">
          THE BACKEND IS CURRENTLY WAKING UP FROM HIBERNATION.
          PLEASE STAND BY...
        </p>

        <div className="flex justify-center gap-2">
          <div className="w-4 h-4 bg-neo-accent animate-bounce" />
          <div className="w-4 h-4 bg-black animate-bounce" />
          <div className="w-4 h-4 bg-neo-secondary animate-bounce" />
        </div>
      </div>
    </div>
  );
}