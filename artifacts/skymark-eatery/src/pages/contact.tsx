import { Link } from "wouter";
import { Clock, Mail, MapPin, Phone, ShoppingBag, Users } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { Button } from "@/components/ui/button";
import { BUSINESS_INFO, SITE_IMAGES } from "@/content/site";
import { cn } from "@/lib/utils";
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
        eyebrow="Contact & location"
        title="Call, email, or walk in — we keep the lines simple."
        subtitle="Weekday hours, Skymark Ave address, and a live map. For tray counts and buffet planning, use the catering page so portions and packages stay in one thread."
        imageSrc={SITE_IMAGES.contactHero}
        imageAlt={SITE_IMAGES.contactHeroAlt}
        density="compact"
        primaryCta={{ label: `Call ${BUSINESS_INFO.phone}`, href: BUSINESS_INFO.phoneHref }}
        secondaryCta={{ label: "Email", href: BUSINESS_INFO.emailHref }}
      />

      <Section
        tone="light"
        density="default"
        className="border-b border-[hsla(220,14%,12%,0.07)]"
      >
        <div>
          <p className="section-kicker">Visit &amp; reach us</p>
          <h2 className="brand-rail-muted mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-[1.85rem]">
            Hours, phone, email, map — plus a look at the dining room when you want the full picture.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
            <div
              className={cn(
                "section-shell space-y-8 rounded-sm p-6 sm:p-8",
                "border border-[rgba(26,18,14,0.08)] bg-[hsla(40,42%,99%,0.9)]",
              )}
            >
              <div>
                <h2 className="font-serif text-2xl text-[#1f1410]">Address</h2>
                <p className="mt-3 font-sans text-sm leading-relaxed text-[#5c4d42]">
                  {BUSINESS_INFO.addressLine1}
                  <br />
                  {BUSINESS_INFO.addressLine2}
                </p>
                <a
                  href={BUSINESS_INFO.mapsHref}
                  className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#8b3d2c] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4" />
                  Get directions
                </a>
              </div>

              <div className="border-t border-[rgba(26,18,14,0.1)] pt-8">
                <h2 className="font-serif text-2xl text-[#1f1410]">Hours</h2>
                <p className="mt-3 font-sans text-sm text-[#5c4d42]">
                  Monday to Friday
                </p>
                <p className="mt-1 font-sans text-lg font-semibold text-[#1f1410]">
                  7:30 AM to 4:30 PM
                </p>
                <p className="mt-2 flex items-start gap-2 font-sans text-sm text-[#5c4d42]">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#8b3d2c]" />
                  Closed weekends and public holidays.
                </p>
              </div>

              <div className="border-t border-[rgba(26,18,14,0.1)] pt-8">
                <h2 className="font-serif text-2xl text-[#1f1410]">
                  Phone &amp; email
                </h2>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="mt-3 block font-sans text-lg font-semibold text-[#1f1410] hover:text-[#8b3d2c]"
                >
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#8b3d2c]" />
                    {BUSINESS_INFO.phone}
                  </span>
                </a>
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="mt-3 inline-flex items-center gap-2 font-sans text-sm font-medium text-[#5c4d42] hover:text-[#8b3d2c]"
                >
                  <Mail className="h-4 w-4" />
                  {BUSINESS_INFO.email}
                </a>
              </div>

              <div className="flex flex-col gap-2 border-t border-[rgba(26,18,14,0.1)] pt-8 sm:flex-row sm:flex-wrap">
                <Button
                  className="h-10 rounded-md bg-[#1f1410] font-sans text-sm text-white hover:bg-black"
                  asChild
                >
                  <Link href="/menu">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Order pickup
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-md border-[rgba(26,18,14,0.14)] bg-transparent font-sans text-sm"
                  asChild
                >
                  <Link href="/catering#inquire">
                    <Users className="mr-2 h-4 w-4" />
                    Request catering
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-md border border-[hsla(220,14%,12%,0.12)] bg-[hsl(220_22%_8%)] shadow-lg">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[hsl(152_36%_72%)]">
                  Map
                </p>
                <p className="mt-1 font-sans text-lg font-semibold text-white">
                  Skymark Ave · Mississauga
                </p>
              </div>
              <iframe
                src={BUSINESS_INFO.mapsEmbedHref}
                width="100%"
                height="100%"
                className="min-h-[380px] flex-1 bg-[hsl(220_24%_6%)] sm:min-h-[480px]"
                style={{ border: 0 }}
                loading="lazy"
                title="Google Map: Skymark Eatery by Caffe E Pranzo, 2630 Skymark Ave Unit 102, Mississauga"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" density="default" className="border-b border-[hsla(220,14%,12%,0.06)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <p className="section-kicker">The room</p>
            <h2 className="mt-2 text-xl font-semibold text-[hsl(var(--foreground))] sm:text-2xl">
              Counter service and seating on Skymark Ave — built for a quick in-and-out.
            </h2>
            <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
              Bright counter and dining room when you want to grab lunch or meet the team before a catering pickup.
            </p>
          </div>
          <div className="overflow-hidden rounded-md border border-[hsla(220,14%,12%,0.1)] shadow-sm">
            <img
              src={SITE_IMAGES.locationInterior}
              alt={SITE_IMAGES.locationInteriorAlt}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>
      </Section>
    </Layout>
  );
}
