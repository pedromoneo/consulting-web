"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import DashboardLayout from "../components/DashboardLayout";
import ChatMessage from "../components/ChatMessage";
import ServiceCard from "../components/ServiceCard";
import SectionDivider from "../components/SectionDivider";
import ChatInput from "../components/ChatInput";
import ProfilePage from "../components/ProfilePage";
import AIToolsPage from "../components/AIToolsPage";
import AdminPanel from "../components/AdminPanel";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { collection, getDocs, query, where, limit, doc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const services = [
  {
    number: "01",
    title: "Intelligence",
    tagline: "We know what others don't—yet.",
    description: "Privileged access to academic research, AI-powered analysis, and senior expert interviews. Understand your position today with intelligence no other firm can access.",
    features: ["Industry Intelligence Briefs", "Competitive Position Assessments", "Emerging Horizon Scans", "Executive Education Programs"],
    accent: "blue",
  },
  {
    number: "02",
    title: "Transformation",
    tagline: "Build what’s next, with proof it works.",
    description: "Strategic transformation with measurable milestones. We bridge the gap between your current reality and future requirements across technology, organization, and culture.",
    features: ["Digital Transformation Roadmaps", "Organizational Redesign", "New Business Model Development", "Growth & M&A Advisory"],
    accent: "emerald",
  },
  {
    number: "03",
    title: "Innovation",
    tagline: "Shape the future. Don’t follow it.",
    description: "High-risk, high-reward initiatives focused on creating entirely new value. We help you become an industry shaper through calculated bets on breakthrough opportunities.",
    features: ["Innovation Labs & Incubation", "Venture Building", "Moonshot Projects", "Future-of-Industry Research"],
    accent: "violet",
  },
  {
    number: "04",
    title: "Handoff",
    tagline: "We don’t just leave—we complete the circuit.",
    description: "Every engagement includes programmed succession. We identify, place, and support the permanent leader who carries your transformation forward.",
    features: ["Executive Search & Placement", "Knowledge Transfer Systems", "Leadership Onboarding", "Ongoing Advisory Access"],
    accent: "amber",
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
    desc: "University research network gives us knowledge 18–24 months before it becomes mainstream consulting wisdom.",
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
    desc: "Every project led by practitioners who have done what you need—not career consultants. Advisory boards activated on demand.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI Augmentation",
    desc: "Every expert has a cognitive army. AI replaces the junior pyramid entirely—faster, better, at near-zero marginal cost.",
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
  aitools: "How can our tools help your team?",
  model: "Ask about our senior expert architecture...",
  experts: "Ask about our senior practitioners...",
  hire: "Tell us about a project you have in mind...",
  talent: "Ask about joining our expert network...",
  profile: "Ask about your recorded preferences...",
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState("");
  const [allExperts, setAllExperts] = useState<any[]>([]);
  const [featuredIdeas, setFeaturedIdeas] = useState<any[]>([]);
  const [featuredCases, setFeaturedCases] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const expertsQuery = query(collection(db, "experts"), where("status", "==", "featured"), limit(6));
        const ideasQuery = query(collection(db, "ideas"), where("status", "==", "featured"), limit(4));
        const casesQuery = query(collection(db, "cases"), where("status", "==", "featured"), limit(3));

        const [expertsSnap, ideasSnap, casesSnap] = await Promise.all([
          getDocs(expertsQuery),
          getDocs(ideasQuery),
          getDocs(casesQuery)
        ]);

        setAllExperts(expertsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setFeaturedIdeas(ideasSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setFeaturedCases(casesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching dashboard content:", error);
      }
    };
    fetchContent();
  }, []);

  const { user, loading: authLoading } = useAuth();

  // Manual chat implementation to bypass broken useChat hook
  const [messages, setMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    // Save message to Firestore log
    if (user) {
      try {
        const chatRef = doc(db, "users", user.uid, "chatHistory", "current");
        // Create document if it doesn't exist, or update array
        await setDoc(chatRef, {
          messages: arrayUnion(userMsg),
          updatedAt: Timestamp.now(),
          userEmail: user.email, // Convenient for summary
          userName: user.name || user.email || "Unknown"
        }, { merge: true });
      } catch (e) {
        console.error("Failed to log user message", e);
      }
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const assistantMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream done");

            // Log assistant response after full stream
            if (user && assistantContent) {
              try {
                const chatRef = doc(db, "users", user.uid, "chatHistory", "current");
                await updateDoc(chatRef, {
                  messages: arrayUnion({ id: assistantMsgId, role: "assistant", content: assistantContent }),
                  updatedAt: Timestamp.now()
                });
              } catch (e) {
                console.error("Failed to log assistant response", e);
              }
            }
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          console.log("Received chunk:", chunk);
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: assistantContent } : m
            )
          );
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatFocus = () => {
    if (!user) {
      setShowLogin(true);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const isLoading = isChatLoading || authLoading;

  useEffect(() => {
    if (user && pendingRedirect) {
      router.push(pendingRedirect);
      setPendingRedirect(null);
    }
  }, [user, pendingRedirect, router]);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNavigate = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    const container = document.getElementById("main-scroll-container");

    if (el && container) {
      const elTop = el.getBoundingClientRect().top;
      const containerTop = container.getBoundingClientRect().top;
      container.scrollTo({
        top: container.scrollTop + (elTop - containerTop) - 20,
        behavior: "smooth"
      });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const sections = ["home", "model", "services", "experts", "ideas", "cases", "aitools", "contact", "hire", "talent", "admin-panel"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
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
    <DashboardLayout
      activeSection={activeSection}
      isSidebarOpen={sidebarOpen}
      setIsSidebarOpen={setSidebarOpen}
      isLoginOpen={showLogin}
      setIsLoginOpen={setShowLogin}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-48">
        {/* ========================= */}
        {/* SECTION: HERO / WELCOME   */}
        {/* ========================= */}
        <section id="home" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-[10px] text-muted font-mono bg-surface px-3 py-1.5 rounded-full border border-border mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                WELCOME TO DISRUPTOR, A NEW CATEGORY OF PROFESSIONAL SERVICES
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 tracking-tight">
                We deploy world-class experts,{" "}
                <span className="bg-gradient-to-r from-accent to-orange-500 bg-clip-text text-transparent"> powered by AI </span>
                , to create measurable business value.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">
                  <div className="w-full max-w-[280px] rounded-xl overflow-hidden border border-border shadow-lg">
                    <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                      <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/_Pv231RCH2I" title="Disruptor welcome" frameBorder="0" allowFullScreen />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                    No hours billed. No decks delivered. Just senior experts augmented by AI, with compensation tied to your outcomes.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleNavigate("services")} className="px-5 py-2.5 bg-accent hover:bg-accent-muted text-white text-sm font-medium rounded-lg transition-all">Explore Our Services</button>
                    <button
                      onClick={() => {
                        setPendingRedirect("/profile");
                        setShowLogin(true);
                      }}
                      className="px-5 py-2.5 bg-foreground text-background hover:bg-muted font-medium rounded-lg transition-all text-sm"
                    >
                      Join as Expert
                    </button>
                    <button onClick={() => handleNavigate("about")} className="px-5 py-2.5 bg-surface hover:bg-surface-hover text-foreground text-sm font-medium rounded-lg border border-border transition-all">How We&apos;re Different</button>
                  </div>
                </div>
              </div>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="model-divider" />

        <section id="model" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Our Model</h3>
              <p className="text-muted-foreground max-w-2xl mb-6">
                Discover how Disruptor&apos;s senior expert architecture and AI-augmented approach sets us apart.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-8">
                <div className="lg:col-span-2">
                  <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-border bg-black shadow-2xl">
                    <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/ceXvA2iqb2M" title="About Disruptor" frameBorder="0" allowFullScreen />
                  </div>
                </div>
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
                    <p className="text-sm font-medium mb-4">Our Five Core Pillars:</p>
                    <div className="space-y-3">
                      {pillars.map((pillar, i) => (
                        <div key={i} className="flex gap-4 p-2.5 rounded-xl hover:bg-background/50 transition-all group">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all transform group-hover:scale-105">
                            {pillar.icon}
                          </div>
                          <div className="pt-0.5">
                            <h4 className="text-[13px] font-bold mb-0.5">{pillar.title}</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{pillar.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Efficiency Benchmark */}
                <div className="bg-surface rounded-xl border border-accent/20 overflow-hidden shadow-inner">
                  <div className="bg-accent/5 px-4 py-2 border-b border-border">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Efficiency Benchmark</span>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["Team Size", "8+ per project", "2–3 seniors + AI"],
                      ["Result Speed", "Weeks/Months", "Days/Weeks"],
                      ["Pricing Model", "Hourly/Effort", "Value/Outcome"],
                      ["Knowledge", "Leaves with team", "Embedded in AI"],
                    ].map(([dim, trad, dsp], i) => (
                      <div key={i} className="grid grid-cols-3 text-[10px] py-2.5 px-4 items-center group/row">
                        <span className="text-muted-foreground font-medium group-hover/row:text-foreground transition-colors">{dim}</span>
                        <span className="text-foreground line-through decoration-muted/40">{trad}</span>
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
        </section>

        <SectionDivider id="services-divider" />

        {/* ========================= */}
        {/* SECTION: SERVICES         */}
        {/* ========================= */}
        <section id="services" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Services</h3>
              <p className="text-muted-foreground max-w-2xl mb-6">Four service horizons designed to take you where you need to go.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, i) => (
                  <ServiceCard key={i} {...service} delay={i * 100} />
                ))}
              </div>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="experts-divider" />

        {/* ========================= */}
        {/* SECTION: EXPERTS          */}
        {/* ========================= */}
        <section id="experts" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <h3 className="text-2xl font-bold mb-6">Experts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {allExperts.map((expert, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div className="bg-surface rounded-xl border border-border p-5 hover:border-accent/40 transition-all h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-accent/10 border border-border/50">
                        <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{expert.name}</h4>
                        <p className="text-xs text-muted-foreground">{expert.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{expert.excerpt || expert.bio}</p>
                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {expert.tags?.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[9px] bg-accent/5 text-accent px-1.5 py-0.5 rounded border border-accent/10 uppercase font-bold">{tag}</span>
                        ))}
                      </div>
                      <a
                        href={expert.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-[#0077b5] transition-colors flex-shrink-0"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/experts" className="px-6 py-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg text-sm font-semibold text-accent transition-all">View All Experts</Link>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="ideas-divider" />

        {/* ========================= */}
        {/* SECTION: IDEAS            */}
        {/* ========================= */}
        <section id="ideas" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <h3 className="text-2xl font-bold mb-6">Ideas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {featuredIdeas.map((idea, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <Link href={`/ideas/${idea.id}`} className="group bg-surface rounded-xl border border-border p-5 hover:border-accent/40 transition-all block h-full">
                    <span className="text-[10px] font-mono text-muted block mb-2">{idea.date}</span>
                    <h4 className="text-base font-bold group-hover:text-accent transition-colors mb-2">{idea.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{idea.excerpt}</p>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/ideas" className="px-6 py-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg text-sm font-semibold text-accent transition-all">View All Ideas</Link>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="cases-divider" />

        {/* ========================= */}
        {/* SECTION: CASES            */}
        {/* ========================= */}
        <section id="cases" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <h3 className="text-2xl font-bold mb-6">Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {featuredCases.map((c, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <Link href={`/cases/${c.id}`} className="group bg-surface rounded-xl border border-border p-5 hover:border-accent/40 transition-all block h-full">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted bg-surface-hover px-2 py-0.5 rounded">{c.sector}</span>
                    </div>
                    <h4 className="text-base font-bold group-hover:text-accent transition-colors mb-2">{c.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{c.excerpt || c.description}</p>
                    <div className="flex items-center gap-2 bg-accent/5 border border-accent/10 rounded-lg px-3 py-1.5">
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{c.result}</span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/cases" className="px-6 py-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg text-sm font-semibold text-accent transition-all">View All Cases</Link>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="aitools-divider" />

        {/* ========================= */}
        {/* SECTION: AI TOOLS         */}
        {/* ========================= */}
        <section id="aitools" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <AIToolsPage />
            <div className="flex justify-center mt-8">
              <Link href="/tools" className="px-6 py-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg text-sm font-semibold text-accent transition-all">View All Tools</Link>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="hire-divider" />

        {/* ========================= */}
        {/* SECTION: HIRE US          */}
        {/* ========================= */}
        <section id="hire" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <h3 className="text-2xl font-bold mb-6">Engagement Models</h3>
            <p className="text-muted-foreground max-w-2xl mb-8">
              Choose the level of engagement that fits your strategic velocity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface rounded-xl border border-border p-5 hover:border-accent/40 transition-all group">
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">The Sprint</div>
                <h4 className="text-lg font-bold text-foreground mb-2">Diagnostic & Strategy</h4>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  A 2-week intensive deep dive to answer a critical strategic question or validate a hypothesis.
                </p>
                <ul className="text-[10px] space-y-2 mb-4 text-muted-foreground">
                  <li className="flex gap-2"><span className="text-accent">✓</span> Market Intelligence Scan</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> 5 Senior Expert Interviews</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> Strategic Roadmap</li>
                </ul>
              </div>

              <div className="bg-surface rounded-xl border border-accent/30 p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-accent text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Most Popular</div>
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">The Transformation</div>
                <h4 className="text-lg font-bold text-foreground mb-2">Execution & Change</h4>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  End-to-end partnership to implement a major organizational shift or launch a new venture.
                </p>
                <ul className="text-[10px] space-y-2 mb-4 text-muted-foreground">
                  <li className="flex gap-2"><span className="text-accent">✓</span> Dedicated Squad (3 Experts + AI)</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> 90-Day Execution Sprints</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> Outcome-Based Fees</li>
                </ul>
              </div>

              <div className="bg-surface rounded-xl border border-border p-5 hover:border-accent/40 transition-all group">
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">The Advisory</div>
                <h4 className="text-lg font-bold text-foreground mb-2">On-Demand Access</h4>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Monthly hour packages providing on-demand access to our expert network and proprietary AI tools.
                </p>
                <ul className="text-[10px] space-y-2 mb-4 text-muted-foreground">
                  <li className="flex gap-2"><span className="text-accent">✓</span> Unlimited AI Tool Access</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> Flexible Expert Hours</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> Priority Response SLA</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-surface rounded-xl border border-border p-6 sm:p-8">
                <h4 className="text-xl font-bold mb-6 text-center">Ready to start? Tell us about your project.</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // In a real app, send data to backend
                    alert("Thanks for reaching out! We'll be in touch shortly.");
                    (e.target as HTMLFormElement).reset();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Name</label>
                      <input name="name" type="text" required placeholder="John Doe" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Email</label>
                      <input name="email" type="email" required placeholder="john@company.com" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Company Name</label>
                      <input name="company" type="text" placeholder="Acme Inc." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Position</label>
                      <input name="position" type="text" placeholder="CEO / Founder" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Phone Number</label>
                    <input name="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Project Description</label>
                    <textarea name="description" required rows={4} placeholder="What are you looking to achieve?" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent outline-none resize-none" />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full bg-accent hover:bg-accent-muted text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20">
                      Let&apos;s talk!
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="talent-divider" />

        {/* ========================= */}
        {/* SECTION: JOIN US (TALENT) */}
        {/* ========================= */}
        <section id="talent" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <h3 className="text-2xl font-bold mb-6">Join the Network</h3>
            <div className="bg-gradient-to-r from-surface to-surface-hover rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <h4 className="text-xl font-bold mb-4">Are you a top 1% expert?</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    The future of consulting is decentralized. We are building the world&apos;s most exclusive network of senior operators, researchers, and technologists.
                  </p>
                  <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                    Monetize your deep domain expertise without the grind of traditional employment. We handle the sales, ops, and AI infrastructure—you deliver the insight.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setPendingRedirect("/profile");
                        setShowLogin(true);
                      }}
                      className="bg-foreground text-background hover:bg-muted transition-colors px-5 py-2.5 rounded-lg text-sm font-bold"
                    >
                      Join as Expert
                    </button>
                  </div>
                </div>
                <div className="bg-accent/5 p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-border">
                  <div className="space-y-4 w-full max-w-xs">
                    <div className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border/50 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">1</div>
                      <div>
                        <div className="text-xs font-bold">Apply</div>
                        <div className="text-[10px] text-muted-foreground">Submit your credentials</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border/50 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">2</div>
                      <div>
                        <div className="text-xs font-bold">Vet</div>
                        <div className="text-[10px] text-muted-foreground">Peer review & interview</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border/50 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">3</div>
                      <div>
                        <div className="text-xs font-bold">Deploy</div>
                        <div className="text-[10px] text-muted-foreground">Match with high-value projects</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ChatMessage>
        </section>

        <SectionDivider id="contact-divider" />

        {/* ========================= */}
        {/* SECTION: CONTACT          */}
        {/* ========================= */}
        <section id="contact" className="scroll-mt-3">
          <ChatMessage type="assistant">
            <h3 className="text-2xl font-bold mb-6">Contact</h3>
            <div className="bg-gradient-to-br from-accent/10 to-orange-600/5 rounded-xl border border-accent/20 p-6">
              <h4 className="text-lg font-semibold mb-2">Let&apos;s start a conversation.</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Whether you&apos;re a CEO facing disruption, a PE firm evaluating sectors, or a board preparing for what&apos;s next—we&apos;d like to hear from you.
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </div>
                  <a href="mailto:hello@disruptor.consulting" className="text-accent font-bold hover:underline">hello@disruptor.consulting</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <span className="text-muted-foreground">Winter Park, FL · Boston, MA · Atlanta, GA</span>
                </div>
              </div>
            </div>
          </ChatMessage>
        </section>

        {messages.length > 0 && (
          <>
            <SectionDivider id="chat-divider" />
            <div className="space-y-6">
              {messages.map((m: any) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                  <div className={`max-w-2xl px-5 py-3.5 rounded-2xl ${m.role === "user" ? "bg-accent/10 border border-accent/20" : "bg-surface border border-border"}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-200 min-h-[1.5em]">{m.content || " "}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-12 z-10 transition-all">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            input={chatInput}
            handleInputChange={(e) => setChatInput(e.target.value)}
            placeholder={placeholders[activeSection as keyof typeof placeholders] || placeholders.home}
            handleSubmit={async (e) => {
              e.preventDefault();
              if (!chatInput.trim() || isLoading) return;
              await handleSendMessage(chatInput);
              setChatInput("");
            }}
            isLoading={isLoading}
            onFocus={handleChatFocus}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
