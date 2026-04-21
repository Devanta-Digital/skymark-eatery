import { Link } from "wouter";
import { Clock, Mail, MapPin, Phone, ShoppingBag, Users } from "lucide-react";
import { Layout } from "@/components/layout";
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
      "Visit Skymark Eatery by Caffe E Pranzo at 2630 Skymark Ave Unit 102, Mississauga. Hours, phone, email, and directions for Italian takeout and catering near Pearson Airport.",
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
      <section className="grain-hero relative overflow-hidden border-b border-[rgba(26,18,14,0.1)] bg-[#14100e] text-[#f4ebe3]">
        <div className="absolute inset-0">
          <img
            src={SITE_IMAGES.locationInterior}
            alt={SITE_IMAGES.locationInteriorAlt}
            className="h-full min-h-[320px] w-full object-cover opacity-28 sm:min-h-[360px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(12,9,8,0.94),rgba(28,20,16,0.82)_52%,rgba(60,38,28,0.45))]" />
        </div>

        <div className="relative container mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[#e2c4b0]">
            Contact
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.25rem] leading-[1.02] tracking-tight sm:text-5xl">
            Visit {BUSINESS_INFO.primaryName}.
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-[#d8c8bc] sm:text-base">
            Directions, weekday hours, and direct lines for pickup questions.
            For tray counts and buffet planning, the catering page keeps
            everything in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-11 rounded-md bg-[#b85c40] px-6 text-sm text-white hover:bg-[#9e4e36]"
              asChild
            >
              <a href={BUSINESS_INFO.phoneHref}>Call {BUSINESS_INFO.phone}</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-md border-white/22 bg-transparent px-6 text-sm text-[#f4ebe3] hover:bg-white/10"
              asChild
            >
              <a href={BUSINESS_INFO.emailHref}>Email</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(26,18,14,0.07)] py-14 sm:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div className="space-y-8">
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

            <div className="overflow-hidden border border-[rgba(26,18,14,0.1)] bg-white">
              <iframe
                src={BUSINESS_INFO.mapsEmbedHref}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 520 }}
                loading="lazy"
                title="Google Map: Skymark Eatery by Caffe E Pranzo, 2630 Skymark Ave Unit 102, Mississauga"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
