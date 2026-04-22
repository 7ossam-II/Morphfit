import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FOOTER_LINKS = {
  Shop: [
    { label: "Protein", href: "/categories/protein" },
    { label: "Pre-Workout", href: "/categories/pre-workout" },
    { label: "Vitamins", href: "/categories/vitamins" },
    { label: "All Products", href: "/store" },
  ],
  Goals: [
    { label: "Build Muscle", href: "/collections/build-muscle" },
    { label: "Lose Weight", href: "/collections/lose-weight" },
    { label: "Boost Energy", href: "/collections/boost-energy" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-grey-70 mt-16">
      <div className="content-container py-16">
        <div className="grid grid-cols-2 small:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 small:col-span-1">
            <LocalizedClientLink
              href="/"
              className="font-heading font-bold text-3xl text-primary tracking-tight cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
            >
              MORPHFIT
            </LocalizedClientLink>
            <p className="mt-4 text-grey-30 text-sm font-sans leading-relaxed">
              Premium supplements and workout gear to fuel your transformation.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-heading font-semibold text-foreground uppercase tracking-widest text-xs mb-4">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink
                      href={link.href}
                      className="text-grey-30 hover:text-primary transition-colors duration-200 text-sm font-sans cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-grey-70 flex flex-col small:flex-row items-center justify-between gap-4">
          <p className="text-grey-30 text-sm font-sans">
            &copy; {new Date().getFullYear()} MorphFit. All rights reserved.
          </p>
          <div className="flex gap-6">
            <LocalizedClientLink
              href="/privacy"
              className="text-grey-30 hover:text-primary text-sm transition-colors duration-200 cursor-pointer font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
            >
              Privacy Policy
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/terms"
              className="text-grey-30 hover:text-primary text-sm transition-colors duration-200 cursor-pointer font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
            >
              Terms of Service
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
