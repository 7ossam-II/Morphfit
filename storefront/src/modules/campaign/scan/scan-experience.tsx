"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  postQrScan,
  postEmailSignup,
  fetchCampaignStats,
  type CampaignStats,
  type GymLocationLite,
} from "@lib/campaign/client"
import { getOrCreateDeviceId } from "@lib/campaign/device-id"

type Props = {
  gymLocationId: string
  initialGym: GymLocationLite
  initialStats: CampaignStats
}

type SignupState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; already: boolean }
  | { status: "error"; message: string }

const REFRESH_MS = 8000

export default function ScanExperience({
  gymLocationId,
  initialGym,
  initialStats,
}: Props) {
  const [stats, setStats] = useState<CampaignStats>(initialStats)
  const [signup, setSignup] = useState<SignupState>({ status: "idle" })
  const [email, setEmail] = useState("")
  const recordedRef = useRef(false)

  // 1) On mount: record the scan (once per page load).
  useEffect(() => {
    if (recordedRef.current) return
    recordedRef.current = true
    const deviceId = getOrCreateDeviceId()
    postQrScan({
      gym_location_id: gymLocationId,
      device_id: deviceId,
      source: "qr",
    })
  }, [gymLocationId])

  // 2) Light polling so the live counter updates without WebSockets.
  useEffect(() => {
    const id = setInterval(async () => {
      const fresh = await fetchCampaignStats(gymLocationId)
      setStats(fresh.stats)
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [gymLocationId])

  const cityLabel = useMemo(() => {
    if (initialGym?.area && initialGym?.city) {
      return `${initialGym.area}, ${initialGym.city}`
    }
    if (initialGym?.city) return initialGym.city
    return "Bangladesh"
  }, [initialGym])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || signup.status === "submitting") return
    setSignup({ status: "submitting" })
    const result = await postEmailSignup({
      email: email.trim(),
      source: "scan",
      gym_location_id: gymLocationId,
      consent: true,
    })
    if (result.ok) {
      setSignup({ status: "success", already: !!result.already })
      setEmail("")
    } else {
      setSignup({
        status: "error",
        message: result.message || "Something went wrong. Try again.",
      })
    }
  }

  return (
    <div className="relative min-h-[100svh] bg-[#0b1220] text-white overflow-hidden">
      {/* Animated radial gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(249,115,22,0.25) 0%, rgba(11,18,32,0) 70%), radial-gradient(80% 60% at 50% 100%, rgba(34,197,94,0.18) 0%, rgba(11,18,32,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <main className="relative mx-auto max-w-md px-5 pt-10 pb-16 flex flex-col gap-8">
        {/* Brand mark */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary grid place-items-center font-heading font-black text-[#0b1220]">
              M
            </div>
            <span className="font-heading font-bold uppercase tracking-[0.18em] text-sm">
              MorphFit
            </span>
          </div>
          <span className="text-[10px] font-heading uppercase tracking-[0.25em] text-white/50">
            Scan #{initialGym?.sticker_code ?? gymLocationId.slice(0, 6)}
          </span>
        </header>

        {/* Hero */}
        <section className="flex flex-col gap-4">
          <span
            className="self-start inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-heading font-semibold uppercase tracking-[0.22em] text-primary animate-[pulse_2.6s_ease-in-out_infinite]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Live · {cityLabel}
          </span>
          <h1 className="font-heading font-black text-5xl leading-[0.92] uppercase">
            You just <br />
            <span className="text-primary">unlocked</span>
            <br /> the gym.
          </h1>
          <p className="font-sans text-white/70 text-base leading-relaxed">
            MorphFit is the first premium supplement brand built for{" "}
            <span className="text-white font-semibold">Bangladeshi athletes</span>.
            Lab-tested. Locally priced. Delivered to your door before your next
            session.
          </p>
        </section>

        {/* Live stats */}
        <section
          aria-label="Live scan analytics"
          className="grid grid-cols-2 gap-3"
        >
          <StatCard
            label="Total scans"
            value={stats.total_scans}
            accent="primary"
          />
          <StatCard
            label="Unique athletes"
            value={stats.unique_devices}
            accent="cta"
          />
        </section>

        {/* Email capture */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
          <p className="font-heading uppercase tracking-[0.2em] text-xs text-white/60 mb-1">
            Be first in line
          </p>
          <h2 className="font-heading font-bold text-2xl mb-3 leading-tight">
            Get launch-day pricing + free shaker
          </h2>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label htmlFor="scan-email" className="sr-only">
              Email address
            </label>
            <input
              id="scan-email"
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
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-heading font-bold uppercase tracking-wider text-[#0b1220] cursor-pointer hover:bg-orange-400 disabled:opacity-60 disabled:cursor-wait transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]"
            >
              {signup.status === "submitting" ? "Saving…" : "Claim my spot"}
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

            {signup.status === "success" && (
              <p
                role="status"
                className="text-sm text-cta font-semibold"
              >
                {signup.already
                  ? "You’re already on the list. We’ll see you on launch day."
                  : "You’re in. Check your inbox for confirmation."}
              </p>
            )}
            {signup.status === "error" && (
              <p role="alert" className="text-sm text-red-400">
                {signup.message}
              </p>
            )}
            <p className="text-[11px] text-white/40">
              By signing up you agree to receive launch updates from MorphFit.
              We never sell your data.
            </p>
          </form>
        </section>

        {/* Trust strip */}
        <section
          aria-label="Why MorphFit"
          className="grid grid-cols-3 gap-2 text-center"
        >
          <TrustPill title="Lab tested" subtitle="3rd-party COA" />
          <TrustPill title="৳ in BDT" subtitle="No hidden FX" />
          <TrustPill title="48h ship" subtitle="Dhaka & CTG" />
        </section>

        <footer className="text-center text-[11px] uppercase tracking-[0.25em] text-white/35 font-heading">
          MorphFit · Built in Dhaka
        </footer>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: "primary" | "cta"
}) {
  const color = accent === "primary" ? "text-primary" : "text-cta"
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-heading uppercase tracking-[0.18em] text-[10px] text-white/50">
        {label}
      </p>
      <p
        className={`font-heading font-black text-4xl leading-none mt-2 tabular-nums ${color}`}
      >
        {Intl.NumberFormat("en-US").format(value)}
      </p>
    </div>
  )
}

function TrustPill({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] py-3 px-1">
      <p className="font-heading font-bold text-xs uppercase tracking-wider text-white">
        {title}
      </p>
      <p className="text-[10px] text-white/50 mt-0.5">{subtitle}</p>
    </div>
  )
}
