"use client"

const KEY = "morphfit_device_id"

/**
 * Returns a stable, anonymous device id stored in localStorage. Used by the
 * Mobile Tracking Page to count unique scanners without using cookies.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return ""
  try {
    const existing = window.localStorage.getItem(KEY)
    if (existing) return existing
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
    window.localStorage.setItem(KEY, id)
    return id
  } catch {
    return ""
  }
}
