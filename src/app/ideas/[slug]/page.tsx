"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const articles = {
    "end-of-junior-pyramid": {
        title: "The End of the Junior Pyramid",
        date: "Feb 2026",
        tags: ["Intelligence", "Transformation"],
        content: (
            <>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    For decades, the business model of elite consulting firms has relied on a staffing pyramid:
                    a few senior partners supported by a vast army of junior associates. These juniors spent
                    thousands of hours performing the "heavy lifting"—data cleaning, research synthesis,
                    and slide production.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">The Efficiency Trap</h2>
                <p className="mb-6">
                    The structural model was profitable because firms billed junior hours at high margins.
                    However, AI has now automated the very tasks that justified this model. What used to
                    take a team of analysts three weeks now takes an AI-augmented senior expert three seconds.
                </p>
                <div className="bg-surface border border-border rounded-2xl p-8 my-10 border-l-4 border-l-accent">
                    <p className="text-xl italic text-foreground mb-4">
                        "We are moving from a world where we sold 'effort' to a world where we sell 'outcomes'.
                        In an AI-native firm, the pyramid is inverted."
                    </p>
                    <p className="text-sm font-bold text-accent uppercase tracking-widest">— Disruptor Research</p>
                </div>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">The Death of the Billable Hour</h2>
                <p className="mb-6">
                    When the labor-intensive middle layer of consulting vanishes, the billable hour becomes
                    meaningless. Clients are no longer willing to pay for "process"; they are paying for
                    privileged intelligence and validated results. At Disruptor, we've eliminated the pyramid
                    entirely, ensuring our clients never pay for the learning curve of a junior associate.
                </p>
            </>
        ),
    },
    "three-horizons": {
        title: "Three Horizons or Failure",
        date: "Jan 2026",
        tags: ["Innovation", "Strategy"],
        content: (
            <>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    Most organizations are optimized for Horizon 1: the core business of today. They focus
                    on incremental improvements and efficiency gains. But in a world of exponential
                    technological shifts, H1 optimization is a slow-motion collapse.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Building the Future</h2>
                <p className="mb-6">
                    A healthy organization must manage three horizons simultaneously:
                </p>
                <ul className="space-y-4 mb-8">
                    <li className="flex gap-4">
                        <span className="text-accent font-bold">H1:</span>
                        <span>Maintain and extend the core business.</span>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-accent font-bold">H2:</span>
                        <span>Nurture emerging opportunities that will become the next core.</span>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-accent font-bold">H3:</span>
                        <span>Create genuine options for the long-term future through moonshots.</span>
                    </li>
                </ul>
                <p className="mb-6">
                    Disruptor helps leaders rebalance their portfolio. We provide the intelligence to see H3
                    shifts early and the execution power to transform H2 concepts into H1 realities.
                </p>
            </>
        ),
    },
    "value-based-consulting": {
        title: "Value-Based Consulting Is Inevitable",
        date: "Jan 2026",
        tags: ["Transformation", "Value"],
        content: (
            <>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    Traditional consulting creates a perverse incentive: the longer a project takes and the
                    more people it requires, the more the consulting firm earns. This is fundamentally
                    misaligned with the client's interests.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Skin in the Game</h2>
                <p className="mb-6">
                    At Disruptor, we believe consulting must transition to a value-based model. If we
                    identify $100M in efficiency gains, our compensation should be tied to the realization
                    of that impact, not the number of slides we produced to explain it.
                </p>
                <p className="mb-6">
                    AI-native consulting allows us to operate with extreme lean-ness, meaning we can afford
                    to tie our success directly to yours. It eliminates the conflict of interest and
                    focuses every interaction on one thing: measurable business results.
                </p>
            </>
        ),
    },
    "knowledge-arbitrage": {
        title: "The 18-Month Knowledge Arbitrage",
        date: "Dec 2025",
        tags: ["Intelligence", "Research"],
        content: (
            <>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    The "best practices" sold by traditional consulting firms are often 18-24 months old
                    by the time they reach a boardroom. They are the synthesis of what worked for your
                    competitors two years ago.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Closing the Gap</h2>
                <p className="mb-6">
                    Disruptor operates on a different clock. Through our privileged access to academic
                    research networks and AI-powered signal detection, we identify emerging shifts while they
                    are still "alpha."
                </p>
                <p className="mb-6">
                    By closing the gap between academic discovery and industrial application, we give our
                    clients an 18-month lead. It's not about knowing what everyone else knows; it's about
                    knowing it before it becomes common wisdom.
                </p>
            </>
        ),
    },
};

export default function ArticlePage() {
    const { slug } = useParams();
    const router = useRouter();

    const article = articles[slug as keyof typeof articles];

    if (!article) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
                <p className="text-muted-foreground mb-8">Article not found.</p>
                <Link href="/" className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-muted transition-all">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border flex items-center px-6 gap-3 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-foreground">Back to Dashboard</span>
                </Link>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs font-mono text-muted">disruptor.consulting / ideas</span>
                </div>
            </header>

            {/* Hero */}
            <div className="bg-surface/30 border-b border-border py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                        <div className="flex-1" />
                        <span className="text-xs font-mono text-muted">{article.date}</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                        {article.title}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 py-16 px-6">
                <article className="max-w-3xl mx-auto text-foreground prose prose-invert prose-accent lg:prose-xl">
                    {article.content}

                    <div className="mt-20 pt-10 border-t border-border">
                        <div className="bg-surface rounded-2xl p-8 border border-border">
                            <h3 className="text-xl font-bold mb-4">Want more insights?</h3>
                            <p className="text-muted-foreground mb-6">
                                Our intelligence team regularly briefs boards and leadership teams on these shifts
                                months before they reach the mainsteam.
                            </p>
                            <Link href="/#hire" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-muted transition-all">
                                Book a Strategy Brief
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-border bg-surface/30">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg font-mono">D</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Disruptor</p>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-mono">AI-Native Consultancy</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">&copy; 2026 Disruptor Consulting. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
