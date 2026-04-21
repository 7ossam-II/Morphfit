import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { ShoppingBagIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

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

export default function MorphFitNav() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-grey-70">
      {/* Promo bar */}
      <div className="bg-primary text-white text-center text-sm py-2 font-heading font-semibold tracking-wide">
        FREE SHIPPING ON ORDERS OVER $50 — USE CODE: MORPHFIT
      </div>

      {/* Main nav */}
      <nav className="content-container flex items-center justify-between h-16">
        {/* Logo */}
        <LocalizedClientLink
          href="/"
          className="font-heading font-bold text-3xl text-primary tracking-tight cursor-pointer"
        >
          MORPHFIT
        </LocalizedClientLink>

        {/* Desktop mega menu */}
        <div className="hidden small:flex items-center gap-8">
          <div className="group relative h-16 flex items-center">
            <button className="font-heading font-semibold text-foreground uppercase tracking-wide hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Shop by Category
            </button>
            <div className="absolute top-full left-0 mt-0 w-48 bg-surface-raised rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {CATEGORIES.map((cat) => (
                <LocalizedClientLink
                  key={cat.href}
                  href={cat.href}
                  className="block px-4 py-3 text-foreground hover:text-primary hover:bg-grey-70 transition-colors duration-150 cursor-pointer font-sans text-sm"
                >
                  {cat.label}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          <div className="group relative h-16 flex items-center">
            <button className="font-heading font-semibold text-foreground uppercase tracking-wide hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Shop by Goal
            </button>
            <div className="absolute top-full left-0 mt-0 w-48 bg-surface-raised rounded-b-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {GOALS.map((goal) => (
                <LocalizedClientLink
                  key={goal.href}
                  href={goal.href}
                  className="block px-4 py-3 text-foreground hover:text-primary hover:bg-grey-70 transition-colors duration-150 cursor-pointer font-sans text-sm"
                >
                  {goal.label}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          <LocalizedClientLink
            href="/store"
            className="font-heading font-semibold text-foreground uppercase tracking-wide hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        </div>
      </nav>
    </header>
  )
}
