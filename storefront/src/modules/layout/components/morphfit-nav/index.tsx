"use client"
import { useState, useRef, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { ShoppingBagIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Suspense } from "react"

const CATEGORIES = [
  { label: "Protein", href: "/categories/protein", desc: "Whey, Casein, Plant" },
  { label: "Pre-Workout", href: "/categories/pre-workout", desc: "Energy, Focus, Pump" },
  { label: "Vitamins", href: "/categories/vitamins", desc: "Health & Immunity" },
  { label: "Accessories", href: "/categories/accessories", desc: "Gear & Apparel" },
]
const GOALS = [
  { label: "Build Muscle", href: "/collections/build-muscle", desc: "Mass & Strength" },
  { label: "Lose Weight", href: "/collections/lose-weight", desc: "Cut & Lean" },
  { label: "Boost Energy", href: "/collections/boost-energy", desc: "Performance" },
  { label: "Recovery", href: "/collections/recovery", desc: "Rest & Repair" },
]

function MegaMenu({ label, items }: { label: string; items: { label: string; href: string; desc: string }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        className="flex items-center gap-1 font-heading font-bold text-white/80 uppercase tracking-wider text-sm hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a2332] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          <div className="p-2">
            {items.map((item) => (
              <LocalizedClientLink
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors duration-150 cursor-pointer group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                <div>
                  <p className="font-heading font-bold text-white text-sm uppercase tracking-wide">{item.label}</p>
                  <p className="font-sans text-white/40 text-xs mt-0.5">{item.desc}</p>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
          <div className="border-t border-white/10 px-4 py-2.5">
            <LocalizedClientLink
              href="/store"
              onClick={() => setOpen(false)}
              className="font-heading font-bold text-primary text-xs uppercase tracking-wider hover:underline cursor-pointer"
            >
              View All &rarr;
            </LocalizedClientLink>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MorphFitNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10) }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0f1923]/95 backdrop-blur-md shadow-lg shadow-black/30" : "bg-[#0f1923]"} border-b border-white/10`}>
      {/* Announcement bar */}
      <div className="bg-primary text-white text-center py-2 px-4">
        <p className="font-heading font-semibold uppercase tracking-[0.15em] text-xs">
          Free Shipping on Orders Over $50 &mdash; Use Code: <span className="font-bold underline">MORPHFIT</span>
        </p>
      </div>

      {/* Main nav */}
      <nav className="content-container flex items-center justify-between h-16">
        {/* Logo */}
        <LocalizedClientLink
          href="/"
          className="font-heading font-black text-2xl text-primary uppercase tracking-tight hover:opacity-90 transition-opacity duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          MORPHFIT
        </LocalizedClientLink>

        {/* Desktop nav links */}
        <div className="hidden small:flex items-center gap-6">
          <MegaMenu label="Shop by Category" items={CATEGORIES} />
          <MegaMenu label="Shop by Goal" items={GOALS} />
          <LocalizedClientLink
            href="/store"
            className="font-heading font-bold text-white/80 uppercase tracking-wider text-sm hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-2"
          >
            All Products
          </LocalizedClientLink>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <LocalizedClientLink
            href="/search"
            className="text-white/70 hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1.5"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </LocalizedClientLink>
          <Suspense
            fallback={
              <LocalizedClientLink href="/cart" className="text-white/70 cursor-pointer p-1.5" aria-label="Cart">
                <ShoppingBagIcon className="w-5 h-5" />
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
          <button
            className="small:hidden text-white/70 hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1.5"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="small:hidden bg-[#1a2332] border-t border-white/10">
          <div className="content-container py-4 space-y-4">
            <div>
              <p className="font-heading font-bold text-primary uppercase tracking-[0.2em] text-xs mb-2">Shop by Category</p>
              {CATEGORIES.map((cat) => (
                <LocalizedClientLink
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 font-heading font-semibold text-white/80 hover:text-primary transition-colors duration-150 cursor-pointer text-sm uppercase tracking-wide"
                >
                  {cat.label}
                </LocalizedClientLink>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="font-heading font-bold text-primary uppercase tracking-[0.2em] text-xs mb-2">Shop by Goal</p>
              {GOALS.map((goal) => (
                <LocalizedClientLink
                  key={goal.href}
                  href={goal.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 font-heading font-semibold text-white/80 hover:text-primary transition-colors duration-150 cursor-pointer text-sm uppercase tracking-wide"
                >
                  {goal.label}
                </LocalizedClientLink>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4">
              <LocalizedClientLink
                href="/store"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-heading font-bold text-white uppercase tracking-wide hover:text-primary transition-colors duration-150 cursor-pointer text-sm"
              >
                All Products
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
