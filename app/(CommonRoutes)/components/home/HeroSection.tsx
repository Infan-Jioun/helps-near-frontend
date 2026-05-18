/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Users, Phone, MapPin, Zap, Shield, Clock } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { authApi } from "@/lib/authApi"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

interface Stat {
    value: string
    label: string
    icon: React.ReactNode
}

const MARQUEE_ITEMS = [
    "Medical Emergency", "Fire Rescue", "Flood Relief",
    "Road Accident", "Missing Person", "Natural Disaster",
    "Blood Donation", "Food Crisis", "Mental Health",
    "Medical Emergency", "Fire Rescue", "Flood Relief",
    "Road Accident", "Missing Person", "Natural Disaster",
    "Blood Donation", "Food Crisis", "Mental Health",
]

export default function HeroSection() {
    const [stats, setStats] = useState<Stat[]>([])
    const [user, setUser] = useState<any>(null)

    // Refs
    const sectionRef = useRef<HTMLElement>(null)
    const badgeRef = useRef<HTMLDivElement>(null)
    const eyebrowRef = useRef<HTMLParagraphElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const phoneRef = useRef<HTMLDivElement>(null)
    const radarRef = useRef<HTMLDivElement>(null)
    const ring1Ref = useRef<HTMLDivElement>(null)
    const ring2Ref = useRef<HTMLDivElement>(null)
    const ring3Ref = useRef<HTMLDivElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const marqueeRef = useRef<HTMLDivElement>(null)
    const dotRefs = useRef<(HTMLDivElement | null)[]>([])

    // ─── GSAP ───────────────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Entrance stagger timeline
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
            tl.from(badgeRef.current, { y: -20, opacity: 0, duration: 0.55 })
                .from(eyebrowRef.current, { y: 28, opacity: 0, duration: 0.55 }, "-=0.3")
                .from(headlineRef.current, { y: 48, opacity: 0, duration: 0.75 }, "-=0.4")
                .from(descRef.current, { y: 28, opacity: 0, duration: 0.55 }, "-=0.45")
                .from(ctaRef.current, { y: 22, opacity: 0, duration: 0.5 }, "-=0.4")
                .from(phoneRef.current, { y: 14, opacity: 0, duration: 0.45 }, "-=0.35")
                .from(radarRef.current, {
                    scale: 0.65, opacity: 0, duration: 0.9,
                    ease: "back.out(1.5)",
                }, "-=0.85")

            // 2. Radar pulse rings (GSAP repeat)
            const pulseRing = (el: HTMLDivElement | null, delay: number) => {
                if (!el) return
                gsap.set(el, { scale: 0.55, opacity: 0.75, transformOrigin: "center center" })
                gsap.to(el, {
                    scale: 2.5,
                    opacity: 0,
                    duration: 3,
                    delay,
                    repeat: -1,
                    ease: "power2.out",
                })
            }
            pulseRing(ring1Ref.current, 0)
            pulseRing(ring2Ref.current, 1)
            pulseRing(ring3Ref.current, 2)

            // 3. Pin float
            gsap.to(pinRef.current, {
                y: -10,
                duration: 2.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            })

            // 4. Volunteer dots blink stagger
            dotRefs.current.forEach((dot, i) => {
                if (!dot) return
                gsap.to(dot, {
                    opacity: 0.1,
                    duration: 0.9,
                    delay: i * 0.45,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                })
            })

            // 5. Stats — scroll-triggered stagger
            if (statsRef.current) {
                gsap.from(Array.from(statsRef.current.children), {
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 86%",
                    },
                    y: 36,
                    opacity: 0,
                    duration: 0.55,
                    stagger: 0.1,
                    ease: "power2.out",
                })
            }

            // 6. Marquee section fade
            gsap.from(marqueeRef.current, {
                scrollTrigger: {
                    trigger: marqueeRef.current,
                    start: "top 93%",
                },
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    // ─── Data fetching ──────────────────────────────────────────────────
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [eRes, vRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/emergency`, { cache: "no-store" }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/volunteer`, { cache: "no-store" }),
                ])
                const eData = await eRes.json()
                const vData = await vRes.json()
                setStats([
                    { value: `${eData?.meta?.total || "2,400"}+`, label: "Resolved", icon: <Shield className="w-4 h-4" /> },
                    { value: `${vData?.meta?.total || "850"}+`, label: "Volunteers", icon: <Users className="w-4 h-4" /> },
                    { value: "24/7", label: "Available", icon: <Clock className="w-4 h-4" /> },
                    { value: "4.9★", label: "Rating", icon: <Zap className="w-4 h-4" /> },
                ])
            } catch {
                setStats([
                    { value: "2,400+", label: "Resolved", icon: <Shield className="w-4 h-4" /> },
                    { value: "850+", label: "Volunteers", icon: <Users className="w-4 h-4" /> },
                    { value: "24/7", label: "Available", icon: <Clock className="w-4 h-4" /> },
                    { value: "4.9★", label: "Rating", icon: <Zap className="w-4 h-4" /> },
                ])
            }
        }

        const fetchUser = async () => {
            try {
                const data = await authApi.getMe()
                setUser(data?.data || null)
            } catch {
                setUser(null)
            }
        }

        fetchStats()
        fetchUser()
    }, [])

    const dashboardRoute =
        user?.role === "ADMIN" ? "/dashboard/admin/create-emergency"
            : user?.role === "VOLUNTEER" ? "/dashboard/volunteer/create-emergency"
                : "/dashboard/user/create-emergency"

    return (
        <>
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                @keyframes badge-dot {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.2; }
                }
                .hero-marquee         { animation: marquee 30s linear infinite; }
                .hero-marquee:hover   { animation-play-state: paused; }
                .hero-badge-dot       { animation: badge-dot 1.6s ease-in-out infinite; }

                .stat-card { transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
                .stat-card:hover {
                    background: #fff5f5 !important;
                    border-color: #fca5a5 !important;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 28px rgba(220,38,38,0.09);
                }
                .cta-primary { transition: background 0.25s, box-shadow 0.25s, transform 0.2s !important; }
                .cta-primary:hover {
                    background: #b91c1c !important;
                    box-shadow: 0 8px 32px rgba(220,38,38,0.38) !important;
                    transform: translateY(-2px);
                }
                .cta-outline { transition: background 0.2s, border-color 0.2s, color 0.2s !important; }
                .cta-outline:hover {
                    background: #fef2f2 !important;
                    border-color: #fca5a5 !important;
                    color: #dc2626 !important;
                }

                @media (max-width: 768px)  { .radar-wrap { width: 260px !important; height: 260px !important; } }
                @media (max-width: 480px)  {
                    .hero-h1 { font-size: clamp(2.75rem, 14vw, 3.5rem) !important; }
                }
            `}</style>

            <section
                ref={sectionRef}
                className=" mt-20 lg:mt-24 relative min-h-screen flex flex-col justify-center overflow-hidden bg-white"
            >
                {/* Dot-grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                        opacity: 0.5,
                    }}
                />

                {/* Ambient glows */}
                <div className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 65%)" }} />
                <div className="absolute -bottom-28 -left-28 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 65%)" }} />

                {/* ── Live badge ── */}
                <div ref={badgeRef} className="absolute top-8 left-0 right-0 flex justify-center z-10">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                            background: "rgba(220,38,38,0.07)",
                            border: "1px solid rgba(220,38,38,0.2)",
                            color: "#dc2626",
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 hero-badge-dot" />
                        Emergency Help Platform — Bangladesh
                    </div>
                </div>

                {/* ── Main grid ── */}
                <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-10">
                    <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-center">

                        {/* Left */}
                        <div className="flex flex-col">
                            <p
                                ref={eyebrowRef}
                                className="text-[11px] font-bold tracking-[0.28em] uppercase mb-5"
                                style={{ color: "#9ca3af" }}
                            >
                                Community-Driven · Verified · Instant
                            </p>

                            <h1
                                ref={headlineRef}
                                className="hero-h1 font-black leading-[0.9] mb-7"
                                style={{
                                    fontSize: "clamp(3rem, 7.5vw, 6rem)",
                                    letterSpacing: "-0.035em",
                                    color: "#111827",
                                }}
                            >
                                Help is<br />
                                Always{" "}
                                <span className="relative inline-block" style={{ color: "#dc2626" }}>
                                    Near
                                    <svg
                                        className="absolute -bottom-1 left-0 w-full"
                                        viewBox="0 0 180 8"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M2 5 Q45 1 90 4.5 Q135 8 178 3"
                                            stroke="#dc2626"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            fill="none"
                                            strokeOpacity="0.45"
                                        />
                                    </svg>
                                </span>
                                .
                            </h1>

                            <p
                                ref={descRef}
                                className="leading-relaxed mb-10 max-w-[500px]"
                                style={{ color: "#6b7280", fontSize: "1.0625rem" }}
                            >
                                Connect with verified volunteers in your area during emergencies.
                                Fast, reliable, and community-driven response —{" "}
                                <span style={{ color: "#374151", fontWeight: 500 }}>
                                    because every second counts.
                                </span>
                            </p>

                            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 mb-7">
                                <Button
                                    size="lg"
                                    className="cta-primary gap-2.5 font-semibold text-sm px-8 h-12 rounded-xl"
                                    style={{ background: "#dc2626", color: "#fff", border: "none" }}
                                    asChild
                                >
                                    <Link href={dashboardRoute}>
                                        <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                                        Report Emergency Now
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="cta-outline gap-2.5 font-semibold text-sm px-8 h-12 rounded-xl"
                                    style={{
                                        background: "transparent",
                                        border: "1.5px solid #e5e7eb",
                                        color: "#374151",
                                    }}
                                    asChild
                                >
                                    <Link href="/volunteer-register">
                                        <Users className="w-4 h-4" />
                                        Become a Volunteer
                                    </Link>
                                </Button>
                            </div>

                            <div
                                ref={phoneRef}
                                className="hidden md:flex items-center gap-2"
                                style={{ color: "#9ca3af", fontSize: "0.8125rem" }}
                            >
                                <Phone className="w-3.5 h-3.5 text-red-500" />
                                <span>Life-threatening emergency? Call</span>
                                <a href="tel:999" className="font-bold hover:underline" style={{ color: "#dc2626" }}>
                                    999
                                </a>
                                <span>first</span>
                            </div>
                        </div>

                        {/* Right — Radar */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div
                                ref={radarRef}
                                className="relative radar-wrap"
                                style={{ width: 360, height: 360 }}
                            >
                                {/* Static grid rings */}
                                {[0, 17, 34].map((inset, i) => (
                                    <div
                                        key={i}
                                        className="absolute rounded-full"
                                        style={{
                                            inset: `${inset}%`,
                                            border: "1px solid rgba(0,0,0,0.055)",
                                        }}
                                    />
                                ))}

                                {/* Cross lines */}
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full h-px" style={{ background: "rgba(0,0,0,0.05)" }} />
                                </div>
                                <div className="absolute inset-0 flex justify-center">
                                    <div className="h-full w-px" style={{ background: "rgba(0,0,0,0.05)" }} />
                                </div>

                                {/* GSAP pulse rings */}
                                <div
                                    ref={ring1Ref}
                                    className="absolute rounded-full"
                                    style={{
                                        inset: "38%",
                                        background: "rgba(220,38,38,0.1)",
                                        border: "1.5px solid rgba(220,38,38,0.45)",
                                    }}
                                />
                                <div
                                    ref={ring2Ref}
                                    className="absolute rounded-full"
                                    style={{
                                        inset: "38%",
                                        background: "rgba(220,38,38,0.07)",
                                        border: "1.5px solid rgba(220,38,38,0.3)",
                                    }}
                                />
                                <div
                                    ref={ring3Ref}
                                    className="absolute rounded-full"
                                    style={{
                                        inset: "38%",
                                        background: "rgba(220,38,38,0.03)",
                                        border: "1.5px solid rgba(220,38,38,0.18)",
                                    }}
                                />

                                {/* Center pin */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div ref={pinRef} className="flex flex-col items-center gap-1">
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center"
                                            style={{
                                                background: "#dc2626",
                                                boxShadow:
                                                    "0 0 0 10px rgba(220,38,38,0.1), 0 0 0 22px rgba(220,38,38,0.05)",
                                            }}
                                        >
                                            <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div
                                            style={{
                                                width: 12, height: 5,
                                                borderRadius: 9999,
                                                background: "rgba(220,38,38,0.2)",
                                                filter: "blur(3px)",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Volunteer dots */}
                                {[
                                    { top: "10%", left: "52%" },
                                    { top: "46%", left: "88%" },
                                    { top: "76%", left: "27%" },
                                    { top: "21%", left: "13%" },
                                    { top: "64%", left: "72%" },
                                ].map((pos, i) => (
                                    <div
                                        key={i}
                                        ref={el => { dotRefs.current[i] = el }}
                                        className="absolute rounded-full"
                                        style={{
                                            top: pos.top,
                                            left: pos.left,
                                            width: 9, height: 9,
                                            background: "#dc2626",
                                            boxShadow: "0 0 0 3px rgba(220,38,38,0.18)",
                                        }}
                                    />
                                ))}

                                {/* Floating info chips */}
                                <div className="absolute" style={{ top: "-12px", right: "-18px" }}>
                                    <div
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #fee2e2",
                                            color: "#dc2626",
                                            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 hero-badge-dot" />
                                        5 volunteers active
                                    </div>
                                </div>
                                <div className="absolute" style={{ bottom: "-6px", left: "-14px" }}>
                                    <div
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #e5e7eb",
                                            color: "#374151",
                                            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <Shield className="w-3 h-3 text-green-500" />
                                        Verified &amp; trusted
                                    </div>
                                </div>

                                {/* Label */}
                                <div
                                    className="absolute -bottom-9 left-0 right-0 flex justify-center"
                                    style={{ color: "#d1d5db", fontSize: "0.6875rem", letterSpacing: "0.22em" }}
                                >
                                    LIVE COVERAGE AREA
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats ── */}
                    {stats.length > 0 && (
                        <div ref={statsRef} className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {stats.map(({ value, label, icon }) => (
                                <div
                                    key={label}
                                    className="stat-card flex items-center gap-4 px-5 py-4 rounded-2xl cursor-default"
                                    style={{ background: "#fafafa", border: "1px solid #f3f4f6" }}
                                >
                                    <div
                                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: "#fee2e2", color: "#dc2626" }}
                                    >
                                        {icon}
                                    </div>
                                    <div>
                                        <div className="text-xl font-black leading-none mb-0.5" style={{ color: "#111827" }}>
                                            {value}
                                        </div>
                                        <div className="text-xs" style={{ color: "#9ca3af" }}>
                                            {label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Marquee ── */}
                <div
                    ref={marqueeRef}
                    className="relative w-full overflow-hidden py-4 mt-4"
                    style={{
                        borderTop: "1px solid #f3f4f6",
                        borderBottom: "1px solid #f3f4f6",
                        background: "#fafafa",
                    }}
                >
                    <div
                        className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10"
                        style={{ background: "linear-gradient(to right, #fafafa, transparent)" }}
                    />
                    <div
                        className="absolute right-0 top-0 h-full w-20 pointer-events-none z-10"
                        style={{ background: "linear-gradient(to left, #fafafa, transparent)" }}
                    />

                    <div className="flex whitespace-nowrap hero-marquee">
                        {MARQUEE_ITEMS.map((item, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-2.5 mx-6 text-[11px] font-semibold tracking-[0.2em] uppercase"
                                style={{ color: i % 3 === 0 ? "#dc2626" : "#d1d5db" }}
                            >
                                <span
                                    className="w-1 h-1 rounded-full flex-shrink-0"
                                    style={{ background: i % 3 === 0 ? "#dc2626" : "#e5e7eb" }}
                                />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}