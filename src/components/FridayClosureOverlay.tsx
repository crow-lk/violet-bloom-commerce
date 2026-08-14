import { useEffect, useRef, useState } from "react";
import { isFridayClosureTime } from "@/lib/fridayClosure";

export default function FridayClosureOverlay() {
  const [isClosed, setIsClosed] = useState(() => isFridayClosureTime());
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClosureState = () => setIsClosed(isFridayClosureTime());
    const intervalId = window.setInterval(updateClosureState, 1_000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isClosed) return;

    const website = document.getElementById("website-content");
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    website?.setAttribute("inert", "");
    website?.setAttribute("aria-hidden", "true");
    overlayRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      website?.removeAttribute("inert");
      website?.removeAttribute("aria-hidden");
    };
  }, [isClosed]);

  if (!isClosed) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Chuttakpay Friday closure notice"
      tabIndex={-1}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/50 p-4 outline-none"
    >
      <img
        src="/friday-closure.jpeg"
        alt="Chuttakpay is closed every Friday from 12:00 PM to 2:00 PM for mosque. We apologise for any inconvenience caused."
        className="max-h-[75dvh] max-w-[85vw] select-none rounded-2xl object-contain shadow-2xl"
        draggable={false}
      />
    </div>
  );
}
