"use client"

import { useEffect, useMemo, useState } from "react"
import { postEmailSignup } from "@lib/campaign/client"

type Props = {
  /** ISO timestamp the launch countdown ticks down to. */
  launchAtIso: string
}

type SignupState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; already: boolean }
  | { status: "error"; message: string }

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

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
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

  return (
    <div className="relative min-h-[100svh] bg-[#0b1220] text-white overflow-hidden">
      {/* Layered background: orange top glow + green bottom glow + grid */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(70% 55% at 20% 0%, rgba(249,115,22,0.30) 0%, rgba(11,18,32,0) 60%), radial-gradient(60% 50% at 80% 100%, rgba(34,197,94,0.20) 0%, rgba(11,18,32,0) 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14 flex flex-col gap-10 min-h-[100svh]">
        {/* Brand row */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-primary grid place-items-center font-heading font-black text-[#0b1220]">
              M
            </div>
            <span className="font-heading font-bold uppercase tracking-[0.2em]">
              MorphFit
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-heading uppercase tracking-[0.25em] text-white/55">
            Made in Bangladesh
          </span>
        </header>

        {/* Hero */}
        <section className="flex flex-col gap-5 sm:gap-6">
          <span className="self-start inline-flex items-center gap-2 rounded-full border border-cta/40 bg-cta/10 px-3 py-1.5 text-[11px] font-heading font-semibold uppercase tracking-[0.22em] text-cta">
            <span className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
            Launching Soon
          </span>
          <h1 className="font-heading font-black uppercase leading-[0.92] text-5xl sm:text-7xl">
            Premium <span className="text-primary">supplements</span>,
            <br className="hidden sm:block" /> built for{" "}
            <span className="text-cta">Bangladesh</span>.
          </h1>
          <p className="font-sans text-white/70 text-base sm:text-lg max-w-xl leading-relaxed">
            Lab-tested whey, creatine, and pre-workout — priced in taka,
            delivered in 48 hours from Dhaka and Chattogram. No more paying
            triple for imported tubs.
          </p>
        </section>

        {/* Countdown */}
        <section
          aria-label="Launch countdown"
          className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-7"
        >
          <p className="font-heading uppercase tracking-[0.22em] text-xs text-white/55 mb-4">
            {t.isLive ? "We are live" : "Launch in"}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <CountdownCell value={t.days} label="Days" />
            <CountdownCell value={t.hours} label="Hours" />
            <CountdownCell value={t.minutes} label="Minutes" />
            <CountdownCell value={t.seconds} label="Seconds" />
          </div>
        </section>

        {/* Email capture */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-7">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl uppercase mb-2">
            Get launch-day pricing
          </h2>
          <p className="text-white/65 text-sm sm:text-base mb-4">
            Drop your email — we'll send a one-time 20% off code the moment we
            open the store. No spam, ever.
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row gap-3"
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
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#0b1220] border border-white/15 px-4 py-3 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={signup.status === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-heading font-bold uppercase tracking-wider text-[#0b1220] cursor-pointer hover:bg-orange-400 disabled:opacity-60 disabled:cursor-wait transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]"
            >
              {signup.status === "submitting" ? "Saving…" : "Notify me"}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </form>

          <div className="mt-3 min-h-[20px]">
            {signup.status === "success" && (
              <p role="status" className="text-sm text-cta font-semibold">
                {signup.already
                  ? "You’re already on the list. We’ll see you on launch day."
                  : "You’re in. Watch your inbox for confirmation."}
              </p>
            )}
            {signup.status === "error" && (
              <p role="alert" className="text-sm text-red-400">
                {signup.message}
              </p>
            )}
          </div>
        </section>

        {/* Trust strip */}
        <section
          aria-label="Why MorphFit"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <Trust title="Lab tested" subtitle="3rd-party COA on every batch" />
          <Trust title="৳ in BDT" subtitle="No hidden FX charges" />
          <Trust title="48h ship" subtitle="Dhaka & Chattogram" />
          <Trust title="Athlete owned" subtitle="Built by lifters, for lifters" />
        </section>

        <footer className="mt-auto pt-6 text-center text-[11px] uppercase tracking-[0.25em] text-white/35 font-heading">
          © MorphFit · Built in Dhaka
        </footer>
      </div>
    </div>
  )
}

function CountdownCell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0")
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b1220]/80 px-2 py-3 sm:py-4 text-center">
      <p className="font-heading font-black text-3xl sm:text-5xl text-primary tabular-nums leading-none">
        {padded}
      </p>
      <p className="mt-1 font-heading uppercase tracking-[0.2em] text-[10px] sm:text-xs text-white/55">
        {label}
      </p>
    </div>
  )
}

function Trust({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] py-3 px-3">
      <p className="font-heading font-bold text-sm uppercase tracking-wider text-white">
        {title}
      </p>
      <p className="text-[11px] text-white/55 mt-0.5 leading-snug">
        {subtitle}
      </p>
    </div>
  )
}
