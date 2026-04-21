import { Link } from "wouter";
import { ArrowUpRight, Clock3, MapPin, UtensilsCrossed } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { Button } from "@/components/ui/button";
import { BUFFET_PACKAGES } from "@/content/catering";
import { getFeaturedMenuPicks } from "@/content/menu";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  SITE_IMAGES,
} from "@/content/site";
import { restaurantStructuredData, useSeo } from "@/lib/seo";

const featuredPackages = BUFFET_PACKAGES.slice(0, 3);

const categoryOffers = [
  {
    key: "catering",
    title: "Office catering",
    description:
      "Buffets, trays, and platters sized for Mississauga teams — Skymark Ave and Pearson-area meetings.",
    href: "/catering",
    image: SITE_IMAGES.greekSaladTray,
    imageAlt:
      "Catering salad and tray spread prepared at Skymark Eatery by Caffe E Pranzo",
    emphasis: true,
  },
  {
    key: "breakfast",
    title: "Breakfast counter",
    description: "Pastries, bagels, and hot breakfast sandwiches for the first meetings of the day.",
    href: "/menu#breakfast",
    image: SITE_IMAGES.focaccia,
    imageAlt: "Focaccia and baked goods from the Skymark Eatery counter",
    emphasis: false,
  },
  {
    key: "lunch",
    title: "Sandwiches & salads",
    description: "Hot sandwiches and salads built for a fast pickup window.",
    href: "/menu#sandwiches",
    image: SITE_IMAGES.saladSandwich,
    imageAlt: "Salad and sandwich lunch from Skymark Eatery",
    emphasis: false,
  },
  {
    key: "pasta",
    title: "Pasta & pizza",
    description: "Comfort plates and party-size pies when the team is ordering together.",
    href: "/menu#pasta",
    image: SITE_IMAGES.hotTable,
    imageAlt: "Hot lunch line at Skymark Eatery",
    emphasis: false,
  },
] as const;

export default function Home() {
  useSeo({
    title:
      "Skymark Eatery by Caffe E Pranzo | Italian Takeout & Catering — Mississauga (Skymark Ave)",
    description:
      "Skymark Eatery by Caffe E Pranzo: weekday Italian breakfast and lunch, takeout, and office catering on Skymark Ave, Mississauga — near Pearson Airport. Order pickup, browse the menu, or plan trays and buffets.",
    path: "/",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
    structuredData: restaurantStructuredData(),
  });

  const signaturePicks = getFeaturedMenuPicks(4);

  return (
    <Layout>
      <Hero
        eyebrow="Modern Italian · Mississauga weekday lunch"
        title={`${BUSINESS_INFO.secondaryName} — fast pickup, real catering`}
        subtitle="Italian breakfast and lunch on Skymark Ave: sharp flavours, dependable timing, and portions that make sense for offices near Pearson and across western Mississauga."
        imageSrc={SITE_IMAGES.hero}
        imageAlt="Daily lunch favourites prepared at Skymark Eatery by Caffe E Pranzo"
        primaryCta={{ label: "Order pickup", href: "/menu" }}
        secondaryCta={{ label: "Catering packages", href: "/catering" }}
        infoLine={
          <p>
            <a
              href={BUSINESS_INFO.phoneHref}
              className="font-semibold text-[hsl(var(--foreground))] underline decoration-[hsl(var(--primary))]/35 decoration-2 underline-offset-2 hover:text-[hsl(var(--primary))]"
            >
              {BUSINESS_INFO.phone}
            </a>
            <span className="mx-2 text-[hsl(var(--muted-foreground))]/50">·</span>
            <span>{BUSINESS_INFO.hoursLabel}</span>
          </p>
        }
      />

      <Section
        tone="light"
        density="default"
        withMotion
        className="border-b border-[hsla(220,14%,12%,0.06)]"
      >
        <div>
          <p className="section-kicker">What we do best</p>
          <h2 className="brand-rail-muted mt-3 max-w-2xl text-[hsl(var(--foreground))]">
            Weekday Italian for the office rhythm — pickup when it&apos;s one, trays when it&apos;s everyone.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
            Same kitchen for the line and the boardroom. Start with the lane you need — everything links to the full menu or catering detail.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {categoryOffers.map((block) => (
              <a
                key={block.key}
                href={block.href}
                className={`group overflow-hidden rounded-md border bg-white shadow-sm transition hover:shadow-md ${
                  block.emphasis
                    ? "border-[hsl(var(--primary))]/35 ring-1 ring-[hsl(var(--primary))]/15"
                    : "border-[hsla(220,14%,12%,0.08)]"
                }`}
              >
                <div className="relative aspect-[16/9] max-h-[200px] sm:max-h-[220px]">
                  <img
                    src={block.image}
                    alt={block.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <h3 className="font-sans text-lg font-semibold tracking-tight text-white drop-shadow-sm md:text-xl">
                      {block.title}
                    </h3>
                    {block.emphasis ? (
                      <span className="shrink-0 rounded bg-[hsl(var(--primary))] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-white">
                        Popular
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {block.description}
                  </p>
                  <span className="mt-3 inline-flex items-center text-sm font-semibold text-[hsl(var(--primary))]">
                    {block.emphasis ? "Plan catering" : "View"}
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section
        tone="muted"
        density="default"
        withMotion
        className="border-b border-[hsla(220,14%,12%,0.06)]"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <p className="section-kicker">Office lunch + catering</p>
            <h2 className="mt-3 text-[hsl(var(--foreground))]">
              Built for Mississauga workdays — especially Skymark Ave and Airport Corporate Centre.
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary))]" />
                Pickup stays organized: breakfast through pasta with clear pacing at the counter.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(152_30%_32%)]" />
                Catering stays legible: packages, minimums, and tray language you can forward to finance.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary))]" />
                Same team for the Tuesday sandwich run and the Thursday boardroom buffet.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/menu">View menu</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/catering">Catering overview</Link>
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-md border border-[hsla(220,14%,12%,0.1)] shadow-sm lg:col-span-6">
            <img
              src={SITE_IMAGES.veggieTray}
              alt="Colourful catering tray from Skymark Eatery"
              className="aspect-[4/3] h-full w-full object-cover sm:aspect-auto sm:min-h-[280px]"
            />
          </div>
        </div>
      </Section>

      {signaturePicks.length > 0 ? (
        <Section
          tone="light"
          density="default"
          withMotion
          className="border-b border-[hsla(220,14%,12%,0.06)]"
        >
          <div>
            <p className="section-kicker">Menu momentum</p>
            <h2 className="brand-rail mt-3 max-w-2xl text-[hsl(var(--foreground))]">
              Signature picks from the weekday line.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
              House favourites across the menu — tap through to the full section for every option and price.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {signaturePicks.map(({ section, item }) => (
                <a
                  key={`${section.id}-${item.name}`}
                  href={`/menu#${section.id}`}
                  className="rounded-md border border-[hsla(220,14%,12%,0.08)] bg-white p-4 shadow-sm transition hover:border-[hsl(var(--primary))]/35 hover:shadow-md"
                >
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(152_30%_30%)]">
                    {section.shortLabel}
                  </p>
                  <h3 className="mt-2 font-sans text-base font-semibold leading-snug text-[hsl(var(--foreground))]">
                    {item.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {item.description}
                  </p>
                  <p className="mt-3 font-sans text-sm font-semibold tabular-nums text-[hsl(var(--foreground))]">
                    {item.price}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <section className="border-b border-[hsla(220,14%,12%,0.08)] bg-[hsl(var(--primary))] py-12 text-[hsl(var(--primary-foreground))] md:py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-center">
            <div>
              <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/80">
                Catering CTA
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Trays and buffets when the headcount is real.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {CATERING_HELPER_TEXT}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white font-semibold text-[hsl(var(--primary))] hover:bg-white/90"
                  asChild
                >
                  <Link href="/catering#packages">Compare packages</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent font-semibold text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/catering#inquire">Request a quote</Link>
                </Button>
              </div>
            </div>
            <ul className="space-y-3 rounded-md border border-white/20 bg-black/10 p-5 text-sm text-white/95 backdrop-blur-sm">
              {featuredPackages.map((pkg) => (
                <li key={pkg.publicName} className="flex flex-col border-b border-white/15 pb-3 last:border-0 last:pb-0">
                  <span className="font-semibold">{pkg.publicName}</span>
                  <span className="text-xs text-white/75">
                    {pkg.pricePerPerson} · {pkg.minimumOrder}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section tone="dark" density="default" withMotion>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_40%_70%)]" />
              <div>
                <h3 className="font-sans text-lg font-semibold text-white">{BUSINESS_INFO.addressLine1}</h3>
                <p className="mt-1 text-sm text-white/70">{BUSINESS_INFO.addressLine2}</p>
                <a
                  href={BUSINESS_INFO.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
                >
                  Open in Maps
                </a>
              </div>
            </div>
            <div className="flex gap-3 sm:col-span-2 lg:col-span-1">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_40%_70%)]" />
              <div>
                <h3 className="font-sans text-lg font-semibold text-white">Weekday hours</h3>
                <p className="mt-1 text-sm text-white/70">{BUSINESS_INFO.hoursLabel}</p>
              </div>
            </div>
            <div className="flex gap-3 sm:col-span-2 lg:col-span-1">
              <UtensilsCrossed className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_40%_70%)]" />
              <div>
                <h3 className="font-sans text-lg font-semibold text-white">Trusted pickup rhythm</h3>
                <p className="mt-1 text-sm text-white/70">
                  Same crew for the counter line and catering prep — built for repeat office visits on Skymark Ave.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-md border border-white/10">
            <img
              src={SITE_IMAGES.locationInterior}
              alt={SITE_IMAGES.locationInteriorAlt}
              className="aspect-[16/10] w-full object-cover sm:aspect-[5/3]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </Section>
    </Layout>
  );
}
