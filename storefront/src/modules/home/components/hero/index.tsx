import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  return (
    <section className="relative bg-surface overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-grey-90 via-background to-grey-80" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #F97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #22C55E 0%, transparent 40%)",
        }}
      />

      <div className="relative content-container py-24 small:py-32 flex flex-col small:flex-row items-center gap-12">
        {/* Text block */}
        <div className="flex-1 text-center small:text-left">
          <p className="font-heading font-semibold text-primary uppercase tracking-widest text-sm mb-4">
            Fuel Your Transformation
          </p>
          <h1 className="font-heading font-bold text-5xl small:text-7xl text-foreground leading-none uppercase mb-6">
            BUILD THE
            <br />
            <span className="text-primary">BODY</span> YOU
            <br />
            DESERVE
          </h1>
          <p className="font-sans text-grey-40 text-lg mb-8 max-w-md mx-auto small:mx-0">
            Premium supplements, vitamins, and workout gear — everything you
            need to reach your peak performance.
          </p>
          <div className="flex flex-col xsmall:flex-row gap-4 justify-center small:justify-start">
            <LocalizedClientLink
              href="/store"
              className="inline-block bg-cta text-white font-heading font-semibold uppercase tracking-wide px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Shop Now
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/protein"
              className="inline-block border-2 border-primary text-primary font-heading font-semibold uppercase tracking-wide px-8 py-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Best Sellers
            </LocalizedClientLink>
          </div>
        </div>

        {/* Stats grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 max-w-sm w-full">
          {[
            { value: "500+", label: "Products" },
            { value: "50K+", label: "Happy Athletes" },
            { value: "100%", label: "Lab Tested" },
            { value: "Free", label: "Shipping $50+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-raised rounded-xl p-6 text-center border border-grey-70"
            >
              <div className="font-heading font-bold text-4xl text-primary">
                {stat.value}
              </div>
              <div className="font-sans text-grey-40 text-sm mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
