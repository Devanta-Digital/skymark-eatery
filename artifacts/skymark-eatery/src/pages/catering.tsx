import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from "wouter";
import { CheckCircle2, Mail, Phone, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  SITE_IMAGES,
} from "@/content/site";
import {
  BUFFET_PACKAGES,
  CATERING_INTRO,
  CATERING_NOTES,
  CATERING_OVERVIEW,
  CATERING_SECTIONS,
  DIETARY_BADGES,
} from "@/content/catering";
import {
  breadcrumbStructuredData,
  restaurantStructuredData,
  useSeo,
} from "@/lib/seo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const cateringSchema = z.object({
  companyName: z.string().min(2, "Company or contact name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.string().min(1, "Guest count is required"),
  eventType: z.string().min(1, "Select an event type"),
  deliveryType: z.string().min(1, "Select pickup or delivery"),
  notes: z.string().optional(),
});

type CateringValues = z.infer<typeof cateringSchema>;

const anchorLinks = [
  { id: "packages", label: "Packages" },
  { id: "appetizers", label: "Appetizers" },
  { id: "platters", label: "Platters" },
  { id: "hot-catering", label: "Hot trays" },
  { id: "pizza", label: "Pizza" },
  { id: "desserts", label: "Desserts" },
  { id: "dietary", label: "Dietary" },
  { id: "inquire", label: "Inquire" },
];

function metaLine(serving?: string, dietary?: string[]) {
  return [serving, ...(dietary ?? [])].filter(Boolean).join(" • ");
}

function CateringRows({
  sectionId,
  tone = "tray",
}: {
  sectionId: string;
  tone?: "tray" | "menu";
}) {
  const section = CATERING_SECTIONS.find((entry) => entry.id === sectionId);
  if (!section) return null;

  const tray = tone === "tray";

  return (
    <article
      id={section.id}
      className={cn(
        "anchor-section overflow-hidden rounded-sm border border-[rgba(36,24,18,0.1)]",
        tray
          ? "border-l-[3px] border-l-[#9c4f38] bg-[#fdfaf6] shadow-[0_12px_32px_rgba(28,18,14,0.05)]"
          : "menu-paper",
      )}
    >
      <div
        className={cn(
          "border-b border-[rgba(36,24,18,0.08)] px-5 py-3.5 sm:px-6 sm:py-4",
          tray && "bg-[#f4ebe3]/80",
        )}
      >
        <h3
          className={cn(
            "font-serif tracking-tight text-[#1c120e]",
            tray ? "text-xl sm:text-2xl" : "text-2xl sm:text-[1.65rem]",
          )}
        >
          {section.title}
        </h3>
        <p className="mt-2 max-w-3xl font-sans text-sm leading-relaxed text-[#5c4d42]">
          {section.description}
        </p>
      </div>

      <div className="divide-y divide-[rgba(36,24,18,0.07)]">
        {section.items.map((item) => (
          <div
            key={`${section.id}-${item.name}`}
            className="flex flex-col gap-1.5 px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-3.5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-end gap-2">
                <h4 className="min-w-0 font-serif text-[0.98rem] text-[#1c120e] sm:text-lg">
                  {item.name}
                </h4>
                <span
                  className="mb-[0.28rem] min-h-px min-w-[0.5rem] flex-1 border-b border-dotted border-[rgba(36,24,18,0.2)] sm:mb-[0.32rem]"
                  aria-hidden
                />
                <p className="shrink-0 font-serif text-[0.98rem] tabular-nums text-[#1c120e] sm:text-base">
                  {item.price}
                </p>
              </div>
              <p className="mt-1 font-sans text-sm leading-relaxed text-[#5c4d42]">
                {item.description}
              </p>
              {metaLine(item.serving, item.dietary) ? (
                <p className="mt-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-[#7a4a38]">
                  {metaLine(item.serving, item.dietary)}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function Catering() {
  const [submitted, setSubmitted] = useState(false);
  const [occasion, setOccasion] = useState("office-lunch");

  useSeo({
    title:
      "Catering & Buffets — Skymark Eatery by Caffe E Pranzo | Mississauga Office & Event Italian",
    description:
      "Italian office catering on Skymark Avenue, Mississauga: buffet packages, hot trays, sandwich platters, appetizers, desserts, and inquiry support from Skymark Eatery by Caffe E Pranzo.",
    path: "/catering",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
    structuredData: [
      restaurantStructuredData(),
      breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: "Catering", path: "/catering" },
      ]),
    ],
  });

  const form = useForm<CateringValues>({
    resolver: zodResolver(cateringSchema),
    defaultValues: {
      deliveryType: "pickup",
      eventType: "office-lunch",
    },
  });

  const onSubmit = (values: CateringValues) => {
    const subject = encodeURIComponent(
      `Catering Inquiry - ${values.companyName} - ${values.eventDate}`,
    );
    const body = encodeURIComponent(
      [
        `Company / Organization: ${values.companyName}`,
        `Contact Name: ${values.contactName}`,
        `Email: ${values.email}`,
        `Phone: ${values.phone}`,
        `Event Date: ${values.eventDate}`,
        `Guest Count: ${values.guestCount}`,
        `Event Type: ${values.eventType}`,
        `Pickup or Delivery: ${values.deliveryType}`,
        "",
        "Event Notes:",
        values.notes?.trim() || "None provided",
      ].join("\n"),
    );

    window.location.href = `${BUSINESS_INFO.emailHref}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    toast.success("Your catering email draft is ready to send.");
  };

  return (
    <Layout>
      <Hero
        eyebrow="Events & offices"
        title="Italian catering that reads like a menu, not a spreadsheet."
        subtitle={CATERING_INTRO}
        imageSrc={SITE_IMAGES.cateringHero}
        imageAlt="Catering salads and trays from Skymark Eatery by Caffe E Pranzo"
        primaryCta={{ label: "Buffet packages", href: "/catering#packages" }}
        secondaryCta={{ label: "Request catering", href: "/catering#inquire" }}
      />

      <StickySectionNav
        label="Catering sections"
        items={anchorLinks}
        cta={
          <a
            href="#inquire"
            className="whitespace-nowrap pb-1 font-sans text-[11px] font-semibold text-[#6d5c50] hover:text-[#8b3d2c]"
          >
            Get a quote
          </a>
        }
      />

      <Section tone="light" withMotion className="py-8">
        <div className="section-shell rounded-sm p-4 sm:p-6">
          <p className="section-kicker">Occasion selector</p>
          <Tabs value={occasion} onValueChange={setOccasion} className="mt-4">
            <TabsList className="h-auto flex-wrap bg-[hsl(34,30%,92%)] p-1">
              <TabsTrigger value="office-lunch">Office lunch</TabsTrigger>
              <TabsTrigger value="meeting">Meeting</TabsTrigger>
              <TabsTrigger value="family-event">Family event</TabsTrigger>
              <TabsTrigger value="corporate-event">Corporate event</TabsTrigger>
            </TabsList>
            <TabsContent value="office-lunch">
              <p className="mt-3 text-sm text-[#5c4d42]">
                Fast setup, easy portions, and dependable timing for teams near Pearson and Skymark offices.
              </p>
            </TabsContent>
            <TabsContent value="meeting">
              <p className="mt-3 text-sm text-[#5c4d42]">
                Balanced trays and buffet combinations that stay practical for meeting schedules and room turnovers.
              </p>
            </TabsContent>
            <TabsContent value="family-event">
              <p className="mt-3 text-sm text-[#5c4d42]">
                Comfort-first combinations with generous servings and flexible trays for mixed preferences.
              </p>
            </TabsContent>
            <TabsContent value="corporate-event">
              <p className="mt-3 text-sm text-[#5c4d42]">
                Presentation-forward package planning with appetizers, mains, and add-ons for hosted events.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      <section className="border-b border-[rgba(26,18,14,0.06)] section-muted py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[rgba(26,18,14,0.1)]">
            {CATERING_OVERVIEW.map((item) => (
              <div key={item.title} className="sm:px-5">
                <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[#8b4a3a]">
                  {item.title}
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#4a3d35]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="packages"
        className="anchor-section bg-[#f3eadf] py-16 sm:py-20"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="section-kicker">Buffet Catering Packages</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Ready-made buffet options with clear per-person pricing and
                minimums.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#6d5748] sm:text-base">
              Start here if you want the easiest path for office lunches,
              meetings, and family-style events. Each package keeps the menu,
              guest minimum, and price per person easy to compare.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {BUFFET_PACKAGES.map((pkg) => (
              <article
                key={pkg.publicName}
                className="overflow-hidden rounded-sm border border-[rgba(36,24,18,0.12)] bg-[#fdfaf6] shadow-[0_16px_40px_rgba(28,18,14,0.07)]"
              >
                <div className="relative border-b border-[rgba(36,24,18,0.1)] bg-[linear-gradient(135deg,#2a1f19_0%,#3d241c_48%,#5c3228_100%)] px-5 py-4 text-[#f4ebe3] sm:px-6 sm:py-5">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,#e8b596,transparent)] opacity-80" />
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-[#e0b69a]">
                        Flagship buffet
                      </p>
                      <h3 className="mt-2 font-serif text-[1.45rem] leading-tight sm:text-[1.85rem]">
                        {pkg.publicName}
                      </h3>
                      <p className="mt-2.5 max-w-xl font-sans text-sm leading-relaxed text-[#d8c8bc]">
                        {pkg.summary}
                      </p>
                    </div>
                    <div className="shrink-0 rounded-sm border border-white/18 bg-black/25 px-4 py-3 text-left backdrop-blur-sm">
                      <p className="font-sans text-[0.55rem] uppercase tracking-[0.22em] text-[#c9a896]">
                        Per person
                      </p>
                      <p className="mt-1 font-serif text-xl text-white sm:text-2xl">
                        {pkg.pricePerPerson.replace(" per person", "")}
                        <span className="ml-1 font-sans text-xs font-normal text-white/65">
                          / guest
                        </span>
                      </p>
                      <p className="mt-2 border-t border-white/10 pt-2 font-sans text-[11px] leading-snug text-[#e8d5cc]">{pkg.minimumOrder}</p>
                      <p className="mt-1 font-sans text-[11px] leading-snug text-[#e8d5cc]">Serves: {pkg.feeds}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_minmax(0,200px)]">
                  <div>
                    <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-[#7a4a38]">
                      Included
                    </p>
                    <ul className="mt-3 space-y-1.5 border-l-2 border-[#9c4f38]/55 pl-3.5 font-sans text-[13px] leading-snug text-[#3d3028] sm:text-sm">
                      {pkg.includedDishes.map((dish) => (
                        <li key={dish}>{dish}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between border-t border-[rgba(36,24,18,0.08)] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div>
                      <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#7a4a38]">
                        Yield
                      </p>
                      <p className="mt-2 font-serif text-lg text-[#1c120e]">
                        {pkg.feeds}
                      </p>
                    </div>
                    <p className="mt-4 font-sans text-[11px] leading-relaxed text-[#6d5c50] lg:mt-0">
                      Suited to office lunches and hosted events in Mississauga,
                      including groups near Pearson looking for pickup-friendly
                      timing.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 sm:py-16">
        <div className="container mx-auto grid max-w-6xl gap-12 px-4">
          <section className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
            <div className="max-w-sm">
              <div className="section-kicker">Reception bites</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Appetizers and platters that work for mingling and lighter
                setups.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5748]">
                Start with hors d&apos;oeuvres, bruschetta, meatballs, sandwich
                platters, and grazing-style trays for hosted lunches and casual
                event service.
              </p>
            </div>

            <div className="grid gap-6">
              <CateringRows sectionId="appetizers" />
              <CateringRows sectionId="platters" />
            </div>
          </section>

          <section
            id="hot-catering"
            className="anchor-section grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start"
          >
            <div className="max-w-sm">
              <div className="section-kicker">Hot catering</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Pasta trays, mains, salads, and sides that build out the meal.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5748]">
                Use these sections when you want to mix and match hot trays,
                seafood, salads, and dependable sides around a package or custom
                event menu.
              </p>
            </div>

            <div className="grid gap-6">
              <CateringRows sectionId="pasta-baked" />
              <div className="grid gap-6 xl:grid-cols-2">
                <CateringRows sectionId="seafood" />
                <div className="grid gap-6">
                  <CateringRows sectionId="salads" />
                  <CateringRows sectionId="sides" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
            <div className="max-w-sm">
              <div className="section-kicker">Finishing touches</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Pizza trays, desserts, beverages, and extras for the full order.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5748]">
                Round out lunch spreads and event tables with party pizza,
                sweets, bread, bottled drinks, and service add-ons.
              </p>
            </div>

            <div className="grid gap-6">
              <CateringRows sectionId="pizza" />
              <div className="grid gap-6 xl:grid-cols-2">
                <CateringRows sectionId="desserts" />
                <CateringRows sectionId="extras" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section
        id="dietary"
        className="anchor-section border-y border-[rgba(79,50,34,0.08)] bg-[#f3eadf] py-16"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="max-w-xl">
              <div className="section-kicker">Dietary accommodations</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Tell us what your group needs and we&apos;ll help shape the
                menu.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#6d5748]">
                Dietary requests, tray combinations, and service questions are
                easiest to sort out before the event. Include them in your
                inquiry and we can guide you toward the right mix.
              </p>
            </div>

            <div className="grid gap-5">
              <div className="border border-[rgba(26,18,14,0.1)] bg-[hsla(34,38%,98%,0.95)] p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#8b4f39]" />
                  <h3 className="text-2xl text-[#2d1e18]">
                    Common accommodations
                  </h3>
                </div>
                <ul className="mt-5 columns-1 gap-x-8 font-sans text-sm leading-relaxed text-[#4a3d35] sm:columns-2">
                  {DIETARY_BADGES.map((badge) => (
                    <li key={badge} className="break-inside-avoid py-1">
                      <span className="mr-2 text-[#9c4f38]">·</span>
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-[rgba(26,18,14,0.1)] bg-[hsla(34,38%,98%,0.95)] p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#8b4f39]" />
                  <h3 className="text-2xl text-[#2d1e18]">Good to know</h3>
                </div>
                <div className="mt-5 space-y-4">
                  {CATERING_NOTES.map((note) => (
                    <p key={note} className="text-sm leading-7 text-[#6d5748]">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="inquire"
        className="anchor-section bg-background py-16 sm:py-20"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <div className="section-kicker">Request Catering</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Tell us what you&apos;re planning.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#6d5748]">
                Share the date, guest count, and event details. We&apos;ll help
                you narrow the right mix of buffet packages, trays, platters,
                desserts, beverages, and extras.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#6d5748]">
                {CATERING_HELPER_TEXT}
              </p>

              <div className="mt-8 grid gap-4">
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="rounded-md border border-[rgba(26,18,14,0.1)] bg-[hsla(34,38%,97%,0.95)] p-5 transition-colors hover:border-[rgba(139,79,57,0.25)]"
                >
                  <div className="flex items-center gap-3 text-[#2d1e18]">
                    <Phone className="h-5 w-5 text-[#8b4f39]" />
                    <div>
                      <div className="text-lg font-semibold">
                        Call the restaurant
                      </div>
                      <div className="text-sm text-[#6d5748]">
                        {BUSINESS_INFO.phone}
                      </div>
                    </div>
                  </div>
                </a>
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="rounded-md border border-[rgba(26,18,14,0.1)] bg-[hsla(34,38%,97%,0.95)] p-5 transition-colors hover:border-[rgba(139,79,57,0.25)]"
                >
                  <div className="flex items-center gap-3 text-[#2d1e18]">
                    <Mail className="h-5 w-5 text-[#8b4f39]" />
                    <div>
                      <div className="text-lg font-semibold">
                        Email the team
                      </div>
                      <div className="text-sm text-[#6d5748]">
                        {BUSINESS_INFO.email}
                      </div>
                    </div>
                  </div>
                </a>
                <div className="rounded-md border border-[rgba(26,18,14,0.2)] bg-[#1a120e] p-5 text-sm leading-relaxed text-white/76">
                  Include the event date, guest count, delivery or pickup
                  preference, and any dietary requests to speed things up.
                </div>
              </div>
            </div>

            <div className="border border-[rgba(26,18,14,0.1)] bg-[hsla(34,38%,98%,0.98)] p-6 md:p-8">
              {submitted ? (
                <div className="rounded-[1.7rem] border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
                  <h3 className="mt-5 text-2xl text-[#2d1e18]">
                    Your inquiry draft is ready.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#6d5748]">
                    Your email app should now be open with the event details
                    filled in. If it did not open, you can call or email the
                    team directly.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button variant="outline" className="rounded-full" asChild>
                      <a href={BUSINESS_INFO.phoneHref}>
                        Call {BUSINESS_INFO.phone}
                      </a>
                    </Button>
                    <Button
                      className="rounded-full bg-[#8b4f39] text-white hover:bg-[#75412f]"
                      asChild
                    >
                      <a href={BUSINESS_INFO.emailHref}>Email directly</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="rounded-xl border border-[rgba(26,18,14,0.08)] bg-[hsl(33,30%,94%)] p-4">
                      <p className="section-kicker">Planner steps</p>
                      <div className="mt-2 grid gap-2 text-xs text-[#6d5748] sm:grid-cols-3">
                        <span className="rounded-md border border-[rgba(26,18,14,0.12)] bg-white px-3 py-2">1. Event basics</span>
                        <span className="rounded-md border border-[rgba(26,18,14,0.12)] bg-white px-3 py-2">2. Service preferences</span>
                        <span className="rounded-md border border-[rgba(26,18,14,0.12)] bg-white px-3 py-2">3. Notes and submit</span>
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company / organization</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="Company, team, or family name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact name</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="Your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="you@company.ca"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="(905) 555-5555"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest count</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="Approximate number of guests"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="office-lunch">
                                  Office lunch
                                </SelectItem>
                                <SelectItem value="meeting">
                                  Meeting or training
                                </SelectItem>
                                <SelectItem value="family-event">
                                  Family event
                                </SelectItem>
                                <SelectItem value="corporate-event">
                                  Corporate event
                                </SelectItem>
                                <SelectItem value="celebration">
                                  Celebration
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup or delivery</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none">
                                  <SelectValue placeholder="Select pickup or delivery" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pickup">Pickup</SelectItem>
                                <SelectItem value="delivery">
                                  Delivery
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event notes</FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-[150px] rounded-2xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 py-3 shadow-none"
                              placeholder="Tell us about menu preferences, timing, dietary needs, setup details, or anything else that would help."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full bg-[#8b4f39] text-white hover:bg-[#75412f]"
                    >
                      Start Catering Inquiry
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[rgba(26,18,14,0.08)] bg-[hsl(33,28%,90%)] py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6 border border-[rgba(26,18,14,0.1)] bg-[hsla(34,38%,97%,0.85)] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Weekday lunch</p>
              <h2 className="mt-2 font-serif text-2xl text-[#1c120e] sm:text-3xl">
                Takeout orders use the main menu.
              </h2>
              <p className="mt-2 max-w-xl font-sans text-sm text-[#5c4d42]">
                Catering stays here; sandwiches and pasta for one stay on the
                takeout menu.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                className="rounded-md bg-[#2a1f19] font-sans text-white hover:bg-black"
                asChild
              >
                <Link href="/menu">Open takeout menu</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-md border-[rgba(36,24,18,0.12)] bg-white font-sans"
                asChild
              >
                <a href={BUSINESS_INFO.phoneHref}>Call the kitchen</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
