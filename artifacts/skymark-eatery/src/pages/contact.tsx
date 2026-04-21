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
    image: SITE_IMAGES.locationInterior,
    imageAlt: SITE_IMAGES.locationInteriorAlt,
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
        eyebrow="Contact"
        title={`Visit ${BUSINESS_INFO.primaryName}.`}
        subtitle="Directions, weekday hours, and direct lines for pickup questions. For tray counts and buffet planning, the catering page keeps everything in one place."
        imageSrc={SITE_IMAGES.locationInterior}
        imageAlt={SITE_IMAGES.locationInteriorAlt}
        primaryCta={{ label: `Call ${BUSINESS_INFO.phone}`, href: BUSINESS_INFO.phoneHref }}
        secondaryCta={{ label: "Email", href: BUSINESS_INFO.emailHref }}
      />

      <Section
        tone="light"
        density="airy"
        className="border-b border-[rgba(26,18,14,0.07)]"
      >
        <div>
          <p className="section-kicker">Visit &amp; reach us</p>
          <h2 className="brand-rail mt-4 max-w-2xl font-serif text-3xl tracking-tight text-[#1f1410] sm:text-[2.1rem]">
            Everything you need to walk in, call, or plan catering — in one glance.
          </h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
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

            <div className="flex flex-col overflow-hidden rounded-sm border border-[rgba(26,18,14,0.12)] bg-[#1a1411] shadow-[0_20px_50px_rgba(28,18,14,0.12)]">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d4a990]">
                  Map
                </p>
                <p className="mt-1 font-serif text-lg text-white">
                  Skymark Ave · Mississauga
                </p>
              </div>
              <iframe
                src={BUSINESS_INFO.mapsEmbedHref}
                width="100%"
                height="100%"
                className="min-h-[420px] flex-1 bg-[#0f0c0b] sm:min-h-[520px]"
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
