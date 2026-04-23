import { Link } from "wouter";
import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_INFO,
  COUNTER_STORY,
  HOMEPAGE_PROOF,
  SITE_IMAGES,
} from "@/content/site";
import { restaurantStructuredData, useSeo } from "@/lib/seo";

type OrderPath = {
  key: string;
  kicker: string;
  title: string;
  promise: string;
  href: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
};

const ORDER_PATHS: OrderPath[] = [
  {
    key: "dine-in",
    kicker: "01",
    title: "Dine in",
    promise:
      "Sit at the counter, eat, back at your desk in thirty minutes — weekday casual, not corporate.",
    href: "/contact",
    cta: "Plan a visit",
    imageSrc: SITE_IMAGES.dining,
    imageAlt:
      "Dining counter at Skymark Eatery by Caffe E Pranzo, Mississauga",
  },
  {
    key: "pickup",
    kicker: "02",
    title: "Pickup",
    promise:
      "Call ahead or order at the counter — breakfast through pasta, ready when you arrive.",
    href: "/menu",
    cta: "Open the menu",
    imageSrc: SITE_IMAGES.saladSandwich,
    imageAlt:
      "Sandwich and salad pickup order from Skymark Eatery by Caffe E Pranzo",
  },
  {
    key: "catering",
    kicker: "03",
    title: "Office catering",
    promise:
      "Per-person buffet packages, hot trays, and sandwich boards — paste the quote into a PO.",
    href: "/catering",
    cta: "See packages",
    imageSrc: SITE_IMAGES.cateringHero,
    imageAlt: SITE_IMAGES.cateringHeroAlt,
  },
];

export default function Home() {
  useSeo({
    title:
      "Skymark Eatery by Caffe E Pranzo | Italian Takeout & Catering — Mississauga (Skymark Ave)",
    description:
      "Skymark Eatery by Caffe E Pranzo: weekday Italian breakfast and lunch, takeout, and office catering on Skymark Ave, Mississauga — near Pearson Airport. Order pickup, browse the menu, or plan trays and buffets.",
    path: "/",
    image: SITE_IMAGES.hero,
    imageAlt:
      "Italian pasta and weekday lunch at Skymark Eatery by Caffe E Pranzo, Mississauga",
    structuredData: restaurantStructuredData(),
  });

  return (
    <Layout>
      <Hero
        className="home-hero"
        contentClassName="lg:max-w-[min(28rem,92vw)]"
        eyebrow="A Mississauga counter · Skymark Ave · Mon–Fri"
        title="Italian lunch, built for the Mississauga workweek."
        subtitle="Weekday breakfast and lunch from Caffe E Pranzo's kitchen — dine in at the counter, grab pickup between meetings, or cater a boardroom without the guesswork."
        imageSrc={SITE_IMAGES.hero}
        imageAlt="Italian pasta and plated lunch at Skymark Eatery by Caffe E Pranzo, Mississauga"
        imageClassName="media-crop-home-hero"
        primaryCta={{ label: "Order pickup", href: "/menu" }}
        secondaryCta={{ label: "Catering packages", href: "/catering#packages" }}
        infoLine={
          <p>
            <a
              href={BUSINESS_INFO.phoneHref}
              className="font-semibold text-[hsl(var(--foreground))] underline decoration-[hsl(var(--primary))]/35 decoration-2 underline-offset-2 hover:text-[hsl(var(--primary))]"
            >
              {BUSINESS_INFO.phone}
            </a>
            <span className="mx-2 text-[hsl(var(--muted-foreground))]/50">·</span>
            <span>Open {BUSINESS_INFO.hoursLabel.replace("Monday to Friday, ", "Mon–Fri · ")}</span>
          </p>
        }
      />

      <Section
        tone="light"
        density="airy"
        withMotion
        className="border-b border-[hsla(220,14%,12%,0.06)]"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <header className="lg:col-span-4">
            <p className="section-kicker">Three ways to order</p>
            <h2 className="font-display-hero mt-4 text-[hsl(var(--foreground))] text-[clamp(1.55rem,3.6vw,2.15rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
              One kitchen, however your team eats.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              Dine-in, pickup, and office catering run out of the same Skymark Ave kitchen — same menu, same cooks, same plates.
            </p>
          </header>
          <ol className="lg:col-span-8 grid gap-5 sm:grid-cols-3">
            {ORDER_PATHS.map((path) => (
              <li key={path.key} className="group">
                <Link
                  href={path.href}
                  className="flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-[hsla(220,14%,12%,0.07)] transition-shadow duration-300 hover:shadow-[0_18px_44px_-24px_rgba(15,23,42,0.22)]"
                >
                  <div className="aspect-[5/4] w-full overflow-hidden bg-[hsl(34_32%_92%)]">
                    <img
                      src={path.imageSrc}
                      alt={path.imageAlt}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">
                        {path.kicker}
                      </span>
                      <h3 className="font-serif text-lg font-semibold text-[hsl(var(--foreground))]">
                        {path.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {path.promise}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--foreground))]">
                      {path.cta}
                      <ArrowRight
                        className="h-3.5 w-3.5 text-[hsl(var(--primary))] transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section
        tone="light"
        density="snug"
        withMotion
        className="border-b border-[hsla(220,14%,12%,0.06)]"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-12">
          <div className="lg:col-span-7">
            <p className="section-kicker">{COUNTER_STORY.kicker}</p>
            <h2 className="font-display-hero mt-4 max-w-xl text-[hsl(var(--foreground))] text-[clamp(1.45rem,3vw,1.95rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
              {COUNTER_STORY.headline}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-[hsl(var(--muted-foreground))] md:text-base">
              <span className="italic text-[hsl(var(--foreground))]/90">
                {COUNTER_STORY.body}
              </span>
            </p>
            <p className="mt-5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]/70">
              {COUNTER_STORY.attribution}
            </p>
          </div>
          <figure className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg ring-1 ring-[hsla(220,14%,12%,0.08)]">
              <img
                src={SITE_IMAGES.caesar}
                alt="Plating at the Skymark counter"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]/65">
              Caesar, plated at the counter — Tuesday, 12:05pm
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section
        tone="muted"
        density="snug"
        withMotion
        className="border-b border-[hsla(220,14%,12%,0.06)]"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <figure className="lg:col-span-6">
            <div className="overflow-hidden rounded-lg ring-1 ring-[hsla(220,14%,12%,0.08)]">
              <img
                src={SITE_IMAGES.cateringHero}
                alt={SITE_IMAGES.cateringHeroAlt}
                className="aspect-[16/11] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>
          <div className="lg:col-span-6">
            <p className="section-kicker">
              Office catering · Skymark Ave · Pearson-west
            </p>
            <h2 className="font-display-hero mt-3 max-w-xl text-[hsl(var(--foreground))] text-[clamp(1.5rem,3.2vw,2.05rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
              Catering that looks like it was ordered by a pro.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))] md:text-[15px]">
              Buffet packages from $16.75 per guest, hot trays, sandwich platters, and grazing boards — quote and confirmation in a single email thread, with a 24-hour minimum lead time.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                "Per-person pricing",
                "24h minimum lead time",
                "Pickup + delivery",
                "Same kitchen as the counter",
              ].map((pill) => (
                <li
                  key={pill}
                  className="rounded-full border border-[hsla(220,14%,12%,0.14)] bg-white/70 px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.1em] text-[hsl(var(--foreground))]/80"
                >
                  {pill}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="min-h-11 px-6 font-semibold" asChild>
                <Link href="/catering#packages">Compare packages</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-11 border-[hsla(220,18%,12%,0.18)] bg-white/70 px-6 font-semibold text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]/35 hover:bg-white"
                asChild
              >
                <Link href="/catering#inquire">Request a quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="light"
        density="snug"
        withMotion
        className="border-b border-[hsla(220,14%,12%,0.06)]"
      >
        <div className="mx-auto max-w-5xl">
          <p className="section-kicker text-center">Why teams book us</p>
          <h2 className="font-display-hero mt-3 text-center text-[hsl(var(--foreground))] text-[clamp(1.35rem,2.8vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
            Built to be safe to send a PO to.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[HOMEPAGE_PROOF.kitchen, HOMEPAGE_PROOF.operational, HOMEPAGE_PROOF.serviceArea].map(
              (item) => (
                <article
                  key={item.kicker}
                  className="relative border-t border-[hsla(220,14%,12%,0.12)] pt-5"
                >
                  <span
                    className="absolute left-0 top-[-1px] h-[3px] w-12 bg-[hsl(var(--primary))]"
                    aria-hidden
                  />
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[hsl(152_58%_26%)]">
                    {item.kicker}
                  </p>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-[hsl(var(--foreground))]">
                    {item.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {item.body}
                  </p>
                </article>
              ),
            )}
          </div>
          <p className="mt-8 text-center text-xs text-[hsl(var(--muted-foreground))]/70">
            Want references for your building?{" "}
            <Link
              href="/catering#inquire"
              className="font-semibold text-[hsl(var(--foreground))] underline decoration-[hsl(var(--primary))]/40 underline-offset-2 hover:text-[hsl(var(--primary))]"
            >
              Ask on the quote form
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section
        tone="dark"
        density="snug"
        withMotion
        className="border-b-8 border-b-[hsl(43_100%_98%)] border-t border-t-white/10 py-9 md:py-11 lg:py-12"
      >
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="flex flex-1 flex-col gap-6 sm:max-lg:grid sm:max-lg:grid-cols-2 sm:max-lg:gap-x-8 lg:max-w-[min(48rem,100%)]">
            <div className="flex gap-3 sm:max-lg:col-span-2 lg:max-w-xl">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_46%_62%)]" />
              <div>
                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/55">
                  Find us
                </p>
                <h3 className="mt-1.5 font-sans text-base font-semibold text-white sm:text-lg">
                  Inside 2630 Skymark Ave, unit 102
                </h3>
                <p className="mt-1 text-sm text-white/75">
                  Mississauga, ON · free plot parking · pickup desk on your right as you walk in
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-semibold">
                  <a
                    href={BUSINESS_INFO.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--primary))] transition hover:text-white"
                  >
                    Get directions
                  </a>
                  <Link
                    href="/contact#map"
                    className="text-white/75 transition hover:text-white"
                  >
                    See full hours + map
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(152_46%_62%)]" />
              <div>
                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/55">
                  Hours
                </p>
                <h3 className="mt-1.5 font-sans text-base font-semibold text-white sm:text-lg">
                  Weekday service
                </h3>
                <p className="mt-1 text-sm text-white/75">
                  {BUSINESS_INFO.hoursLabel}
                </p>
                <p className="mt-1 text-xs text-white/55">
                  Closed Saturday, Sunday, and stat holidays
                </p>
              </div>
            </div>
          </div>
          <figure className="relative w-full shrink-0 lg:w-[min(280px,32vw)]">
            <img
              src={SITE_IMAGES.locationInterior}
              alt={SITE_IMAGES.locationInteriorAlt}
              className="trust-proof-thumb trust-storefront-thumb media-crop-trust-interior aspect-[16/9] w-full rounded-md object-cover opacity-[0.82]"
            />
            <figcaption className="mt-2 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
              2630 Skymark Ave — look for the Caffe E Pranzo sign
            </figcaption>
          </figure>
        </div>
      </Section>
    </Layout>
  );
}
