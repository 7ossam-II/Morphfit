import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

/**
 * Top-level launch routes that must NEVER be redirected through the
 * [countryCode] segment. These render globally during the pre-launch sprint.
 */
function isTopLevelLaunchRoute(pathname: string): boolean {
  if (pathname === "/" || pathname === "/coming-soon") return true
  if (pathname === "/scan" || pathname.startsWith("/scan/")) return true
  return false
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    // During the launch sprint we still want top-level routes to render
    // even if the backend is not configured. Returning the empty map
    // lets the middleware short-circuit gracefully.
    return regionMap
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
      }).then(async (response) => {
        const json = await response.json()
        if (!response.ok) {
          throw new Error(json.message)
        }
        return json
      })

      if (regions?.length) {
        regions.forEach((region: HttpTypes.StoreRegion) => {
          region.countries?.forEach((c) => {
            regionMapCache.regionMap.set(c.iso_2 ?? "", region)
          })
        })
        regionMapCache.regionMapUpdated = Date.now()
      }
    } catch {
      // Swallow: top-level routes still work without a backend.
    }
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch {
    return undefined
  }
}

/**
 * Middleware to handle region selection while leaving the launch sprint's
 * top-level routes (/, /coming-soon, /scan/:id) untouched.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  // 1. Static assets — pass-through.
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  // 2. Launch routes — pass-through, never region-prefixed.
  if (isTopLevelLaunchRoute(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()
  const regionMap = await getRegionMap(cacheId)
  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  if (urlHasCountryCode && cacheIdCookie) {
    return NextResponse.next()
  }

  if (urlHasCountryCode && !cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    return response
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  if (!urlHasCountryCode && countryCode) {
    const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    return NextResponse.redirect(redirectUrl, 307)
  }

  // No regions configured AND not a launch route → fall back to /coming-soon.
  return NextResponse.redirect(`${request.nextUrl.origin}/coming-soon`, 307)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
