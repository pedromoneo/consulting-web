"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const cases = {
    "market-intelligence-pe": {
        title: "Market Intelligence for $2B Fund",
        sector: "Private Equity",
        tags: ["Intelligence", "AI-Powered"],
        result: "Identified 3 acquisition targets in 6 weeks",
        content: (
            <>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    A leading $2B Private Equity fund needed to map an entire emerging sector in European
                    retail technology. Traditional market research firms quoted 12 weeks for a static PDF report.
                    Disruptor delivered a living intelligence dashboard in half the time.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">The Challenge</h2>
                <p className="mb-6">
                    The fund needed granular data on 150+ startups, including proprietary sentiment analysis
                    from former employees and real-time capability assessments that weren't available in
                    public databases.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                    <div className="bg-surface p-6 rounded-2xl border border-border">
                        <h3 className="font-bold text-accent mb-2">Traditional Approach</h3>
                        <p className="text-sm text-muted-foreground">Manual web research, 30-page PDF, $150k cost, 12 weeks.</p>
                    </div>
                    <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20">
                        <h3 className="font-bold text-accent mb-2">Disruptor Approach</h3>
                        <p className="text-sm text-muted-foreground">AI-synthesized signals, Proprietary Expert Graph, Living Dashboard, 6 weeks.</p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">The Outcome</h2>
                <p className="mb-6">
                    By augmenting our senior practitioners with custom AI scrapers and synthesis engines,
                    we identified three prime acquisition targets that were "below the radar." The fund
                    closed on the priority target 4 months ahead of their typical investment cycle.
                </p>
            </>
        ),
    },
    "digital-transformation-healthcare": {
        title: "Digital Transformation Roadmap",
        sector: "Healthcare",
        tags: ["Transformation", "AI Augmentation"],
        result: "40% reduction in time-to-insight",
        content: (
            <>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    A regional healthcare system with 12 facilities was struggling with fragmented data
                    and manual reporting processes that delayed clinical decision-making. Disruptor
                    was engaged to build an AI-native operating model.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">The Strategy</h2>
                <p className="mb-6">
                    Instead of a multi-year ERP implementation, we focused on building a "Cognitive Layer"
                    on top of existing systems. This allowed for real-time patient flow optimization and
                    predictive staffing models.
                </p>
                <div className="bg-surface border border-border rounded-2xl p-8 my-10">
                    <h4 className="font-bold mb-4 uppercase tracking-widest text-[10px] text-accent">Key Delivery Items</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>Custom LLM for clinical protocol synthesis</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>Organizational redesign around "AI Pods"</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>Interim CDO placement for 12-month transition</span>
                        </li>
                    </ul>
                </div>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">The Impact</h2>
                <p className="mb-6">
                    The healthcare system achieved a 40% reduction in the time required to generate actionable
                    management insights. More importantly, we successfully placed the permanent leadership
                    team to maintain and evolve these systems.
                </p>
            </>
        ),
    },
    "innovation-lab-manufacturing": {
        title: "Innovation Lab Launch",
        sector: "Manufacturing",
        tags: ["Innovation", "Venture Building"],
        result: "2 new ventures in Year 1",
        content: (
            <>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    A global industrial manufacturer faced stagnation in its core automotive business.
                    They needed a way to identify and build new ventures in the circular economy space
                    without disrupting their main operations.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Venture-as-a-Service</h2>
                <p className="mb-6">
                    Disruptor built a custom Innovation Lab inside the company, staffed by our experts
                    working alongside the client's high-potentials. We deployed a specific venture-building
                    methodology designed for industrial constraints.
                </p>
                <p className="mb-6">
                    Within 12 months, the lab had evaluated 12 concepts, killed 10, and validated 2
                    significant new ventures that are now operating as independent subsidiaries.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Sustainable Legacy</h2>
                <p className="mb-6">
                    As per our "Programmed Disconnection" model, we spent the final phase of the project
                    hiring the full-time venture leads and training the corporate innovation team,
                    ensuring the lab could continue to operate profitably without further consulting spend.
                </p>
            </>
        ),
    },
};

export default function CasePage() {
    const { slug } = useParams();
    const router = useRouter();

    const caseData = cases[slug as keyof typeof cases];

    if (!caseData) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
                <p className="text-muted-foreground mb-8">Case study not found.</p>
                <Link href="/" className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-muted transition-all">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
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
                    <span className="text-xs font-mono text-muted">disruptor.consulting / cases</span>
                </div>
            </header>

            <div className="bg-surface/30 border-b border-border py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted bg-surface-hover px-3 py-1 rounded-full">
                            {caseData.sector}
                        </span>
                        {caseData.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-3xl font-bold text-foreground leading-[1.1] tracking-tight mb-8">
                        {caseData.title}
                    </h1>
                    <div className="flex items-center gap-3 bg-accent/5 border border-accent/10 rounded-2xl px-6 py-4 w-fit">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Measurable Result</p>
                            <p className="text-lg font-bold text-foreground">{caseData.result}</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 py-16 px-6">
                <article className="max-w-3xl mx-auto text-foreground prose prose-invert prose-accent lg:prose-xl">
                    {caseData.content}

                    <div className="mt-20 pt-10 border-t border-border">
                        <div className="bg-surface rounded-2xl p-8 border border-border">
                            <h3 className="text-xl font-bold mb-4">Have a similar challenge?</h3>
                            <p className="text-muted-foreground mb-6">
                                Our senior practitioners can help you bridge the gap between your current
                                reality and your future requirements.
                            </p>
                            <Link href="/#hire" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-muted transition-all">
                                Discuss Your Project
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

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
