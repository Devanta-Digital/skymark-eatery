import { Link } from "wouter";
import { ArrowRight, Clock, Mail, MapPin, Phone, ShoppingBag, Users } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { Button } from "@/components/ui/button";
import { BUSINESS_INFO, SITE_IMAGES } from "@/content/site";
import {
  breadcrumbStructuredData,
  restaurantStructuredData,
  useSeo,
} from "@/lib/seo";

const WAYFINDING = [
  {
    src: SITE_IMAGES.locationInterior,
    alt: "Storefront exterior at 2630 Skymark Ave, Mississauga",
    caption: "Out front — look for the Caffe E Pranzo sign.",
  },
  {
    src: SITE_IMAGES.dining,
    alt: "Entrance and dining room at Skymark Eatery",
    caption: "Walk in — pickup desk is on your right.",
  },
  {
    src: SITE_IMAGES.hotTable,
    alt: "Counter at Skymark Eatery during weekday service",
    caption: "The counter — grab a seat or order to go.",
  },
];

export default function Contact() {
  useSeo({
    title:
      "Visit — Skymark Eatery by Caffe E Pranzo | 2630 Skymark Ave, Mississauga",
    description:
      "Skymark Eatery by Caffe E Pranzo — 2630 Skymark Ave Unit 102, Mississauga (west GTA, near Pearson). Weekday hours, phone, email, map, parking, and pickup wayfinding in one place.",
    path: "/contact",
    image: SITE_IMAGES.contactHero,
    imageAlt: SITE_IMAGES.contactHeroAlt,
    structuredData: [
      restaurantStructuredData(),
      breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: "Visit", path: "/contact" },
      ]),
    ],
  });

  return (
    <Layout>
      <Hero
        className="contact-hero"
        eyebrow="Visit · 2630 Skymark Ave · Mississauga"
        title="Visit or order from 2630 Skymark Ave."
        subtitle="Inside 2630 Skymark Ave, unit 102 — free plot parking, pickup desk on your right as you walk in. Open Monday to Friday, 7:30a to 4:30p."
        imageSrc={SITE_IMAGES.contactHero}
        imageAlt={SITE_IMAGES.contactHeroAlt}
        density="compact"
        imageClassName="media-crop-contact-hero"
        primaryCta={{ label: `Call ${BUSINESS_INFO.phone}`, href: BUSINESS_INFO.phoneHref }}
        secondaryCta={{ label: "Get directions", href: BUSINESS_INFO.mapsHref }}
      />

      <Section
        tone="light"
        density="snug"
        className="border-b border-[hsla(220,14%,12%,0.07)]"
      >
        <div
          id="contact-primary"
          className="grid gap-8 lg:grid-cols-12 lg:gap-x-12"
        >
          <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <div>
              <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                Address
              </dt>
              <dd className="mt-2 text-[15px] font-semibold leading-snug text-[hsl(var(--foreground))]">
                {BUSINESS_INFO.addressLine1}
                <br />
                <span className="font-normal text-[hsl(var(--muted-foreground))]">
                  {BUSINESS_INFO.addressLine2}
                </span>
              </dd>
              <dd className="mt-2">
                <a
                  href={BUSINESS_INFO.mapsHref}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--primary))] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Open in Maps
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                Hours
              </dt>
              <dd className="mt-2 flex items-start gap-2 text-[15px] text-[hsl(var(--foreground))]">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(152_36%_32%)]" aria-hidden />
                <span>
                  <span className="font-semibold">Mon–Fri · 7:30a–4:30p</span>
                  <span className="mt-1 block text-xs text-[hsl(var(--muted-foreground))]">
                    Closed Sat, Sun, and stat holidays
                  </span>
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                Phone
              </dt>
              <dd className="mt-2">
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                >
                  <Phone className="h-4 w-4 text-[hsl(var(--primary))]" aria-hidden />
                  {BUSINESS_INFO.phone}
                </a>
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  Fastest for pickup and same-day questions.
                </p>
              </dd>
            </div>
            <div>
              <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                >
                  <Mail className="h-4 w-4 text-[hsl(var(--primary))]" aria-hidden />
                  {BUSINESS_INFO.email}
                </a>
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  Best for catering quotes and dietary notes.
                </p>
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 border-t border-[hsla(220,14%,12%,0.08)] pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
              Jump to
            </p>
            <Button className="h-11 justify-start font-sans text-sm" asChild>
              <Link href="/menu">
                <ShoppingBag className="mr-2 h-4 w-4" aria-hidden />
                Menu &amp; pickup
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 justify-start border-[hsla(220,18%,12%,0.18)] bg-white/70 font-sans text-sm text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]/35 hover:bg-white"
              asChild
            >
              <Link href="/catering#inquire">
                <Users className="mr-2 h-4 w-4" aria-hidden />
                Catering inquiry
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section
        tone="muted"
        density="snug"
        className="border-b border-[hsla(220,14%,12%,0.07)]"
      >
        <div className="max-w-2xl">
          <p className="section-kicker">Arrival</p>
          <h2 className="font-display-hero mt-3 text-[hsl(var(--foreground))] text-[clamp(1.35rem,2.8vw,1.8rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
            What to expect when you walk in.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Ground-floor tenant at 2630 Skymark Ave, with free plot parking shared across the building. Pickup orders are ready at the counter on your right as you enter — call ahead for the fastest turnaround.
          </p>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {WAYFINDING.map((step, index) => (
            <li
              key={step.caption}
              className="overflow-hidden rounded-xl bg-white ring-1 ring-[hsla(220,14%,12%,0.07)]"
            >
              <div className="relative aspect-[4/3] bg-[hsl(34_32%_92%)]">
                <img
                  src={step.src}
                  alt={step.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="px-4 py-3 font-sans text-sm font-medium leading-snug text-[hsl(var(--foreground))]">
                {step.caption}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        tone="light"
        density="snug"
        className="border-b border-[hsla(220,14%,12%,0.07)]"
      >
        <div
          id="map"
          className="anchor-section flex flex-col overflow-hidden rounded-lg border border-[hsla(220,14%,12%,0.1)] bg-[hsl(220_28%_7%)] shadow-[0_18px_48px_-36px_rgba(15,23,42,0.28)]"
        >
          <div className="flex items-end justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Map
              </p>
              <p className="mt-0.5 font-sans text-sm font-semibold text-white">
                2630 Skymark Ave · Unit 102
              </p>
            </div>
            <a
              href={BUSINESS_INFO.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline"
            >
              Larger map
            </a>
          </div>
          <iframe
            src={BUSINESS_INFO.mapsEmbedHref}
            width="100%"
            height="100%"
            className="h-[40vh] min-h-[280px] w-full bg-[hsl(220_24%_6%)] sm:h-[44vh]"
            style={{ border: 0 }}
            loading="lazy"
            title="Google Map: Skymark Eatery by Caffe E Pranzo, 2630 Skymark Ave Unit 102, Mississauga"
          />
        </div>
      </Section>

      <Section tone="muted" density="snug">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/menu"
            className="group flex h-full items-start justify-between gap-5 rounded-xl bg-white p-5 ring-1 ring-[hsla(220,14%,12%,0.07)] transition-shadow duration-300 hover:shadow-[0_16px_44px_-30px_rgba(15,23,42,0.28)]"
          >
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
                Ordering for one
              </p>
              <h3 className="mt-2 font-serif text-lg font-semibold text-[hsl(var(--foreground))]">
                Breakfast, lunch, pickup
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                The takeout counter menu — sandwiches, salads, pasta, pizza, sides. Ready in ten.
              </p>
            </div>
            <ArrowRight
              className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--primary))] transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/catering"
            className="group flex h-full items-start justify-between gap-5 rounded-xl bg-white p-5 ring-1 ring-[hsla(220,14%,12%,0.07)] transition-shadow duration-300 hover:shadow-[0_16px_44px_-30px_rgba(15,23,42,0.28)]"
          >
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
                Ordering for a team
              </p>
              <h3 className="mt-2 font-serif text-lg font-semibold text-[hsl(var(--foreground))]">
                Office catering packages
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                Per-person pricing, buffets, hot trays, sandwich boards — quote in one business day.
              </p>
            </div>
            <ArrowRight
              className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--primary))] transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </Section>
    </Layout>
  );
}
