import { Link } from "wouter";
import { ArrowUpRight, Clock3, MapPin, Star } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { Button } from "@/components/ui/button";
import { BUFFET_PACKAGES } from "@/content/catering";
import { HOME_SIGNATURE_GROUPS } from "@/content/menu";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  SITE_IMAGES,
} from "@/content/site";
import { restaurantStructuredData, useSeo } from "@/lib/seo";

const featuredPackages = BUFFET_PACKAGES.slice(0, 3);

const signatureBlocks = HOME_SIGNATURE_GROUPS.slice(0, 3).map((g, i) => ({
  ...g,
  image: [SITE_IMAGES.focaccia, SITE_IMAGES.vealSandwich, SITE_IMAGES.hotTable][
    i
  ],
  imageAlt: [
    "Focaccia and baked goods from the Skymark Eatery counter",
    "Hot sandwich from the lunch line at Skymark Eatery",
    "Hot table and lunch service at Skymark Eatery",
  ][i],
}));

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

  return (
    <Layout>
      <Hero
        eyebrow="Italian eatery · Mississauga"
        title={`${BUSINESS_INFO.secondaryName} by Caffe E Pranzo`}
        subtitle="Weekday breakfast through lunch on Skymark Ave, with catering built for offices and events across west Mississauga and teams near Pearson."
        imageSrc={SITE_IMAGES.hero}
        imageAlt="Pasta and Italian lunch favourites from Skymark Eatery by Caffe E Pranzo"
        primaryCta={{ label: "Order pickup", href: "/menu" }}
        secondaryCta={{ label: "Browse catering", href: "/catering" }}
        infoLine={
          <p>
            <a href={BUSINESS_INFO.phoneHref} className="font-semibold text-white">
              {BUSINESS_INFO.phone}
            </a>
            <span className="mx-2 text-white/35">·</span>
            {BUSINESS_INFO.hoursLabel}
          </p>
        }
      />

      <Section tone="light" withMotion className="border-b border-[rgba(26,18,14,0.08)]">
        <div>
          <p className="section-kicker">Category showcase</p>
          <h2 className="mt-3 max-w-xl text-[#1f1410]">The weekday line, curated by appetite.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {signatureBlocks.map((block) => (
              <article
                key={block.title}
                className="group section-shell overflow-hidden rounded-sm transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="image-wrapper ratio-card">
                  <img src={block.image} alt={block.imageAlt} />
                </div>
                <div className="p-5">
                  <h3 className="text-[1.35rem] text-[#1f1410]">{block.title}</h3>
                  <p className="mt-2 text-sm text-[#5c4d42]">{block.description}</p>
                  <a href={`/menu#${block.sectionId}`} className="mt-4 inline-flex items-center text-sm font-semibold text-[#8b3d2c]">
                    Explore
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted" withMotion className="border-b border-[rgba(26,18,14,0.08)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="section-kicker">Story</p>
            <h2 className="mt-3 text-[#1f1410]">Built for Mississauga lunch rhythms.</h2>
            <p className="mt-4 text-[#5c4d42]">
              Pastries and breakfast early, sandwiches and pasta through the afternoon, designed
              so pickup stays quick for Skymark offices and Airport Corporate Centre teams.
            </p>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href="/menu">View full menu</Link>
              </Button>
            </div>
          </div>
          <div className="image-wrapper ratio-card rounded-sm border border-[rgba(26,18,14,0.09)]">
            <img src={SITE_IMAGES.vealSandwich} alt="Hot sandwich from the lunch line at Skymark Eatery" />
          </div>
        </div>
      </Section>

      <Section tone="dark" withMotion className="border-b border-black/35">
        <div className="grid gap-9 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <p className="section-kicker text-[#d4a990]">Catering highlight</p>
            <h2 className="mt-3 text-white">Buffets and trays when guest counts are real.</h2>
            <p className="mt-4 text-[#d0c0b4]">{CATERING_HELPER_TEXT}</p>
            <ul className="mt-8 space-y-4 border-l border-white/20 pl-4">
              {featuredPackages.map((pkg) => (
                <li key={pkg.publicName} className="text-sm text-[#e8ddd4]">
                  <span className="font-serif text-lg text-white">{pkg.publicName}</span>
                  <span className="mx-2 text-white/35">·</span>
                  {pkg.pricePerPerson}
                  <span className="mx-2 text-white/35">·</span>
                  {pkg.minimumOrder}
                </li>
              ))}
            </ul>
          </div>
          <div className="image-wrapper ratio-card rounded-sm border border-white/12">
            <img
              src={SITE_IMAGES.greekSaladTray}
              alt="Catering salad and tray spread prepared at Skymark Eatery by Caffe E Pranzo"
            />
          </div>
        </div>
      </Section>

      <Section tone="light" withMotion className="border-b border-[rgba(26,18,14,0.08)]">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="section-shell rounded-sm p-5">
            <MapPin className="h-4 w-4 text-[#8b3d2c]" />
            <h3 className="mt-3 text-[1.25rem] text-[#1f1410]">{BUSINESS_INFO.addressLine1}</h3>
            <p className="mt-2 text-sm text-[#5c4d42]">{BUSINESS_INFO.addressLine2}</p>
          </article>
          <article className="section-shell rounded-sm p-5">
            <Clock3 className="h-4 w-4 text-[#8b3d2c]" />
            <h3 className="mt-3 text-[1.25rem] text-[#1f1410]">Weekday hours</h3>
            <p className="mt-2 text-sm text-[#5c4d42]">Monday to Friday, 7:30 AM to 4:30 PM.</p>
          </article>
          <article className="section-shell rounded-sm p-5">
            <Star className="h-4 w-4 text-[#8b3d2c]" />
            <h3 className="mt-3 text-[1.25rem] text-[#1f1410]">Trusted by nearby offices</h3>
            <p className="mt-2 text-sm text-[#5c4d42]">Fast pickup, reliable tray portions, and easy catering support.</p>
          </article>
        </div>
      </Section>

      <Section tone="dark" withMotion className="text-center">
        <p className="section-kicker text-[#c49a7e]">Ready when you are</p>
        <h2 className="mt-3 mx-auto text-white">Pickup today, or a catering plan for the room.</h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/menu">Order pickup</Link>
          </Button>
          <Button variant="outline" className="border-white/22 bg-transparent text-[#f2e8dc] hover:bg-white/10" asChild>
            <Link href="/catering#inquire">Catering inquiry</Link>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}
