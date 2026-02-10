"use client";

export default function SectionDivider({ id }: { id: string }) {
  return (
    <div id={id} className="py-4 scroll-mt-8">
      <div className="border-t border-border/50 relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-3">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
