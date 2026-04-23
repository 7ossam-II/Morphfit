import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="bg-[#0f1923] border-t border-white/10">
      {/* Main footer content */}
      <div className="content-container py-16">
        <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="large:col-span-1">
            <p className="font-heading font-black text-2xl text-primary uppercase tracking-tight mb-4">
              MORPHFIT
            </p>
            <p className="font-sans text-white/50 text-sm leading-relaxed mb-6">
              Premium supplements, vitamins, and workout gear for athletes who demand the best.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "Twitter/X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase tracking-wider text-sm mb-5">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/store" },
                { label: "Protein", href: "/categories/protein" },
                { label: "Pre-Workout", href: "/categories/pre-workout" },
                { label: "Vitamins", href: "/categories/vitamins" },
                { label: "Accessories", href: "/categories/accessories" },
              ].map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="font-sans text-white/50 text-sm hover:text-primary transition-colors duration-150 cursor-pointer"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Goals column */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase tracking-wider text-sm mb-5">By Goal</h3>
            <ul className="space-y-3">
              {[
                { label: "Build Muscle", href: "/collections/build-muscle" },
                { label: "Lose Weight", href: "/collections/lose-weight" },
                { label: "Boost Energy", href: "/collections/boost-energy" },
                { label: "Recovery", href: "/collections/recovery" },
              ].map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="font-sans text-white/50 text-sm hover:text-primary transition-colors duration-150 cursor-pointer"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className="font-heading font-bold text-white uppercase tracking-wider text-sm mb-5">Support</h3>
            <ul className="space-y-3">
              {[
                { label: "My Account", href: "/account" },
                { label: "Track Order", href: "/account/orders" },
                { label: "Returns & Exchanges", href: "#" },
                { label: "FAQ", href: "#" },
                { label: "Contact Us", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <LocalizedClientLink
                    href={link.href}
                    className="font-sans text-white/50 text-sm hover:text-primary transition-colors duration-150 cursor-pointer"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="content-container py-5 flex flex-col small:flex-row items-center justify-between gap-3">
          <p className="font-sans text-white/30 text-xs">
            &copy; {new Date().getFullYear()} MorphFit. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-sans text-white/30 text-xs hover:text-white/60 transition-colors duration-150 cursor-pointer"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
