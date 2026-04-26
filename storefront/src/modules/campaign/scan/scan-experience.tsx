"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { postQrScan, type GymLocationLite } from "@lib/campaign/client"
import { getOrCreateDeviceId } from "@lib/campaign/device-id"

type Props = {
  gymLocationId: string
  initialGym: GymLocationLite
}

// ─── Social links ─────────────────────────────────────────────────────────────
const INSTAGRAM_URL =
  "https://www.instagram.com/morphfit_bangladesh?igsh=MXhpYndqcHprbG9nZQ%3D%3D&utm_source=qr"
const FACEBOOK_URL =
  "https://www.facebook.com/share/1W8N2bz7tF/?mibextid=wwXIfr"
const WEBSITE_URL = "/coming-soon"

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { src: "/products/whey.png",          name: "Gold Standard Whey",       tag: "Protein" },
  { src: "/products/c4.png",            name: "C4 Original Pre-Workout",  tag: "Pre-Workout" },
  { src: "/products/creatine_caps.png", name: "Microionized Creatine",    tag: "Strength" },
  { src: "/products/gold_creatine.png", name: "Gold Creatine",            tag: "Strength" },
  { src: "/products/tota_war.png",      name: "Tota War Pre-Workout",     tag: "Pre-Workout" },
  { src: "/products/magnesium.png",     name: "Glycinate Magnesium",      tag: "Wellness" },
  { src: "/products/multivitamin.png",  name: "One Daily Multivitamin",   tag: "Vitamins" },
]

// ─── Instagram SVG logo ───────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
  </svg>
)

// ─── Facebook SVG logo ────────────────────────────────────────────────────────
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <rect width="24" height="24" rx="6" fill="#1877F2" />
    <path
      d="M15.5 8H13.5C13.2 8 13 8.2 13 8.5V10H15.5L15.1 12.5H13V19H10.5V12.5H9V10H10.5V8.5C10.5 6.6 11.8 5.5 13.5 5.5C14.3 5.5 15.1 5.6 15.5 5.7V8Z"
      fill="white"
    />
  </svg>
)

// ─── MorphFit M logo ──────────────────────────────────────────────────────────
const MorphFitMIcon = () => (
  <div
    className="w-6 h-6 rounded-md grid place-items-center flex-shrink-0"
    style={{
      background: "linear-gradient(135deg, #F97316 0%, #ea6a0a 100%)",
      boxShadow: "0 0 10px rgba(249,115,22,0.5)",
    }}
  >
    <span className="font-black text-white text-sm leading-none" style={{ fontFamily: "inherit" }}>
      M
    </span>
  </div>
)

// ─── Link definitions ─────────────────────────────────────────────────────────
const LINKS = [
  {
    id: "instagram",
    label: "Follow on Instagram",
    sublabel: "@morphfit.bd",
    href: INSTAGRAM_URL,
    external: true,
    icon: <InstagramIcon />,
    gradient: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
    ring: "focus-visible:ring-[#fd1d1d]",
  },
  {
    id: "facebook",
    label: "Like on Facebook",
    sublabel: "MorphFit BD",
    href: FACEBOOK_URL,
    external: true,
    icon: <FacebookIcon />,
    gradient: "from-[#1877f2] to-[#0a5dc2]",
    ring: "focus-visible:ring-[#1877f2]",
  },
  {
    id: "website",
    label: "Visit our website",
    sublabel: "morphfit.com.bd",
    href: WEBSITE_URL,
    external: false,
    icon: <MorphFitMIcon />,
    gradient: "from-[#F97316] to-[#ea6a0a]",
    ring: "focus-visible:ring-[#F97316]",
  },
]

// ─── 3D Floating Product Carousel ─────────────────────────────────────────────
function ProductCarousel() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (idx: number, dir: "left" | "right") => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 320)
  }

  const next = () => {
    const idx = (active + 1) % PRODUCTS.length
    goTo(idx, "right")
  }

  const prev = () => {
    const idx = (active - 1 + PRODUCTS.length) % PRODUCTS.length
    goTo(idx, "left")
  }

  // Auto-advance every 3 s
  useEffect(() => {
    intervalRef.current = setInterval(next, 3000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [active, animating])

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(next, 3000)
  }

  const product = PRODUCTS[active]

  // Slide-in transform based on direction
  const enterFrom = direction === "right" ? "translateX(60px)" : "translateX(-60px)"

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="font-heading font-black text-xs uppercase tracking-[0.2em] text-white/40">
          Our Products
        </p>
        <div className="flex gap-1.5">
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const dir = i > active ? "right" : "left"
                goTo(i, dir)
                resetTimer()
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-5 bg-[#F97316]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Glow behind product */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(55% 55% at 50% 60%, rgba(249,115,22,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Product image area */}
        <div className="relative h-52 flex items-end justify-center px-6 pt-4">
          <div
            key={active}
            style={{
              animation: animating
                ? `slideOut${direction === "right" ? "Left" : "Right"} 0.32s ease forwards`
                : "floatProduct 4s ease-in-out infinite, fadeSlideIn 0.35s ease forwards",
              transformOrigin: "center bottom",
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(249,115,22,0.15))",
            }}
            className="relative w-full h-full flex items-end justify-center"
          >
            <Image
              src={product.src}
              alt={product.name}
              width={220}
              height={220}
              className="object-contain max-h-[200px] w-auto"
              priority
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
        </div>

        {/* Product info */}
        <div className="px-5 pb-4 pt-3 flex items-center justify-between">
          <div>
            <span
              className="inline-block text-[10px] font-heading font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full mb-1"
              style={{
                background: "rgba(249,115,22,0.15)",
                color: "#F97316",
                border: "1px solid rgba(249,115,22,0.25)",
              }}
            >
              {product.tag}
            </span>
            <p className="font-heading font-bold text-sm text-white leading-tight">
              {product.name}
            </p>
          </div>

          {/* Nav arrows */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => { prev(); resetTimer() }}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] grid place-items-center hover:bg-white/10 active:scale-95 transition-all duration-150"
              aria-label="Previous product"
            >
              <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => { next(); resetTimer() }}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] grid place-items-center hover:bg-white/10 active:scale-95 transition-all duration-150"
              aria-label="Next product"
            >
              <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes floatProduct {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(${direction === "right" ? "50px" : "-50px"}); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-50px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(50px); }
        }
      `}</style>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ScanExperience({ gymLocationId, initialGym }: Props) {
  const recordedRef = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (recordedRef.current) return
    recordedRef.current = true
    const deviceId = getOrCreateDeviceId()
    postQrScan({ gym_location_id: gymLocationId, device_id: deviceId, source: "qr" })
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [gymLocationId])

  const gymName = initialGym?.name ?? "Your Gym"
  const gymCity = initialGym?.area
    ? `${initialGym.area}, ${initialGym.city}`
    : (initialGym?.city ?? "Bangladesh")

  return (
    <div className="relative min-h-[100svh] bg-[#0b1220] text-white overflow-hidden flex flex-col">

      {/* ── Background layers ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(65% 55% at 50% -5%, rgba(249,115,22,0.30) 0%, transparent 65%), radial-gradient(55% 45% at 50% 105%, rgba(34,197,94,0.15) 0%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
        aria-hidden
        style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }}
      />

      {/* ── Content ── */}
      <main
        className={`relative flex flex-col items-center justify-center flex-1 px-5 py-10 gap-6 transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Brand logo mark */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-2xl grid place-items-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #ea6a0a 100%)",
              boxShadow: "0 0 40px rgba(249,115,22,0.45), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <span className="font-heading font-black text-3xl text-white tracking-tight">M</span>
          </div>
          <div className="text-center">
            <p className="font-heading font-black text-xl uppercase tracking-[0.12em] text-white">
              MorphFit
            </p>
            <p className="text-white/50 text-[11px] font-sans mt-0.5 tracking-wide">
              Premium supplements · Built for Bangladesh
            </p>
          </div>
        </div>

        {/* Gym badge */}
        <div
          className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm px-4 py-2"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse flex-shrink-0" />
          <span className="font-heading font-semibold uppercase tracking-[0.18em] text-xs text-white/80">
            {gymName}
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/50 text-xs font-sans">{gymCity}</span>
        </div>

        {/* 3D Product Carousel */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            width: "100%",
          }}
        >
          <ProductCarousel />
        </div>

        {/* Headline */}
        <div className="text-center max-w-xs">
          <h1 className="font-heading font-black text-3xl uppercase leading-[0.92] mb-2">
            Fuel your
            <br />
            <span style={{ color: "#F97316" }}>transformation</span>
          </h1>
          <p className="font-sans text-white/55 text-xs leading-relaxed">
            Lab-tested supplements priced in taka. Follow us, join the waitlist,
            or check out the store.
          </p>
        </div>

        {/* Social / Link buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {LINKS.map((link, i) => {
            const inner = (
              <div
                className={`
                  group relative w-full flex items-center gap-4 rounded-2xl px-5 py-4
                  border border-white/10 bg-white/[0.04] backdrop-blur-sm
                  hover:border-white/20 hover:bg-white/[0.08]
                  active:scale-[0.98]
                  transition-all duration-200 ease-out cursor-pointer
                  focus:outline-none focus-visible:ring-2 ${link.ring} focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]
                `}
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Icon container */}
                <div
                  className={`
                    w-11 h-11 rounded-xl flex-shrink-0 grid place-items-center text-white
                    bg-gradient-to-br ${link.gradient}
                    shadow-lg group-hover:shadow-xl transition-shadow duration-200
                  `}
                >
                  {link.icon}
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <p className="font-heading font-bold text-sm uppercase tracking-wide text-white leading-tight">
                    {link.label}
                  </p>
                  <p className="text-white/45 text-xs font-sans mt-0.5">
                    {link.sublabel}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            )

            return link.external ? (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${0.35 + i * 0.08}s, transform 0.5s ease ${0.35 + i * 0.08}s`,
                }}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={link.id}
                href={link.href}
                className="block"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${0.35 + i * 0.08}s, transform 0.5s ease ${0.35 + i * 0.08}s`,
                }}
              >
                {inner}
              </Link>
            )
          })}
        </div>

        {/* Sticker code watermark */}
        <p className="text-[10px] font-heading uppercase tracking-[0.3em] text-white/20">
          {initialGym?.sticker_code ?? gymLocationId.slice(0, 8)}
        </p>
      </main>

      {/* Footer */}
      <footer className="relative text-center pb-6 text-[10px] font-heading uppercase tracking-[0.25em] text-white/25">
        © MorphFit · Dhaka, Bangladesh
      </footer>
    </div>
  )
}
