"use client";

import { useEffect, useRef, useState } from "react";

interface ServiceCardProps {
  number: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  accent: string;
  delay?: number;
}

const accentColors: Record<string, string> = {
  blue: "from-white to-white border-border hover:border-border-light",
  emerald: "from-white to-white border-border hover:border-border-light",
  violet: "from-white to-white border-border hover:border-border-light",
  amber: "from-white to-white border-border hover:border-border-light",
};

const dotColors: Record<string, string> = {
  blue: "bg-accent",
  emerald: "bg-accent",
  violet: "bg-accent",
  amber: "bg-accent",
};

const numColors: Record<string, string> = {
  blue: "text-accent",
  emerald: "text-accent",
  violet: "text-accent",
  amber: "text-accent",
};

export default function ServiceCard({
  number,
  title,
  tagline,
  description,
  features,
  accent,
  delay = 0,
}: ServiceCardProps) {
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

  return (
    <div
      ref={ref}
      className={`group relative rounded-xl border bg-gradient-to-b p-6 transition-all duration-500 hover-lift cursor-default ${
        accentColors[accent]
      } ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={`font-mono text-xs font-bold ${numColors[accent]}`}
        >
          {number}
        </span>
        <div className={`w-2 h-2 rounded-full ${dotColors[accent]}`} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className={`text-xs italic mb-3 ${numColors[accent]}`}>{tagline}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className={`mt-1 ${numColors[accent]}`}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                <path d="M10 3L4.5 8.5 2 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
