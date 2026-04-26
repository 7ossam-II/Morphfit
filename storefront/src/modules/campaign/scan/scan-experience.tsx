"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { postQrScan, type GymLocationLite } from "@lib/campaign/client"
import { getOrCreateDeviceId } from "@lib/campaign/device-id"

type Props = {
  gymLocationId: string
  initialGym: GymLocationLite
}

const INSTAGRAM_URL =
  "https://www.instagram.com/morphfit_bangladesh?igsh=MXhpYndqcHprbG9nZQ%3D%3D&utm_source=qr"
const FACEBOOK_URL =
  "https://www.facebook.com/share/1W8N2bz7tF/?mibextid=wwXIfr"
const WEBSITE_URL = "/coming-soon"

const PRODUCTS = [
  { src: "/products/whey.png",          alt: "Gold Standard Whey" },
  { src: "/products/c4.png",            alt: "C4 Original Pre-Workout" },
  { src: "/products/creatine_caps.png", alt: "Microionized Creatine" },
  { src: "/products/gold_creatine.png", alt: "Gold Creatine" },
  { src: "/products/tota_war.png",      alt: "Tota War Pre-Workout" },
  { src: "/products/magnesium.png",     alt: "Glycinate Magnesium" },
  { src: "/products/multivitamin.png",  alt: "One Daily Multivitamin" },
]

export default function ScanExperience({ gymLocationId, initialGym }: Props) {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Track scan on mount
  useEffect(() => {
    const deviceId = getOrCreateDeviceId()
    postQrScan({ gymLocationId, deviceId }).catch(() => {})
  }, [gymLocationId])

  const goTo = (idx: number, dir: "left" | "right") => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 320)
  }

  const next = () => goTo((active + 1) % PRODUCTS.length, "right")
  const prev = () => goTo((active - 1 + PRODUCTS.length) % PRODUCTS.length, "left")

  useEffect(() => {
    intervalRef.current = setInterval(next, 3500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [active, animating])

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(next, 3500)
  }

  const gymName = initialGym?.name ?? "Your Gym"
  const city = initialGym?.city ?? "Bangladesh"

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(180deg, #081f14 0%, #0d3b28 35%, #0a2e1f 70%, #081f14 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowX: "hidden",
      position: "relative",
    }}>

      {/* ── LOGO ── */}
      <div style={{ paddingTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", zIndex: 10 }}>
        <svg width="48" height="40" viewBox="0 0 52 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 44V0L13 0L26 22L39 0L52 0V44H40V18L26 40L12 18V44H0Z" fill="white"/>
        </svg>
        <span style={{ color: "white", fontSize: "12px", fontWeight: 900, letterSpacing: "0.38em", fontFamily: "'Arial Black', Arial, sans-serif" }}>
          MORPHFIT
        </span>
      </div>

      {/* ── GYM BADGE ── */}
      <div style={{
        marginTop: "14px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "100px",
        padding: "6px 16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        zIndex: 10,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }} />
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", fontFamily: "Arial, sans-serif" }}>
          {gymName}
        </span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontFamily: "Arial, sans-serif" }}>
          {city}
        </span>
      </div>

      {/* ── HERO: 4x MORPHFIT text + floating product ── */}
      <div style={{ position: "relative", width: "100%", marginTop: "28px" }}>

        {/* 4 rows of giant text */}
        <div style={{ userSelect: "none", pointerEvents: "none", lineHeight: 0.88, overflow: "hidden" }}>
          {["MORPHFIT", "MORPHFIT", "MORPHFIT", "MORPHFIT"].map((word, i) => (
            <div key={i} style={{
              width: "100%",
              textAlign: "center",
              fontSize: "clamp(56px, 19.5vw, 96px)",
              fontWeight: 900,
              color: (i === 1 || i === 2) ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.06)",
              letterSpacing: "-0.02em",
              fontFamily: "'Arial Black', Impact, sans-serif",
              whiteSpace: "nowrap",
            }}>
              {word}
            </div>
          ))}
        </div>

        {/* Product floating over text */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(68vw, 280px)",
          height: "min(68vw, 280px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}>
          {/* Red circle glow — poster style */}
          <div style={{
            position: "absolute",
            width: "min(54vw, 220px)",
            height: "min(54vw, 220px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(210,30,30,0.6) 0%, rgba(180,20,20,0.28) 55%, transparent 100%)",
            filter: "blur(2px)",
          }} />

          {/* Product image */}
          <div
            key={active}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: animating
                ? `slideIn${direction === "right" ? "Right" : "Left"} 0.32s ease forwards`
                : "floatProduct 3.5s ease-in-out infinite",
              filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.75))",
            }}
          >
            <Image
              src={PRODUCTS[active].src}
              alt={PRODUCTS[active].alt}
              width={260}
              height={260}
              style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* ── CAROUSEL CONTROLS ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginTop: "20px",
        zIndex: 30,
      }}>
        <button
          onClick={() => { prev(); resetTimer() }}
          aria-label="Previous product"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >‹</button>

        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i, i > active ? "right" : "left"); resetTimer() }}
              aria-label={`Go to product ${i + 1}`}
              style={{
                width: i === active ? 18 : 5,
                height: 5,
                borderRadius: 3,
                background: i === active ? "#cc2020" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => { next(); resetTimer() }}
          aria-label="Next product"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >›</button>
      </div>

      {/* ── SOCIAL LINKS ── */}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "36px 22px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "11px",
        zIndex: 10,
      }}>
        {/* Instagram */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "13px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "14px",
            textDecoration: "none",
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
            background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: "13px", fontFamily: "Arial, sans-serif", letterSpacing: "0.04em" }}>FOLLOW ON INSTAGRAM</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "Arial, sans-serif", marginTop: "2px" }}>@morphfit.bd</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>

        {/* Facebook */}
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "13px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "14px",
            textDecoration: "none",
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
            background: "#1877F2",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: "13px", fontFamily: "Arial, sans-serif", letterSpacing: "0.04em" }}>LIKE ON FACEBOOK</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "Arial, sans-serif", marginTop: "2px" }}>MorphFit BD</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>

        {/* Website */}
        <Link
          href={WEBSITE_URL}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "13px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "14px",
            textDecoration: "none",
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
            background: "#0d3b28",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="17" viewBox="0 0 52 44" fill="white">
              <path d="M0 44V0L13 0L26 22L39 0L52 0V44H40V18L26 40L12 18V44H0Z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: "13px", fontFamily: "Arial, sans-serif", letterSpacing: "0.04em" }}>VISIT OUR WEBSITE</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "Arial, sans-serif", marginTop: "2px" }}>morphfit.com.bd</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        paddingBottom: "28px",
        color: "rgba(255,255,255,0.18)",
        fontSize: "9px",
        letterSpacing: "0.18em",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}>
        © MORPHFIT · DHAKA, BANGLADESH
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatProduct {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-14px) scale(1.025); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(70px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-70px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
