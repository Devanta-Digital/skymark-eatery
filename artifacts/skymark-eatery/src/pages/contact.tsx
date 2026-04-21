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
      "Contact Skymark Eatery by Caffe E Pranzo | Mississauga Italian Catering & Takeout",
    description:
      "Visit, call, email, or request catering from Skymark Eatery by Caffe E Pranzo in Mississauga. Find the address, map, hours, and inquiry options in one place.",
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
      <section className="relative overflow-hidden border-b border-black/5 bg-[#2d1e18] text-white">
        <div className="absolute inset-0">
          <img
            src={SITE_IMAGES.locationInterior}
            alt={SITE_IMAGES.locationInteriorAlt}
            className="h-full w-full object-cover opacity-24"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(24,15,11,0.94),rgba(45,30,24,0.86)_56%,rgba(107,67,48,0.66))]" />
        </div>

        <div className="relative container mx-auto px-4 py-14 sm:py-18">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#dfc2b1]">
                Contact
              </div>
              <h1 className="mt-4 text-5xl leading-[0.96] text-white sm:text-6xl">
                Visit, call, or email {BUSINESS_INFO.primaryName}.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                Use this page for directions, hours, pickup questions, and
                direct contact. For larger group orders, head to the catering
                page.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="rounded-full bg-[#8b4f39] px-7 text-white hover:bg-[#75412f]"
                  asChild
                >
                  <a href={BUSINESS_INFO.phoneHref}>
                    Call {BUSINESS_INFO.phone}
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/14 bg-white/7 px-7 text-white hover:bg-white/10"
                  asChild
                >
                  <a href={BUSINESS_INFO.emailHref}>Email Us</a>
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-[0_24px_54px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <div className="space-y-4 text-sm text-white/72">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-[#f1caa9]" />
                  <div>
                    <div className="font-semibold text-white">
                      Mississauga location
                    </div>
                    <p className="mt-1">
                      {BUSINESS_INFO.addressLine1}
                      <br />
                      {BUSINESS_INFO.addressLine2}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-[#f1caa9]" />
                  <div>
                    <div className="font-semibold text-white">
                      Weekday hours
                    </div>
                    <p className="mt-1">Monday to Friday, 7:30 AM to 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-[#f1caa9]" />
                  <div>
                    <div className="font-semibold text-white">
                      Best for quick help
                    </div>
                    <p className="mt-1">
                      Call for pickup timing, same-day questions, or menu
                      availability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr]">
            <div className="space-y-5">
              <div className="rounded-[1.9rem] border border-[rgba(79,50,34,0.08)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-[#2d1e18]">
                  <MapPin className="h-5 w-5 text-[#8b4f39]" />
                  <h2 className="text-2xl">Address</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#6d5748]">
                  {BUSINESS_INFO.addressLine1}
                  <br />
                  {BUSINESS_INFO.addressLine2}
                </p>
                <Button
                  variant="outline"
                  className="mt-5 rounded-full border-[rgba(45,30,24,0.12)] bg-[#fbf6ef]"
                  asChild
                >
                  <a
                    href={BUSINESS_INFO.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions
                  </a>
                </Button>
              </div>

              <div className="rounded-[1.9rem] border border-[rgba(79,50,34,0.08)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-[#2d1e18]">
                  <Clock className="h-5 w-5 text-[#8b4f39]" />
                  <h2 className="text-2xl">Hours</h2>
                </div>
                <p className="mt-4 text-sm text-[#6d5748]">Monday to Friday</p>
                <p className="mt-1 text-lg font-semibold text-[#2d1e18]">
                  7:30 AM to 4:30 PM
                </p>
                <p className="mt-2 text-sm text-[#6d5748]">
                  Closed weekends and public holidays.
                </p>
              </div>

              <div className="rounded-[1.9rem] border border-[rgba(79,50,34,0.08)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-[#2d1e18]">
                  <Phone className="h-5 w-5 text-[#8b4f39]" />
                  <h2 className="text-2xl">Phone and email</h2>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#6d5748]">
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="block text-lg font-semibold text-[#2d1e18] hover:text-[#8b4f39]"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                  <a
                    href={BUSINESS_INFO.emailHref}
                    className="inline-flex items-center gap-2 hover:text-[#8b4f39]"
                  >
                    <Mail className="h-4 w-4" />
                    {BUSINESS_INFO.email}
                  </a>
                </div>
              </div>

              <div className="rounded-[1.9rem] border border-[rgba(79,50,34,0.08)] bg-[#fbf6ef] p-6 shadow-sm">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
                  Quick paths
                </div>
                <div className="mt-5 grid gap-3">
                  <Button
                    className="justify-start rounded-full bg-[#8b4f39] text-white hover:bg-[#75412f]"
                    asChild
                  >
                    <Link href="/menu">
                      <ShoppingBag className="h-4 w-4" />
                      View Menu / Order Pickup
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start rounded-full border-[rgba(45,30,24,0.12)] bg-white"
                    asChild
                  >
                    <Link href="/catering#inquire">
                      <Users className="h-4 w-4" />
                      Request Catering
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm">
              <iframe
                src={BUSINESS_INFO.mapsEmbedHref}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 620 }}
                loading="lazy"
                title="Google Map: Skymark Eatery, 2630 Skymark Ave Unit 102, Mississauga"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
