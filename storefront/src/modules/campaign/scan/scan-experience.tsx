"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { postQrScan, type GymLocationLite } from "@lib/campaign/client"
import { getOrCreateDeviceId } from "@lib/campaign/device-id"

type Props = {
  gymLocationId: string
  initialGym: GymLocationLite
}

//// ─── Social links ─────────────────────────────────────────────────────────
const INSTAGRAM_URL = "https://www.instagram.com/morphfit_bangladesh?igsh=MXhpYndqcHprbG9nZQ%3D%3D&utm_source=qr"
const FACEBOOK_URL = "https://www.facebook.com/share/1W8N2bz7tF/?mibextid=wwXIfr"
const WEBSITE_URL = "/coming-soon"

// ─── Link definitions ─────────────────────────────────────────────────────────
const LINKS = [
  {
    id: "instagram",
    label: "Follow on Instagram",
    sublabel: "@morphfit.bd",
    href: INSTAGRAM_URL,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    gradient: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
    ring: "focus-visible:ring-[#fd1d1d]",
  },
  {
    id: "facebook",
    label: "Like on Facebook",
    sublabel: "MorphFit BD",
    href: FACEBOOK_URL,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    gradient: "from-[#1877f2] to-[#0a5dc2]",
    ring: "focus-visible:ring-[#1877f2]",
  },
  {
    id: "website",
    label: "Visit our website",
    sublabel: "morphfit.com.bd",
    href: WEBSITE_URL,
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    gradient: "from-[#F97316] to-[#ea6a0a]",
    ring: "focus-visible:ring-[#F97316]",
  },
]

export default function ScanExperience({ gymLocationId, initialGym }: Props) {
  const recordedRef = useRef(false)
  const [visible, setVisible] = useState(false)

  // Record the scan once on mount
  useEffect(() => {
    if (recordedRef.current) return
    recordedRef.current = true
    const deviceId = getOrCreateDeviceId()
    postQrScan({ gym_location_id: gymLocationId, device_id: deviceId, source: "qr" })
    // Trigger entrance animation after a tiny delay
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
            "radial-gradient(65% 55% at 50% -5%, rgba(249,115,22,0.35) 0%, transparent 65%), radial-gradient(55% 45% at 50% 105%, rgba(34,197,94,0.20) 0%, transparent 65%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      {/* Glowing orb */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        aria-hidden
        style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }}
      />

      {/* ── Content ── */}
      <main
        className={`relative flex flex-col items-center justify-center flex-1 px-5 py-12 gap-8 transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Brand logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-2xl grid place-items-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #ea6a0a 100%)",
              boxShadow: "0 0 40px rgba(249,115,22,0.45), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <span className="font-heading font-black text-4xl text-white tracking-tight">M</span>
          </div>
          <div className="text-center">
            <p className="font-heading font-black text-2xl uppercase tracking-[0.12em] text-white">
              MorphFit
            </p>
            <p className="text-white/50 text-xs font-sans mt-0.5 tracking-wide">
              Premium supplements · Built for Bangladesh
            </p>
          </div>
        </div>

        {/* Gym badge */}
        <div
          className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm px-4 py-2"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
        >
          <span className="w-2 h-2 rounded-full bg-cta animate-pulse flex-shrink-0" />
          <span className="font-heading font-semibold uppercase tracking-[0.18em] text-xs text-white/80">
            {gymName}
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/50 text-xs font-sans">{gymCity}</span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-xs">
          <h1 className="font-heading font-black text-4xl uppercase leading-[0.92] mb-3">
            Fuel your
            <br />
            <span className="text-primary">transformation</span>
          </h1>
          <p className="font-sans text-white/60 text-sm leading-relaxed">
            Lab-tested supplements priced in taka. Follow us, join the waitlist,
            or check out the store — your choice.
          </p>
        </div>

        {/* Link buttons */}
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
                  transitionDelay: `${i * 60}ms`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Icon container with gradient */}
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
                  transition: `opacity 0.5s ease ${0.15 + i * 0.08}s, transform 0.5s ease ${0.15 + i * 0.08}s`,
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
                  transition: `opacity 0.5s ease ${0.15 + i * 0.08}s, transform 0.5s ease ${0.15 + i * 0.08}s`,
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
