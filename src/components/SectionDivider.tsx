"use client";

export default function SectionDivider({ id }: { id: string }) {
  return (
    <div id={id} className="py-4 scroll-mt-8">
      <div className="border-t border-border/50" />
    </div>
  );
}
