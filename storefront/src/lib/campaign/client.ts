/**
 * Thin client for the MorphFit campaign endpoints exposed by the Medusa
 * backend at:
 *   POST /store/campaign/qr-scan
 *   POST /store/campaign/email-signup
 *   GET  /store/campaign/stats/:id
 *
 * The publishable API key is required by the Medusa /store routes.
 */

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function headers(): HeadersInit {
  const h: HeadersInit = { "Content-Type": "application/json" }
  if (PUBLISHABLE_KEY) {
    ;(h as Record<string, string>)["x-publishable-api-key"] = PUBLISHABLE_KEY
  }
  return h
}

export type CampaignStats = {
  total_scans: number
  unique_devices: number
  last_scan_at: string | null
}

export type GymLocationLite = {
  id: string
  name: string
  city: string
  area: string | null
  sticker_code: string
  is_active: boolean
} | null

export async function fetchCampaignStats(
  gymLocationId: string
): Promise<{ gym_location: GymLocationLite; stats: CampaignStats }> {
  const url = `${BACKEND_URL}/store/campaign/stats/${encodeURIComponent(
    gymLocationId
  )}`

  try {
    const res = await fetch(url, {
      headers: headers(),
      next: { revalidate: 0 },
      cache: "no-store",
    })
    if (!res.ok) {
      throw new Error(`stats request failed (${res.status})`)
    }
    return res.json()
  } catch {
    // Demo-mode fallback so the page still renders if the backend is down.
    return {
      gym_location: null,
      stats: { total_scans: 0, unique_devices: 0, last_scan_at: null },
    }
  }
}

export async function postQrScan(payload: {
  gym_location_id: string
  device_id?: string
  source?: "qr" | "direct" | "share" | "unknown"
}): Promise<void> {
  const url = `${BACKEND_URL}/store/campaign/qr-scan`
  try {
    await fetch(url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        ...payload,
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        referrer:
          typeof document !== "undefined" ? document.referrer : undefined,
      }),
      keepalive: true,
    })
  } catch {
    // Silent: a missed analytics ping must never break UX.
  }
}

export async function postEmailSignup(payload: {
  email: string
  source?: "coming_soon" | "scan" | "other"
  gym_location_id?: string
  qr_scan_id?: string
  consent?: boolean
  locale?: "en" | "bn"
}): Promise<{ ok: boolean; already?: boolean; message?: string }> {
  const url = `${BACKEND_URL}/store/campaign/email-signup`
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    })
    if (res.status === 200 || res.status === 201) {
      const json = await res.json()
      return { ok: true, already: !!json.already }
    }
    const json = await res.json().catch(() => ({}))
    return { ok: false, message: json?.message || "Could not save email." }
  } catch {
    return { ok: false, message: "Network error. Please try again." }
  }
}
