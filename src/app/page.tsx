"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import ServiceCard from "../components/ServiceCard";
import SectionDivider from "../components/SectionDivider";
import ChatInput from "../components/ChatInput";
import ProfilePage from "../components/ProfilePage";
import AIToolsPage from "../components/AIToolsPage";
import AdminPanel from "../components/AdminPanel";
import { useAuth } from "@/context/AuthContext";

const services = [
  {
    number: "01",
    title: "Intelligence",
    tagline: "We know what others don't\u2014yet.",
    description:
      "Privileged access to academic research, AI-powered analysis, and senior expert interviews. Understand your position today with intelligence no other firm can access.",
    features: [
      "Industry Intelligence Briefs",
      "Competitive Position Assessments",
      "Emerging Horizon Scans",
      "Executive Education Programs",
    ],
    accent: "blue",
  },
  {
    number: "02",
    title: "Transformation",
    tagline: "Build what\u2019s next, with proof it works.",
    description:
      "Strategic transformation with measurable milestones. We bridge the gap between your current reality and future requirements across technology, organization, and culture.",
    features: [
      "Digital Transformation Roadmaps",
      "Organizational Redesign",
      "New Business Model Development",
      "Growth & M&A Advisory",
    ],
    accent: "emerald",
  },
  {
    number: "03",
    title: "Innovation",
    tagline: "Shape the future. Don\u2019t follow it.",
    description:
      "High-risk, high-reward initiatives focused on creating entirely new value. We help you become an industry shaper through calculated bets on breakthrough opportunities.",
    features: [
      "Innovation Labs & Incubation",
      "Venture Building",
      "Moonshot Projects",
      "Future-of-Industry Research",
    ],
    accent: "violet",
  },
  {
    number: "04",
    title: "Handoff",
    tagline: "We don\u2019t just leave\u2014we complete the circuit.",
    description:
      "Every engagement includes programmed succession. We identify, place, and support the permanent leader who carries your transformation forward.",
    features: [
      "Executive Search & Placement",
      "Knowledge Transfer Systems",
      "Leadership Onboarding",
      "Ongoing Advisory Access",
    ],
    accent: "amber",
  },
];

const ideas = [
  {
    tags: ["Intelligence", "Transformation"],
    title: "The End of the Junior Pyramid",
    excerpt:
      "Why AI doesn't just augment consulting\u2014it eliminates the structural model that made Big Four firms profitable.",
    date: "Feb 2026",
    url: "/ideas/end-of-junior-pyramid",
  },
  {
    tags: ["Innovation", "Strategy"],
    title: "Three Horizons or Failure",
    excerpt:
      "Organizations managing only today's business are already dying. A framework for simultaneous management across all three horizons.",
    date: "Jan 2026",
    url: "/ideas/three-horizons",
  },
  {
    tags: ["Transformation", "Value"],
    title: "Value-Based Consulting Is Inevitable",
    excerpt:
      "When your consultant's revenue depends on your success, everything changes. The structural case for outcome-tied compensation.",
    date: "Jan 2026",
    url: "/ideas/value-based-consulting",
  },
  {
    tags: ["Intelligence", "Research"],
    title: "The 18-Month Knowledge Arbitrage",
    excerpt:
      "Academic research becomes consulting frameworks in 18\u201324 months. We close that gap to days.",
    date: "Dec 2025",
    url: "/ideas/knowledge-arbitrage",
  },
];

const cases = [
  {
    slug: "market-intelligence-pe",
    sector: "Private Equity",
    title: "Market Intelligence for $2B Fund",
    result: "Identified 3 acquisition targets in 6 weeks",
    tags: ["Intelligence", "AI-Powered"],
    description:
      "Comprehensive sector mapping combining 25 expert interviews with AI-synthesized market data. Living dashboard replaced static quarterly reports.",
    url: "/cases/market-intelligence-pe",
  },
  {
    slug: "digital-transformation-healthcare",
    sector: "Healthcare",
    title: "Digital Transformation Roadmap",
    result: "40% reduction in time-to-insight",
    tags: ["Transformation", "AI Augmentation"],
    description:
      "Redesigned data infrastructure and decision-making processes for a regional healthcare system. Placed a Chief Digital Officer to carry forward.",
    url: "/cases/digital-transformation-healthcare",
  },
  {
    slug: "innovation-lab-manufacturing",
    sector: "Manufacturing",
    title: "Innovation Lab Launch",
    result: "2 new ventures in Year 1",
    tags: ["Innovation", "Venture Building"],
    description:
      "Built an internal innovation capability from scratch, including methodology, team, and first two venture concepts through to market validation.",
    url: "/cases/innovation-lab-manufacturing",
  },
];

const pillars = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Privileged Intelligence",
    desc: "University research network gives us knowledge 18\u201324 months before it becomes mainstream consulting wisdom.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Senior Expert Architecture",
    desc: "Every project led by practitioners who have done what you need\u2014not career consultants. Advisory boards activated on demand.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI Augmentation",
    desc: "Every expert has a cognitive army. AI replaces the junior pyramid entirely\u2014faster, better, at near-zero marginal cost.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Value-Based Model",
    desc: "We don't sell time or slides. Compensation tied to measurable, documented, attributed business impact.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18l6-6-6-6" />
      </svg>
    ),
    title: "Programmed Disconnection",
    desc: "Built-in handoff by design. We place the permanent leader to carry your transformation forward.",
  },
];

const placeholders = {
  home: "Tell us about your challenge...",
  services: "Which service horizon interests you most?",
  ideas: "Ask about our latest research or thinking...",
  cases: "Would you like me to show you examples of our work in a particular industry?",
  aitools: "How can our AI tools help your team?",
  about: "Ask about our senior expert architecture...",
  hire: "Tell us about a project you have in mind...",
  talent: "Ask about joining our expert network...",
  profile: "Ask about your recorded preferences...",
};

export default function Home() {

  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState("");

  const { user } = useAuth();
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNavigate = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const sections = ["home", "services", "ideas", "cases", "aitools", "about", "hire", "talent", "profile"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-surface/50 backdrop-blur-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono text-muted">
              disruptor.consulting
            </span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="hidden sm:inline">AI-Native Innovation & Transformation</span>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <a href="mailto:hello@disruptor.consulting" className="text-accent hover:text-accent-muted transition-colors hidden sm:inline">
              Contact
            </a>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {user?.role === "admin" && (
              <div className="mb-12">
                <AdminPanel />
                <SectionDivider id="admin-divider" />
              </div>
            )}
            {/* ========================= */}
            {/* SECTION: HERO / WELCOME   */}
            {/* ========================= */}
            <section id="home" className="scroll-mt-20">
              <ChatMessage type="assistant">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 text-[10px] text-muted font-mono bg-surface px-3 py-1.5 rounded-full border border-border mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    WELCOME TO DISRUPTOR, A NEW CATEGORY OF PROFESSIONAL SERVICES
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 tracking-tight">
                    We deploy world-class experts,{" "}
                    <span className="bg-gradient-to-r from-accent to-orange-500 bg-clip-text text-transparent">
                      powered by AI
                    </span>
                    , to create measurable business value.
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Left column – Video (portrait 9:16) */}
                    <div className="flex justify-center">
                      <div className="w-full max-w-[280px] rounded-xl overflow-hidden border border-border shadow-lg">
                        <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/_Pv231RCH2I"
                            title="Disruptor welcome"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right column – Text + CTAs */}
                    <div className="flex flex-col justify-center">
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                        No hours billed. No decks delivered. Just senior experts
                        augmented by AI, with compensation tied to your
                        outcomes.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleNavigate("services")}
                          className="px-5 py-2.5 bg-accent hover:bg-accent-muted text-white text-sm font-medium rounded-lg transition-all"
                        >
                          Explore Our Services
                        </button>
                        <button
                          onClick={() => handleNavigate("about")}
                          className="px-5 py-2.5 bg-surface hover:bg-surface-hover text-foreground text-sm font-medium rounded-lg border border-border hover:border-border-light transition-all"
                        >
                          How We&apos;re Different
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ChatMessage>
            </section>

            <SectionDivider id="services-divider" />

            {/* ========================= */}
            {/* SECTION: SERVICES         */}
            {/* ========================= */}
            <section id="services" className="scroll-mt-20">
              <ChatMessage type="user" delay={0}>
                What services does Disruptor offer?
              </ChatMessage>

              <ChatMessage type="assistant" delay={100}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                  {/* Left Column: Text Content */}
                  <div className="lg:col-span-3">
                    <p className="mb-6 leading-relaxed">
                      We organize our work around{" "}
                      <strong className="text-foreground">four service horizons</strong>,
                      each designed to meet you where you are and take you where you
                      need to go. Every engagement is led exclusively by senior
                      practitioners, augmented by AI, and tied to measurable outcomes.
                    </p>

                    <ul className="flex flex-col gap-2.5 mb-8 ml-1">
                      {services.map((h) => (
                        <li key={h.number} className="flex items-center gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                            Horizon {h.number}: {h.title}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-surface rounded-xl border border-border p-5 mb-2">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        The Seamless Path from Today to Tomorrow
                      </h4>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 text-xs text-muted-foreground">
                        {["Learn", "Diagnose", "Transform", "Innovate", "Sustain"].map(
                          (step, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="bg-accent/10 text-accent px-2.5 py-1 rounded-md font-medium whitespace-nowrap">
                                {step}
                              </span>
                              {i < 4 && (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  className="text-border hidden sm:block"
                                >
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              )}
                            </div>
                          )
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-4">
                        Transformation is not a handoff—it is a progression. We bridge the gap between your current reality
                        and the AI-native future by partnering with you at every step. From aligning your vision with
                        privileged intelligence to executing moonshot innovations and placing the permanent leadership to
                        sustain them, we don&apos;t just point the way; we walk it with you.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Vertical Video */}
                  <div className="lg:col-span-2 w-full max-w-[280px] mx-auto lg:ml-auto">
                    <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-border bg-black shadow-2xl group">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/qdUdZiK9ws8?autoplay=0&mute=1&loop=1&playlist=qdUdZiK9ws8"
                        title="Disruptor Services Overview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 pointer-events-none border-2 border-accent/20 rounded-2xl group-hover:border-accent/40 transition-colors" />
                    </div>
                    <p className="text-[10px] text-muted text-center mt-3 uppercase tracking-widest">
                      How we work
                    </p>
                  </div>
                </div>
              </ChatMessage>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {services.map((service, i) => (
                  <ServiceCard key={i} {...service} delay={i * 100 + 300} />
                ))}
              </div>


            </section>

            <SectionDivider id="ideas-divider" />

            {/* ========================= */}
            {/* SECTION: IDEAS            */}
            {/* ========================= */}
            <section id="ideas" className="scroll-mt-20">
              <ChatMessage type="user" delay={0}>
                What&apos;s your latest thinking?
              </ChatMessage>

              <ChatMessage type="assistant" delay={100}>
                <p className="mb-4">
                  Our research team continuously synthesizes academic findings
                  with market reality. Here&apos;s what we&apos;re thinking about right now:
                </p>
              </ChatMessage>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {ideas.map((idea, i) => (
                  <ChatMessage key={i} type="assistant" delay={i * 100 + 200}>
                    <a
                      href={idea.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <div className="group bg-surface rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {idea.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          <div className="flex-1" />
                          <span className="text-[10px] font-mono text-muted">{idea.date}</span>
                        </div>
                        <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                          {idea.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                          {idea.excerpt}
                        </p>
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                            Read Article
                          </span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  </ChatMessage>
                ))}
              </div>
            </section>

            <SectionDivider id="cases-divider" />

            {/* ========================= */}
            {/* SECTION: CASES            */}
            {/* ========================= */}
            <section id="cases" className="scroll-mt-20">
              <ChatMessage type="user" delay={0}>
                Can you show me examples of past work?
              </ChatMessage>

              <ChatMessage type="assistant" delay={100}>
                <p className="mb-4">
                  Every engagement produces documented, attributed results.
                  Here are representative examples of the value we create:
                </p>
              </ChatMessage>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {cases.map((c, i) => (
                  <ChatMessage key={i} type="assistant" delay={i * 150 + 200}>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <div className="group bg-surface rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-muted bg-surface-hover px-2 py-0.5 rounded">
                            {c.sector}
                          </span>
                          {c.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                          {c.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                          {c.description}
                        </p>

                        <div className="flex items-center gap-2 bg-accent/5 border border-accent/10 rounded-lg px-3 py-1.5 mb-4">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-accent"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">
                            {c.result}
                          </span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                            View Case Study
                          </span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  </ChatMessage>
                ))}
              </div>
            </section>

            <SectionDivider id="aitools-divider" />

            {/* ========================= */}
            {/* SECTION: AI TOOLS          */}
            {/* ========================= */}
            <section id="aitools" className="scroll-mt-20">
              <ChatMessage type="assistant" delay={0}>
                <AIToolsPage />
              </ChatMessage>
            </section>
            <SectionDivider id="about-divider" />

            {/* ========================= */}
            {/* SECTION: ABOUT            */}
            {/* ========================= */}
            <section id="about" className="scroll-mt-20">
              <ChatMessage type="user" delay={0}>
                How is Disruptor different from traditional consultancies?
              </ChatMessage>

              <ChatMessage type="assistant" delay={100}>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 font-mono tracking-tight">The AI-Native Advantage</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-4">
                      &quot;Traditional consultancies sell effort. We sell privileged intelligence.&quot;
                    </p>
                  </div>

                  {/* Top: 2-Column (Video | Pillars) */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Left: Video */}
                    <div className="lg:col-span-2">
                      <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-border bg-black shadow-2xl group">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src="https://www.youtube.com/embed/ceXvA2iqb2M?autoplay=0&mute=1&loop=1&playlist=ceXvA2iqb2M"
                          title="About Disruptor"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    {/* Right: Pillars in a Single Box */}
                    <div className="lg:col-span-3 space-y-4">

                      <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
                        <p className="text-sm text-foreground mb-4 font-medium px-1">
                          Our Five Core Pillars:
                        </p>
                        <div className="space-y-3">
                          {pillars.map((pillar, i) => (
                            <div key={i} className="flex gap-4 p-2.5 rounded-xl hover:bg-background/50 transition-all group">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all transform group-hover:scale-105">
                                {pillar.icon}
                              </div>
                              <div className="pt-0.5">
                                <h4 className="text-[13px] font-bold text-foreground mb-0.5">{pillar.title}</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">{pillar.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Below: Single Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Efficiency Benchmark */}
                    <div className="bg-surface rounded-xl border border-accent/20 overflow-hidden shadow-inner">
                      <div className="bg-accent/5 px-4 py-2 border-b border-border">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Efficiency Benchmark</span>
                      </div>
                      <div className="divide-y divide-border">
                        {[
                          ["Team Size", "8+ per project", "2\u20133 seniors + AI"],
                          ["Result Speed", "Weeks/Months", "Days/Weeks"],
                          ["Pricing Model", "Hourly/Effort", "Value/Outcome"],
                          ["Knowledge", "Leaves with team", "Embedded in AI"],
                        ].map(([dim, trad, dsp], i) => (
                          <div key={i} className="grid grid-cols-3 text-[10px] py-2.5 px-4 items-center group/row">
                            <span className="text-muted-foreground font-medium group-hover/row:text-foreground transition-colors">{dim}</span>
                            <span className="text-muted/40 line-through decoration-muted/20">{trad}</span>
                            <span className="text-accent font-bold">{dsp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Research Network */}
                    <div className="bg-surface rounded-xl border border-border p-4">
                      <h5 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-3 px-1">University Research Network</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { name: "RGI / Crummer", focus: "Innovation & Exec Ed", role: "Founding Alliance" },
                          { name: "MIT", focus: "Deep Tech & AI Frontier", role: "Priority Expansion" },
                          { name: "Georgia Tech", focus: "Applied AI & Engineering", role: "Priority Expansion" }
                        ].map(uni => (
                          <div key={uni.name} className="flex items-center justify-between p-2.5 bg-background/30 rounded-lg border border-border/50 hover:border-accent/20 transition-colors">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">{uni.name}</span>
                              <span className="text-[10px] text-muted">{uni.focus}</span>
                            </div>
                            <span className="text-[9px] px-2 py-0.5 bg-accent/5 text-accent rounded-full border border-accent/10">{uni.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ChatMessage>

              <ChatMessage type="user" delay={1000}>
                How do I get in touch?
              </ChatMessage>

              <ChatMessage type="assistant" delay={1100}>
                <div className="bg-gradient-to-br from-accent/10 to-orange-600/5 rounded-xl border border-accent/20 p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Let&apos;s start a conversation.
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Whether you&apos;re a CEO facing disruption, a PE firm evaluating
                    sectors, or a board preparing for what&apos;s next\u2014we&apos;d like to
                    hear from you.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 7l-10 7L2 7" />
                      </svg>
                      <a
                        href="mailto:hello@disruptor.consulting"
                        className="text-accent hover:underline"
                      >
                        hello@disruptor.consulting
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-muted-foreground">
                        Winter Park, FL &middot; Boston, MA &middot; Atlanta, GA
                      </span>
                    </div>
                  </div>
                </div>
              </ChatMessage>
            </section>

            <SectionDivider id="hire-divider" />

            {/* ========================= */}
            {/* SECTION: HIRE US          */}
            {/* ========================= */}
            <section id="hire" className="scroll-mt-20">
              <ChatMessage type="user" delay={0}>
                I&apos;d like to engage Disruptor for a project. How do we get started?
              </ChatMessage>

              <ChatMessage type="assistant" delay={100}>
                <div className="mb-4">
                  <p className="mb-4">
                    Every engagement begins with a conversation. Tell us about your
                    challenge and we&apos;ll match you with the right senior experts and
                    AI capabilities. Here&apos;s how it works:
                  </p>
                </div>
              </ChatMessage>

              <ChatMessage type="assistant" delay={200}>
                <div className="bg-surface rounded-xl border border-border p-5 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        step: "01",
                        title: "Discovery Call",
                        desc: "30-minute conversation to understand your challenge, timeline, and expected outcomes.",
                      },
                      {
                        step: "02",
                        title: "Proposal & Team",
                        desc: "We design a value-based engagement with clear milestones and assign senior experts.",
                      },
                      {
                        step: "03",
                        title: "Delivery & Handoff",
                        desc: "AI-augmented execution with programmed succession. You keep the knowledge and the leader.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                          <span className="text-accent font-mono text-xs font-bold">{item.step}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ChatMessage>

              <ChatMessage type="assistant" delay={300}>
                <div className="bg-surface rounded-xl border border-border p-6">
                  <h4 className="text-base font-semibold text-foreground mb-4">
                    Request a Discovery Call
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      window.location.href = "mailto:hello@disruptor.consulting?subject=Discovery Call Request";
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Name</label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Company</label>
                        <input
                          type="text"
                          placeholder="Your organization"
                          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Service Interest</label>
                      <select
                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                      >
                        <option value="">Select a service area</option>
                        <option value="intelligence">Intelligence</option>
                        <option value="transformation">Transformation</option>
                        <option value="innovation">Innovation</option>
                        <option value="handoff">Handoff / Executive Placement</option>
                        <option value="multiple">Multiple / Not sure yet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Tell us about your challenge</label>
                      <textarea
                        rows={3}
                        placeholder="What problem are you trying to solve? What does success look like?"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-accent hover:bg-accent-muted text-white text-sm font-medium rounded-lg transition-all"
                    >
                      Request Discovery Call
                    </button>
                  </form>
                  <p className="text-xs text-muted mt-4">
                    Or email us directly at{" "}
                    <a href="mailto:hello@disruptor.consulting" className="text-accent hover:underline">
                      hello@disruptor.consulting
                    </a>
                  </p>
                </div>
              </ChatMessage>
            </section>

            <SectionDivider id="talent-divider" />

            {/* ========================= */}
            {/* SECTION: TALENT / JOIN US */}
            {/* ========================= */}
            <section id="talent" className="scroll-mt-20">
              <ChatMessage type="user" delay={0}>
                I&apos;m a senior expert / university fellow. How do I join?
              </ChatMessage>

              <ChatMessage type="assistant" delay={100}>
                <div className="mb-4">
                  <p className="mb-4">
                    We&apos;re building a curated network of the world&apos;s best minds. There
                    are two primary pathways:
                  </p>
                </div>
              </ChatMessage>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ChatMessage type="assistant" delay={200}>
                  <div className="bg-surface rounded-xl border border-border p-5 hover:border-border-light transition-all h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Senior Advisors
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      Join our expert network as an advisory board member.
                      Contribute your expertise on a pay-per-use basis, only when
                      your specific knowledge is needed.
                    </p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        Meaningful contribution, not full-time commitment
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        Work alongside other world-class practitioners
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        AI augmentation makes you exponentially more effective
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        Pathway to permanent executive placements
                      </li>
                    </ul>
                  </div>
                </ChatMessage>

                <ChatMessage type="assistant" delay={300}>
                  <div className="bg-surface rounded-xl border border-border p-5 hover:border-border-light transition-all h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">
                        University Fellows
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      Through our consulting club partnerships at RGI/Crummer,
                      MIT, Georgia Tech and beyond. Work on live projects
                      alongside senior experts from day one.
                    </p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        AI-augmented from your first professional experience
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        Substantive work, not PowerPoint factory
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        Direct mentorship from engagement leaders
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">&bull;</span>
                        Pipeline to expert network and leadership roles
                      </li>
                    </ul>
                  </div>
                </ChatMessage>
              </div>

              <ChatMessage type="assistant" delay={500}>
                <div className="bg-surface rounded-xl border border-border p-5 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Interested? We&apos;d love to hear from you.
                  </p>
                  <a
                    href="mailto:talent@disruptor.consulting"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-muted text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 7L2 7" />
                    </svg>
                    talent@disruptor.consulting
                  </a>
                </div>
              </ChatMessage>
            </section>

            <SectionDivider id="profile-divider" />

            {/* ========================= */}
            {/* SECTION: PROFILE           */}
            {/* ========================= */}
            <section id="profile" className="scroll-mt-20">
              <ChatMessage type="assistant" delay={0}>
                <ProfilePage />
              </ChatMessage>
            </section>

            {/* ========================= */}
            {/* LIVE CONVERSATION        */}
            {/* ========================= */}
            {messages.length > 0 && (
              <>
                <SectionDivider id="chat-divider" />
                <div className="space-y-0">
                  {messages.map((m) => {
                    const text = m.parts
                      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                      .map((p) => p.text)
                      .join("") || "";
                    return (
                      <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : ""} mb-6`}>
                        {m.role === "user" ? (
                          <div className="max-w-2xl">
                            <div className="bg-accent/10 border border-accent/20 rounded-2xl rounded-br-sm px-5 py-3.5">
                              <p className="text-foreground text-sm leading-relaxed font-medium">
                                {text}
                              </p>
                            </div>
                            <p className="text-[10px] text-muted mt-1.5 text-right mr-2">You</p>
                          </div>
                        ) : (
                          <div className="flex gap-3 max-w-4xl">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
                                <span className="text-white font-bold text-[10px] font-mono">D</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                {text}
                              </div>
                              <p className="text-[10px] text-muted mt-1.5">Disruptor</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex mb-6">
                      <div className="flex gap-3 max-w-4xl">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
                            <span className="text-white font-bold text-[10px] font-mono">D</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 py-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </>
            )}

            {/* Spacer for input */}
            <div className="h-32" />
          </div>

          {/* Sticky input */}
          <ChatInput
            input={chatInput}
            handleInputChange={(e) => setChatInput(e.target.value)}
            placeholder={placeholders[activeSection as keyof typeof placeholders]}
            handleSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim() || isLoading) return;
              sendMessage({ text: chatInput.trim() });
              setChatInput("");
            }}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
