import { Link } from "wouter";
import { Clock, Mail, MapPin, Phone, ShoppingBag, Users } from "lucide-react";
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

export default function Contact() {
  useSeo({
    title:
      "Contact & Location — Skymark Eatery by Caffe E Pranzo | Skymark Ave, Mississauga",
    description:
      "Skymark Eatery by Caffe E Pranzo — 2630 Skymark Ave Unit 102, Mississauga (west GTA, near Pearson). Weekday hours, phone, email, map, and quick links to takeout menu and office catering.",
    path: "/contact",
    image: SITE_IMAGES.contactHero,
    imageAlt: SITE_IMAGES.contactHeroAlt,
    structuredData: [
      restaurantStructuredData(),
      breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  });

  return (
    <Layout>
      <Hero
        eyebrow="Location · hours · direct line"
        title="Skymark Ave, on the record."
        subtitle="Address, weekday hours, map, phone, and email in one place. For trays and buffets, start on catering so headcounts stay in one thread."
        imageSrc={SITE_IMAGES.contactHero}
        imageAlt={SITE_IMAGES.contactHeroAlt}
        density="compact"
        imageClassName="media-crop-contact-hero"
        primaryCta={{ label: `Call ${BUSINESS_INFO.phone}`, href: BUSINESS_INFO.phoneHref }}
        secondaryCta={{ label: "Email", href: BUSINESS_INFO.emailHref }}
      />

      <Section
        tone="light"
        density="default"
        className="border-b border-[hsla(220,14%,12%,0.07)]"
      >
        <div>
          <p className="section-kicker">Dispatch desk</p>
          <h2 className="brand-rail-muted mt-3 max-w-xl text-xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-2xl">
            Everything you need to show up or send someone — nothing extra.
          </h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-stretch lg:gap-10">
            <div className="flex flex-col justify-between gap-8">
              <dl className="space-y-6 font-sans text-sm">
                <div>
                  <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Address
                  </dt>
                  <dd className="mt-2 text-base font-medium leading-snug text-[hsl(var(--foreground))]">
                    {BUSINESS_INFO.addressLine1}
                    <br />
                    {BUSINESS_INFO.addressLine2}
                  </dd>
                  <dd className="mt-2">
                    <a
                      href={BUSINESS_INFO.mapsHref}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      Open in Maps
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Hours
                  </dt>
                  <dd className="mt-2 flex items-start gap-2 text-[hsl(var(--foreground))]">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(152_36%_32%)]" />
                    <span>
                      <span className="font-semibold">Mon–Fri · 7:30a–4:30p</span>
                      <span className="mt-1 block text-[hsl(var(--muted-foreground))]">
                        Closed weekends and statutory holidays.
                      </span>
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
                    Phone &amp; email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={BUSINESS_INFO.phoneHref}
                      className="inline-flex items-center gap-2 text-base font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                    >
                      <Phone className="h-4 w-4 text-[hsl(var(--primary))]" />
                      {BUSINESS_INFO.phone}
                    </a>
                  </dd>
                  <dd className="mt-2">
                    <a
                      href={BUSINESS_INFO.emailHref}
                      className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {BUSINESS_INFO.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button className="h-10 font-sans text-sm" asChild>
                  <Link href="/menu">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Menu / pickup
                  </Link>
                </Button>
                <Button variant="outline" className="h-10 font-sans text-sm" asChild>
                  <Link href="/catering#inquire">
                    <Users className="mr-2 h-4 w-4" />
                    Catering inquiry
                  </Link>
                </Button>
              </div>

              <div className="flex gap-3 border-t border-[hsla(220,14%,12%,0.08)] pt-6">
                <img
                  src={SITE_IMAGES.locationInterior}
                  alt={SITE_IMAGES.locationInteriorAlt}
                  className="media-crop-trust-interior h-14 w-[5.5rem] shrink-0 rounded-md object-cover ring-1 ring-[hsla(220,14%,12%,0.1)]"
                />
                <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                  Counter and seating for weekday pickup — proof of location only; book catering from the catering page.
                </p>
              </div>
            </div>

            <div className="flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-[hsla(220,14%,12%,0.1)] bg-[hsl(220_28%_7%)] shadow-[0_24px_60px_-38px_rgba(15,23,42,0.35)] sm:min-h-[420px] lg:min-h-0">
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
                className="min-h-[280px] flex-1 bg-[hsl(220_24%_6%)] sm:min-h-[360px]"
                style={{ border: 0 }}
                loading="lazy"
                title="Google Map: Skymark Eatery by Caffe E Pranzo, 2630 Skymark Ave Unit 102, Mississauga"
              />
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
