"use client";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  placeholder = "Tell us about your challenge...",
}: ChatInputProps) {
  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-8 pb-4 px-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent hover:bg-accent-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-muted mt-2">
          Or reach us directly at{" "}
          <a
            href="mailto:hello@disruptor.consulting"
            className="text-accent hover:underline"
          >
            hello@disruptor.consulting
          </a>
        </p>
      </div>
    </div>
  );
}
