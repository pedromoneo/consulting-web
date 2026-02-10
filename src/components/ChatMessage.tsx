"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessageProps {
  type: "assistant" | "user";
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ChatMessage({
  type,
  children,
  delay = 0,
  className = "",
}: ChatMessageProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  if (type === "user") {
    return (
      <div
        ref={ref}
        className={`flex justify-end mb-6 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } ${className}`}
      >
        <div className="max-w-2xl">
          <div className="bg-accent/10 border border-accent/20 rounded-2xl rounded-br-sm px-5 py-3.5">
            <p className="text-foreground text-sm leading-relaxed font-medium">
              {children}
            </p>
          </div>
          <p className="text-[10px] text-muted mt-1.5 text-right mr-2">You</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`flex mb-6 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      <div className="flex gap-3 max-w-4xl">
        <div className="flex-shrink-0 mt-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-[10px] font-mono">D</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm leading-relaxed text-foreground">
            {children}
          </div>
          <p className="text-[10px] text-muted mt-1.5">Disruptor</p>
        </div>
      </div>
    </div>
  );
}
