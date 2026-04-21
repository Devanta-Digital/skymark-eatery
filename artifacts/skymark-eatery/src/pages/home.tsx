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

function signatureLaneImage(sectionId: string) {
  switch (sectionId) {
    case "breakfast":
      return SITE_IMAGES.focaccia;
    case "sandwiches":
      return SITE_IMAGES.saladSandwich;
    case "pasta":
      return SITE_IMAGES.hotTable;
    default:
      return SITE_IMAGES.vealSandwich;
  }
}

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
    image: SITE_IMAGES.og,
    imageAlt: "Daily pasta and hot plates from Skymark Eatery",
    emphasis: false,
  },
] as const;

const primaryOffer = categoryOffers.find((o) => o.emphasis)!;
const supportingOffers = categoryOffers.filter((o) => !o.emphasis);

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
        eyebrow="Italian weekday counter · Skymark Ave · Pearson-west"
        title="Lunch that moves fast. Catering that holds up in email."
        subtitle="Weekday breakfast through pasta for Airport Corporate Centre, Dixon–Rathburn offices, and teams who need pickup on a clock — plus trays and buffets from the same Skymark Ave kitchen."
        imageSrc={SITE_IMAGES.hero}
        imageAlt="Hot veal sandwich and lunch line favourites at Skymark Eatery by Caffe E Pranzo, Mississauga"
        imageClassName="media-crop-home-hero"
        imageEmphasis="subdued"
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
          <p className="section-kicker">How you order</p>
          <h2 className="brand-rail-muted mt-3 max-w-2xl text-[hsl(var(--foreground))]">
            One counter — two rhythms.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
            Catering runs as trays, buffets, and platters. Pickup runs as the weekday line — same kitchen, different portioning.
          </p>

          <div className="relative mt-14 lg:mt-20">
            <div
              className="pointer-events-none absolute left-[4%] right-[6%] top-6 hidden h-[78%] rounded-[2rem] bg-[linear-gradient(118deg,hsl(var(--muted))_0%,transparent_58%)] opacity-90 lg:block"
              aria-hidden
            />
            <div className="relative grid items-stretch gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="relative lg:col-span-7">
                <span
                  className="pointer-events-none absolute -left-1 top-2 font-sans text-[clamp(3.75rem,10vw,6.5rem)] font-semibold leading-none tracking-tight text-[hsl(var(--foreground))]/[0.04] sm:left-0 lg:top-6"
                  aria-hidden
                >
                  01
                </span>
                <a
                  href={primaryOffer.href}
                  className="group relative mt-8 flex min-h-[min(100vw,400px)] flex-col overflow-hidden rounded-[1.65rem] bg-[hsl(220_46%_8%)] shadow-[0_40px_90px_-48px_rgba(15,23,42,0.72)] lg:mt-12 lg:min-h-[400px] lg:flex-row lg:rounded-[2rem]"
                >
                  <div className="relative min-h-[240px] w-full overflow-hidden lg:min-h-0 lg:w-[56%] lg:max-w-none">
                    <div className="depth-tilt absolute inset-0">
                      <img
                        src={primaryOffer.image}
                        alt={primaryOffer.imageAlt}
                        className="media-crop-offer-catering h-full w-full scale-[1.08] object-cover opacity-[0.9] transition duration-[720ms] ease-out group-hover:scale-[1.12] group-hover:opacity-100"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-black/55 lg:via-black/20 lg:to-transparent" />
                  </div>
                  <div className="relative z-10 flex flex-1 flex-col justify-end px-7 py-9 lg:absolute lg:inset-0 lg:justify-center lg:bg-gradient-to-r lg:from-black/50 lg:via-black/25 lg:to-transparent lg:px-12 lg:py-12">
                    <div className="lg:ml-[48%] lg:max-w-md">
                      <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-[hsl(var(--primary))]">
                        Service lane
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[1.85rem]">
                        {primaryOffer.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/78 sm:text-[0.95rem]">
                        {primaryOffer.description}
                      </p>
                      <span className="mt-8 inline-flex items-center text-sm font-semibold text-white transition duration-300 group-hover:translate-x-0.5">
                        Trays &amp; buffet packages
                        <ArrowUpRight className="ml-1.5 h-4 w-4 transition duration-300 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              <div className="relative flex flex-col justify-end pb-1 lg:col-span-5 lg:pb-6 lg:pl-2">
                <span
                  className="pointer-events-none absolute right-0 top-0 font-sans text-[clamp(3rem,8vw,4.5rem)] font-semibold leading-none text-[hsl(var(--foreground))]/[0.055] lg:-top-4 lg:right-4"
                  aria-hidden
                >
                  02
                </span>
                <p className="relative font-sans text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-[hsl(152_40%_28%)]">
                  Pickup lanes
                </p>
                <p className="relative mt-2 max-w-sm text-xs leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-sm">
                  Weekday counter rhythm — same kitchen, single-plate portioning.
                </p>
                <div className="relative mt-6 divide-y divide-[hsla(220,14%,12%,0.1)]">
                  {supportingOffers.map((lane) => (
                    <a
                      key={lane.key}
                      href={lane.href}
                      className="group flex gap-4 py-5 transition-[transform,opacity] duration-300 ease-out first:pt-1 hover:opacity-[0.98] sm:gap-5"
                    >
                      <div className="depth-tilt relative h-[4.25rem] w-[4.5rem] shrink-0 overflow-hidden rounded-md ring-1 ring-[hsla(220,14%,12%,0.08)] transition duration-500 group-hover:ring-[hsl(var(--primary))]/25 sm:h-[4.75rem] sm:w-20">
                        <img
                          src={lane.image}
                          alt={lane.imageAlt}
                          className="media-crop-lane h-full w-full object-cover transition duration-[520ms] ease-out group-hover:scale-[1.06]"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center border-l border-transparent pl-1 transition duration-300 group-hover:border-[hsl(var(--primary))]/35">
                        <h3 className="font-sans text-[1.02rem] font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-lg">
                          {lane.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-sm">
                          {lane.description}
                        </p>
                        <span className="mt-2.5 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--primary))]">
                          Menu
                          <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-80 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
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
          <div className="depth-tilt relative overflow-hidden rounded-xl border border-[hsla(220,14%,12%,0.1)] shadow-md lg:col-span-6">
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
              One hero plate plus three fast jumps — each opens the right menu section with full pricing.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-12">
              {(() => {
                const [lead, ...rest] = signaturePicks;
                if (!lead) return null;
                const leadImg = signatureLaneImage(lead.section.id);
                return (
                  <>
                    <a
                      key={`${lead.section.id}-${lead.item.name}`}
                      href={`/menu#${lead.section.id}`}
                      className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-xl border border-[hsla(220,14%,12%,0.1)] bg-[hsl(220_44%_8%)] shadow-lg lg:col-span-7"
                    >
                      <img
                        src={leadImg}
                        alt={`${lead.item.name} — ${lead.section.shortLabel} at Skymark Eatery`}
                        className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                      <div className="relative p-6 md:p-8">
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                          {lead.section.shortLabel}
                        </p>
                        <h3 className="mt-2 font-sans text-xl font-semibold leading-snug text-white md:text-2xl">
                          {lead.item.name}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                          {lead.item.description}
                        </p>
                        <p className="mt-4 font-sans text-lg font-semibold tabular-nums text-white">
                          {lead.item.price}
                        </p>
                      </div>
                    </a>
                    <div className="flex flex-col gap-3 lg:col-span-5">
                      {rest.map(({ section, item }) => (
                        <a
                          key={`${section.id}-${item.name}`}
                          href={`/menu#${section.id}`}
                          className="group flex gap-3 rounded-xl border border-[hsla(220,14%,12%,0.08)] bg-white p-3 shadow-sm transition hover:border-[hsl(var(--primary))]/28 hover:shadow-md sm:p-4"
                        >
                          <div className="depth-tilt relative h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:h-[4.5rem] sm:w-24">
                            <img
                              src={signatureLaneImage(section.id)}
                              alt={`${item.name} — ${section.shortLabel}`}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[hsl(152_40%_28%)]">
                              {section.shortLabel}
                            </p>
                            <h3 className="mt-1 font-sans text-sm font-semibold leading-snug text-[hsl(var(--foreground))] sm:text-base">
                              {item.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs text-[hsl(var(--muted-foreground))]">
                              {item.description}
                            </p>
                            <p className="mt-2 font-sans text-sm font-semibold tabular-nums text-[hsl(var(--foreground))]">
                              {item.price}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </>
                );
              })()}
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

      <Section
        tone="dark"
        density="default"
        withMotion
        className="border-t border-white/[0.07] py-10 md:py-12 lg:py-14"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">
          <div className="flex flex-1 flex-col gap-7 sm:max-lg:grid sm:max-lg:grid-cols-2 sm:max-lg:gap-x-8 lg:max-w-[min(52rem,100%)]">
            <div className="flex gap-3 sm:max-lg:col-span-2 lg:max-w-xl">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_40%_70%)]" />
              <div>
                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Location
                </p>
                <h3 className="mt-1.5 font-sans text-base font-semibold text-white sm:text-lg">{BUSINESS_INFO.addressLine1}</h3>
                <p className="mt-1 text-sm text-white/68">{BUSINESS_INFO.addressLine2}</p>
                <a
                  href={BUSINESS_INFO.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--primary))] transition hover:text-white"
                >
                  Open in Maps
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_40%_70%)]" />
              <div>
                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Hours
                </p>
                <h3 className="mt-1.5 font-sans text-base font-semibold text-white sm:text-lg">Weekday service</h3>
                <p className="mt-1 text-sm text-white/68">{BUSINESS_INFO.hoursLabel}</p>
              </div>
            </div>
            <div className="flex gap-3 sm:max-lg:col-span-2 lg:max-w-lg">
              <UtensilsCrossed className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_40%_70%)]" />
              <div>
                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Proof of pickup
                </p>
                <h3 className="mt-1.5 font-sans text-base font-semibold text-white sm:text-lg">Same crew, two lanes</h3>
                <p className="mt-1 text-sm text-white/68">
                  Counter line and catering prep under one roof — built for repeat Skymark Ave visits.
                </p>
              </div>
            </div>
          </div>
          <div className="relative w-full shrink-0 lg:w-[min(240px,28vw)]">
            <img
              src={SITE_IMAGES.locationInterior}
              alt={SITE_IMAGES.locationInteriorAlt}
              className="trust-proof-thumb media-crop-trust-interior aspect-[5/3] w-full rounded-lg object-cover opacity-90 ring-1 ring-white/10 sm:aspect-[4/3] lg:aspect-[4/5] lg:max-h-[200px]"
            />
            <p className="mt-2 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
              Storefront reference
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
