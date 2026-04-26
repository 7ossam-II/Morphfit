"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { postEmailSignup } from "@lib/campaign/client"

type Props = {
  launchAtIso: string
}

type SignupState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; already: boolean }
  | { status: "error"; message: string }

// ─── Typewriter config ───────────────────────────────────────────────────────
// Sequence: type "MORPHFIT" → pause → delete char by char → type "MORPHFIT?"
// → pause → delete → type "MORPHFIT!" → pause → delete → type "MORPHFIT."
// → pause → reveal email section
const BASE = "MORPHFIT"
const VARIANTS = ["MORPHFIT", "MORPHFIT?", "MORPHFIT!", "MORPHFIT."]
const TYPE_SPEED = 90   // ms per character typed
const DELETE_SPEED = 55 // ms per character deleted
const PAUSE_FULL = 1100 // ms to pause when word is fully typed
const PAUSE_EMPTY = 220 // ms to pause when fully deleted before next word

// ─── Countdown helper ────────────────────────────────────────────────────────
function diffParts(target: number, now: number) {
  const total = Math.max(0, Math.floor((target - now) / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return { days, hours, minutes, seconds, isLive: total === 0 }
}

export default function ComingSoonExperience({ launchAtIso }: Props) {
  const target = useMemo(() => new Date(launchAtIso).getTime(), [launchAtIso])
  const [now, setNow] = useState<number>(() => Date.now())
  const [email, setEmail] = useState("")
  const [signup, setSignup] = useState<SignupState>({ status: "idle" })

  // Typewriter state
  const [displayed, setDisplayed] = useState("")
  const [showEmail, setShowEmail] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Countdown tick
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Typewriter engine
  useEffect(() => {
    let cancelled = false
    let variantIdx = 0
    let charIdx = 0
    let deleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    function tick() {
      if (cancelled) return
      const word = VARIANTS[variantIdx]

      if (!deleting) {
        // Typing forward
        charIdx++
        setDisplayed(word.slice(0, charIdx))

        if (charIdx === word.length) {
          // Fully typed — check if last variant
          if (variantIdx === VARIANTS.length - 1) {
            // Final word "MORPHFIT." — stay, then reveal email
            timeoutId = setTimeout(() => {
              if (!cancelled) setShowEmail(true)
            }, PAUSE_FULL)
            return
          }
          // Pause then start deleting
          deleting = true
          timeoutId = setTimeout(tick, PAUSE_FULL)
        } else {
          timeoutId = setTimeout(tick, TYPE_SPEED)
        }
      } else {
        // Deleting
        charIdx--
        setDisplayed(word.slice(0, charIdx))

        if (charIdx === 0) {
          // Fully deleted — move to next variant
          deleting = false
          variantIdx++
          timeoutId = setTimeout(tick, PAUSE_EMPTY)
        } else {
          timeoutId = setTimeout(tick, DELETE_SPEED)
        }
      }
    }

    // Small initial delay before starting
    timeoutId = setTimeout(tick, 600)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  const t = diffParts(target, now)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || signup.status === "submitting") return
    setSignup({ status: "submitting" })
    const res = await postEmailSignup({
      email: email.trim(),
      source: "coming_soon",
      consent: true,
    })
    if (res.ok) {
      setSignup({ status: "success", already: !!res.already })
      setEmail("")
    } else {
      setSignup({
        status: "error",
        message: res.message || "Something went wrong. Try again.",
      })
    }
  }

  // Derive the suffix (punctuation) from displayed text for coloring
  const basePart = displayed.slice(0, BASE.length)
  const suffixPart = displayed.slice(BASE.length)

  return (
    <div
      className="relative min-h-[100svh] text-white overflow-hidden flex flex-col"
      style={{ background: "#0d3b28" }}
    >
      {/* ── Background: subtle radial red glow + noise texture ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(65% 55% at 50% 38%, rgba(200,30,30,0.28) 0%, transparent 70%), radial-gradient(80% 60% at 50% 100%, rgba(10,50,25,0.9) 0%, transparent 80%)",
        }}
      />
      {/* Faint grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-7 pb-4">
        <div className="flex items-center gap-2.5">
          {/* M logo mark */}
          <div
            className="w-9 h-9 rounded-md grid place-items-center font-black text-white text-lg"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <svg width="20" height="17" viewBox="0 0 52 44" fill="white">
              <path d="M0 44V0L13 0L26 22L39 0L52 0V44H40V18L26 40L12 18V44H0Z" />
            </svg>
          </div>
          <span
            className="font-black uppercase tracking-[0.22em] text-sm text-white"
            style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
          >
            MORPHFIT
          </span>
        </div>
        <span
          className="text-[10px] sm:text-xs uppercase tracking-[0.25em]"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Arial, sans-serif" }}
        >
          Made in Bangladesh
        </span>
      </header>

      {/* ── Main hero ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-10 gap-0">

        {/* Launching Soon badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
          style={{
            border: "1px solid rgba(42,160,70,0.5)",
            background: "rgba(42,160,70,0.12)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#2aa046" }}
          />
          <span
            className="text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "#2aa046", fontFamily: "Arial, sans-serif" }}
          >
            Launching Soon
          </span>
        </div>

        {/* ── TYPEWRITER HEADLINE ── */}
        <div
          className="text-center select-none"
          style={{ minHeight: "clamp(80px, 18vw, 160px)" }}
        >
          <h1
            className="font-black uppercase leading-none tracking-tight"
            style={{
              fontFamily: "Arial Black, Impact, Arial, sans-serif",
              fontSize: "clamp(52px, 13vw, 130px)",
              letterSpacing: "-0.01em",
            }}
          >
            {/* Base MORPHFIT letters */}
            <span style={{ color: "#ffffff" }}>{basePart}</span>
            {/* Suffix punctuation in red */}
            <span style={{ color: "#c81e1e" }}>{suffixPart}</span>
            {/* Blinking cursor */}
            <span
              style={{
                display: "inline-block",
                width: "clamp(3px, 0.7vw, 7px)",
                height: "0.85em",
                background: "#2aa046",
                marginLeft: "4px",
                verticalAlign: "middle",
                borderRadius: "2px",
                opacity: cursorVisible ? 1 : 0,
                transition: "opacity 0.08s",
              }}
            />
          </h1>
        </div>

        {/* ── Email section — fades in after typewriter finishes ── */}
        <div
          className="w-full max-w-md mt-10 flex flex-col items-center gap-4"
          style={{
            opacity: showEmail ? 1 : 0,
            transform: showEmail ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            pointerEvents: showEmail ? "auto" : "none",
          }}
        >
          {/* Email input + button */}
          <form
            onSubmit={onSubmit}
            className="w-full flex flex-col sm:flex-row gap-3"
          >
            <label htmlFor="cs-email" className="sr-only">
              Email address
            </label>
            <input
              id="cs-email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-white/35 focus:outline-none transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(42,160,70,0.8)"
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(42,160,70,0.2)"
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)"
                e.currentTarget.style.boxShadow = "none"
              }}
            />
            <button
              type="submit"
              disabled={signup.status === "submitting"}
              className="rounded-xl px-6 py-3.5 font-black uppercase tracking-widest text-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait transition-all duration-200"
              style={{
                background: "#2aa046",
                color: "#ffffff",
                fontFamily: "Arial Black, Arial, sans-serif",
                letterSpacing: "0.1em",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#34c957" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#2aa046" }}
            >
              {signup.status === "submitting" ? "Saving…" : "Notify Me"}
            </button>
          </form>

          {/* Feedback messages */}
          <div className="min-h-[20px] text-center">
            {signup.status === "success" && (
              <p
                role="status"
                className="text-sm font-semibold"
                style={{ color: "#2aa046" }}
              >
                {signup.already
                  ? "You're already on the list. See you on launch day."
                  : "You're in. Watch your inbox."}
              </p>
            )}
            {signup.status === "error" && (
              <p role="alert" className="text-sm" style={{ color: "#f87171" }}>
                {signup.message}
              </p>
            )}
          </div>

          {/* Tagline */}
          <p
            className="text-center text-sm sm:text-base"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "Arial, sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            Don't miss the revolution —{" "}
            <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>
              be the first to know.
            </span>
          </p>
        </div>

        {/* ── Countdown ── */}
        <div
          className="w-full max-w-md mt-10"
          style={{
            opacity: showEmail ? 1 : 0,
            transition: "opacity 0.9s ease 0.3s",
          }}
        >
          <p
            className="text-center uppercase tracking-[0.22em] text-xs mb-4"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Arial, sans-serif" }}
          >
            {t.isLive ? "We are live" : "Launch in"}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <CountdownCell value={t.days} label="Days" />
            <CountdownCell value={t.hours} label="Hours" />
            <CountdownCell value={t.minutes} label="Minutes" />
            <CountdownCell value={t.seconds} label="Seconds" />
          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 text-center pb-7 pt-4 text-[11px] uppercase tracking-[0.25em]"
        style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Arial, sans-serif" }}
      >
        © MorphFit · Dhaka, Bangladesh
      </footer>

      {/* Cursor blink keyframe (fallback) */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}

// ─── Countdown cell ──────────────────────────────────────────────────────────
function CountdownCell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0")
  return (
    <div
      className="rounded-xl py-3 sm:py-4 text-center"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p
        className="font-black text-3xl sm:text-4xl tabular-nums leading-none"
        style={{ color: "#2aa046", fontFamily: "Arial Black, Arial, sans-serif" }}
      >
        {padded}
      </p>
      <p
        className="mt-1 uppercase tracking-[0.18em] text-[10px] sm:text-xs"
        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Arial, sans-serif" }}
      >
        {label}
      </p>
    </div>
  )
}
