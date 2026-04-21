"use client"

import { useState, useEffect, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { ShoppingBagIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { Suspense } from "react"

const CATEGORIES = [
  { label: "Protein", href: "/categories/protein" },
  { label: "Pre-Workout", href: "/categories/pre-workout" },
  { label: "Vitamins", href: "/categories/vitamins" },
  { label: "Accessories", href: "/categories/accessories" },
]

const GOALS = [
  { label: "Build Muscle", href: "/collections/build-muscle" },
  { label: "Lose Weight", href: "/collections/lose-weight" },
  { label: "Boost Energy", href: "/collections/boost-energy" },
  { label: "Recovery", href: "/collections/recovery" },
]

function DropdownMenu({
  label,
  items,
}: {
  label: string
  items: { label: string; href: string }[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative h-16 flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        aria-haspopup="true"
        aria-expanded={open}
        className="font-heading font-semibold text-foreground uppercase tracking-wide hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-full left-0 w-48 bg-surface-raised rounded-b-lg shadow-lg z-50">
          {items.map((item) => (
            <LocalizedClientLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-foreground hover:text-primary hover:bg-grey-70 transition-colors duration-150 cursor-pointer font-sans text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {item.label}
            </LocalizedClientLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MorphFitNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-grey-70">
      {/* Promo bar */}
      <div className="bg-primary text-white text-center text-sm py-2 font-heading font-semibold tracking-wide">
        FREE SHIPPING ON ORDERS OVER $50 &mdash; USE CODE: MORPHFIT
      </div>

      {/* Main nav */}
      <nav className="content-container flex items-center justify-between h-16">
        {/* Logo */}
        <LocalizedClientLink
          href="/"
          className="font-heading font-bold text-3xl text-primary tracking-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          MORPHFIT
        </LocalizedClientLink>

        {/* Desktop mega menu */}
        <div className="hidden small:flex items-center gap-8">
          <DropdownMenu label="Shop by Category" items={CATEGORIES} />
          <DropdownMenu label="Shop by Goal" items={GOALS} />
          <LocalizedClientLink
            href="/store"
            className="font-heading font-semibold text-foreground uppercase tracking-wide hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
          >
            All Products
          </LocalizedClientLink>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <LocalizedClientLink
            href="/search"
            className="text-foreground hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </LocalizedClientLink>
          <Suspense
            fallback={
              <LocalizedClientLink href="/cart" className="text-foreground cursor-pointer" aria-label="Cart">
                <ShoppingBagIcon className="w-6 h-6" />
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
          {/* Mobile hamburger */}
          <button
            className="small:hidden text-foreground hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="small:hidden bg-surface-raised border-t border-grey-70 px-6 py-4">
          <div className="mb-4">
            <p className="font-heading font-semibold text-primary uppercase tracking-widest text-xs mb-2">
              Shop by Category
            </p>
            {CATEGORIES.map((cat) => (
              <LocalizedClientLink
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors duration-150 cursor-pointer font-sans text-sm"
              >
                {cat.label}
              </LocalizedClientLink>
            ))}
          </div>
          <div className="mb-4">
            <p className="font-heading font-semibold text-primary uppercase tracking-widest text-xs mb-2">
              Shop by Goal
            </p>
            {GOALS.map((goal) => (
              <LocalizedClientLink
                key={goal.href}
                href={goal.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors duration-150 cursor-pointer font-sans text-sm"
              >
                {goal.label}
              </LocalizedClientLink>
            ))}
          </div>
          <LocalizedClientLink
            href="/store"
            onClick={() => setMobileOpen(false)}
            className="block py-2 font-heading font-semibold text-foreground uppercase tracking-wide hover:text-primary transition-colors duration-150 cursor-pointer text-sm"
          >
            All Products
          </LocalizedClientLink>
        </div>
      )}
    </header>
  )
}
