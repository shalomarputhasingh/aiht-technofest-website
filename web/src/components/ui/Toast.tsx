"use client";

import { useEffect, useState } from "react";
import { on } from "@/lib/bus";

export default function Toast() {
  const [msg, setMsg] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const off = on("tf:toast", (m) => {
      setMsg(m);
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 4000);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {msg && (
        <div className="toast">
          <strong>{msg.title}</strong>
          <span>{msg.body}</span>
        </div>
      )}
    </div>
  );
}
