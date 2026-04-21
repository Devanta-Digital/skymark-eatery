import { useMemo } from "react";
import { Link } from "wouter";
import { MenuItem, useListMenuItems } from "@workspace/api-client-react";
import {
  ArrowRight,
  Clock,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { MAIN_MENU_SECTIONS, StaticMenuItem } from "@/content/menu";
import { BUSINESS_INFO, SITE_IMAGES } from "@/content/site";
import {
  breadcrumbStructuredData,
  restaurantStructuredData,
  useSeo,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

function formatPrice(staticPrice: string, liveItem?: MenuItem) {
  if (!liveItem) return staticPrice;
  return `$${Number(liveItem.price).toFixed(2)}`;
}

type OrderControlsProps = {
  liveItem?: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onIncrement: (item: MenuItem) => void;
  onDecrement: (item: MenuItem) => void;
};

function OrderControls({
  liveItem,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: OrderControlsProps) {
  if (!liveItem) return null;

  if (!quantity) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded border border-[rgba(36,24,18,0.12)] bg-white px-2.5 font-sans text-xs font-semibold text-[#2a1f19] hover:bg-[#f4ebe3]"
        onClick={() => onAdd(liveItem)}
      >
        <ShoppingBag className="mr-1 h-3 w-3" />
        Add
      </Button>
    );
  }

  return (
    <div className="inline-flex items-center rounded border border-[rgba(36,24,18,0.12)] bg-[#f4ebe3]">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center text-[#6b4434] hover:bg-[#e8d9cf]"
        onClick={() => onDecrement(liveItem)}
        aria-label={`Decrease quantity for ${liveItem.name}`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[2rem] text-center font-sans text-xs font-semibold text-[#2a1f19]">
        {quantity}
      </span>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center text-[#6b4434] hover:bg-[#e8d9cf]"
        onClick={() => onIncrement(liveItem)}
        aria-label={`Increase quantity for ${liveItem.name}`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

type MenuRowProps = {
  item: StaticMenuItem;
  liveItem?: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onIncrement: (item: MenuItem) => void;
  onDecrement: (item: MenuItem) => void;
  compact?: boolean;
  showDescription?: boolean;
};

function MenuRow({
  item,
  liveItem,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  compact = false,
  showDescription = true,
}: MenuRowProps) {
  const price = formatPrice(item.price, liveItem);
  return (
    <div
      className={cn(
        "group flex gap-3 border-b border-[rgba(36,24,18,0.07)] last:border-b-0 sm:gap-4",
        compact ? "px-4 py-2.5 sm:px-5 sm:py-3" : "px-5 py-3.5 sm:px-6 sm:py-4",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-end gap-2">
          <h3
            className={cn(
              "shrink-0 font-serif tracking-tight text-[#1c120e]",
              compact
                ? "max-w-[68%] truncate text-[1.02rem] sm:max-w-[72%]"
                : "text-lg",
            )}
          >
            {item.name}
          </h3>
          <span
            className="mb-[0.32rem] min-h-px min-w-[0.5rem] flex-1 border-b border-dotted border-[rgba(36,24,18,0.22)]"
            aria-hidden
          />
          <span className="shrink-0 font-serif text-base tabular-nums text-[#1c120e] sm:text-[1.05rem]">
            {price}
          </span>
        </div>
        {item.featured ? (
          <span className="mt-1 inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9c4f38]">
            House favourite
          </span>
        ) : null}
        {showDescription && item.description ? (
          <p
            className={cn(
              "mt-1 font-sans leading-snug text-[#5c4d42]",
              compact ? "text-[12px]" : "text-sm",
            )}
          >
            {item.description}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col justify-end pb-0.5">
        <OrderControls
          liveItem={liveItem}
          quantity={quantity}
          onAdd={onAdd}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>
    </div>
  );
}

function AddOnGrid({
  title,
  items,
}: {
  title: string;
  items: StaticMenuItem[];
}) {
  return (
    <div className="menu-paper">
      <div className="border-b border-[rgba(36,24,18,0.08)] px-5 py-3">
        <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#7a4a38]">
          {title}
        </p>
      </div>
      <div className="divide-y divide-[rgba(36,24,18,0.06)]">
        {items.map((entry) => (
          <div
            key={entry.name}
            className="flex items-start justify-between gap-4 px-5 py-3"
          >
            <div className="min-w-0">
              <p className="font-serif text-sm text-[#1c120e]">{entry.name}</p>
              <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#6d5c50]">
                {entry.description}
              </p>
            </div>
            <p className="shrink-0 font-serif text-sm tabular-nums text-[#1c120e]">
              {entry.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSection(id: string) {
  return MAIN_MENU_SECTIONS.find((section) => section.id === id);
}

function SectionIntro({
  eyebrow,
  title,
  description,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
}) {
  return (
    <header className="mb-5 max-w-2xl border-l-2 border-[#9c4f38]/80 pl-4 sm:mb-6 sm:pl-5">
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#1c120e] sm:text-[2.05rem]">
        {title}
      </h2>
      <p className="mt-2.5 font-sans text-sm leading-relaxed text-[#5c4d42] sm:text-base">
        {description}
      </p>
      {note ? (
        <p className="mt-2 font-sans text-xs text-[#7a4a38] sm:text-sm">
          {note}
        </p>
      ) : null}
    </header>
  );
}

export default function Menu() {
  const { data: menuItems } = useListMenuItems(
    { available: true },
    { query: { queryKey: ["menu-page-live-items", { available: true }] } },
  );
  const { addItem, items, updateQuantity, removeItem } = useCart();

  useSeo({
    title:
      "Menu — Skymark Eatery by Caffe E Pranzo | Italian Lunch & Takeout, Mississauga",
    description:
      "Weekday Italian takeout menu on Skymark Ave, Mississauga (near Pearson): breakfast, sandwiches, salads, pizza, pasta, and sides. Order pickup online when available or call the kitchen.",
    path: "/menu",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
    structuredData: [
      restaurantStructuredData(),
      breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
      ]),
    ],
  });

  const safeItems = Array.isArray(menuItems) ? menuItems : [];

  const liveItemMap = useMemo(
    () => new Map(safeItems.map((entry) => [entry.name.toLowerCase(), entry])),
    [safeItems],
  );

  const getLiveItem = (name: string) => liveItemMap.get(name.toLowerCase());
  const getCartQuantity = (itemId?: number) =>
    items.find((entry) => entry.menuItem.id === itemId)?.quantity ?? 0;

  const handleAdd = (item: MenuItem) => addItem(item);
  const handleIncrement = (item: MenuItem) =>
    updateQuantity(item.id, getCartQuantity(item.id) + 1);
  const handleDecrement = (item: MenuItem) => {
    const quantity = getCartQuantity(item.id);
    if (quantity <= 1) {
      removeItem(item.id);
      return;
    }
    updateQuantity(item.id, quantity - 1);
  };

  const onlineOrderingReady = safeItems.length > 0;

  const featuredPicks = useMemo(() => {
    const rows: {
      section: (typeof MAIN_MENU_SECTIONS)[number];
      item: StaticMenuItem;
    }[] = [];
    for (const section of MAIN_MENU_SECTIONS) {
      for (const entry of section.items ?? []) {
        if (entry.featured) rows.push({ section, item: entry });
      }
    }
    return rows.slice(0, 8);
  }, []);

  const breakfast = getSection("breakfast");
  const sandwiches = getSection("sandwiches");
  const salads = getSection("salads");
  const sides = getSection("sides");
  const pizza = getSection("pizza");
  const pasta = getSection("pasta");

  if (!breakfast || !sandwiches || !salads || !sides || !pizza || !pasta) {
    return null;
  }

  return (
    <Layout>
      <Hero
        eyebrow="Takeout menu"
        title="Italian lunch, built for a Mississauga workday."
        subtitle={`Breakfast through pasta and pizza, made in-house on Skymark Ave. ${
          onlineOrderingReady
            ? "Add items where offered, or call for same-day help."
            : "Browse here, then call the kitchen to order."
        }`}
        imageSrc={SITE_IMAGES.menuHero}
        imageAlt="Italian lunch favourites from Skymark Eatery by Caffe E Pranzo"
        primaryCta={{ label: "Call to order", href: BUSINESS_INFO.phoneHref }}
        secondaryCta={{ label: "Catering", href: "/catering" }}
        infoLine={
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#deb39a]" />
            Mon–Fri · 7:30a–4:30p · {BUSINESS_INFO.addressLine1}
          </span>
        }
      />

      {featuredPicks.length > 0 ? (
        <Section tone="light" density="airy" className="border-b border-[rgba(26,18,14,0.08)]">
          <div>
            <p className="section-kicker">House favourites</p>
            <h2 className="brand-rail mt-4 max-w-2xl text-[#1f1410]">
              Start with what the line orders most.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#5c4d42]">
              Curated picks across breakfast, sandwiches, salads, and mains — same prices as the full menu below.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featuredPicks.map(({ section, item }) => {
                const liveItem = getLiveItem(item.name);
                return (
                  <div
                    key={`${section.id}-${item.name}`}
                    className="section-shell flex flex-col justify-between gap-4 rounded-sm p-4 sm:p-5"
                  >
                    <div>
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a4a38]">
                        {section.shortLabel}
                      </p>
                      <h3 className="mt-2 font-serif text-lg text-[#1c120e]">{item.name}</h3>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-[#5c4d42] sm:text-sm">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-end justify-between gap-3 border-t border-[rgba(26,18,14,0.08)] pt-3">
                      <span className="font-serif text-lg tabular-nums text-[#1c120e]">
                        {formatPrice(item.price, liveItem)}
                      </span>
                      {liveItem ? (
                        <OrderControls
                          liveItem={liveItem}
                          quantity={getCartQuantity(liveItem.id)}
                          onAdd={handleAdd}
                          onIncrement={handleIncrement}
                          onDecrement={handleDecrement}
                        />
                      ) : (
                        <a
                          href={BUSINESS_INFO.phoneHref}
                          className="shrink-0 rounded-md border border-[rgba(26,18,14,0.12)] bg-[#faf6f1] px-3 py-1.5 font-sans text-[11px] font-semibold text-[#1f1410] hover:border-[hsl(var(--primary))]/40 hover:text-[hsl(var(--primary))]"
                        >
                          Call kitchen
                        </a>
                      )}
                    </div>
                    <a
                      href={`/menu#${section.id}`}
                      className="font-sans text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline"
                    >
                      More in {section.shortLabel.toLowerCase()}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
      ) : null}

      <StickySectionNav
        label="Menu sections"
        items={MAIN_MENU_SECTIONS.map((section) => ({
          id: section.id,
          label: section.shortLabel,
        }))}
        cta={
          <a
            href={BUSINESS_INFO.phoneHref}
            className="whitespace-nowrap pb-1 font-sans text-[11px] font-semibold text-[#6d5c50] hover:text-[#8b3d2c]"
          >
            {BUSINESS_INFO.phone}
          </a>
        }
      />

      <div className="container mx-auto max-w-6xl px-4 py-2">
        <p className="font-sans text-[11px] leading-relaxed text-[#6d5c50] sm:text-xs">
          Trays and buffets live on{" "}
          <Link href="/catering" className="font-semibold text-[#8b3d2c]">
            catering
          </Link>
          . Below is weekday takeout.
          <Link
            href="/catering"
            className="ml-2 inline-flex items-center gap-0.5 font-semibold text-[#1f1410] hover:text-[#8b3d2c]"
          >
            Catering menu
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>

      <section className="py-10 sm:py-12">
        <div className="container mx-auto max-w-6xl space-y-14 px-4 sm:space-y-16">
          <section id={breakfast.id} className="anchor-section">
            <SectionIntro
              eyebrow={breakfast.eyebrow}
              title={breakfast.title}
              description={breakfast.description}
              note={breakfast.note}
            />
            <div className="menu-paper max-w-3xl overflow-hidden divide-y divide-[rgba(36,24,18,0.07)]">
              {(breakfast.items ?? []).map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={entry.featured}
                  />
                );
              })}
            </div>
          </section>

          <section id={sandwiches.id} className="anchor-section">
            <SectionIntro
              eyebrow={sandwiches.eyebrow}
              title={sandwiches.title}
              description={sandwiches.description}
            />
            <div className="menu-paper max-w-3xl divide-y divide-[rgba(36,24,18,0.06)]">
              {sandwiches.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    showDescription={entry.featured}
                  />
                );
              })}
            </div>
            {sandwiches.addOns && sandwiches.addOnsTitle ? (
              <div className="mt-8 max-w-3xl">
                <AddOnGrid
                  title={sandwiches.addOnsTitle}
                  items={sandwiches.addOns}
                />
              </div>
            ) : null}
          </section>

          <section id={salads.id} className="anchor-section">
            <SectionIntro
              eyebrow={salads.eyebrow}
              title={salads.title}
              description={salads.description}
            />
            <div className="menu-paper divide-y divide-[rgba(36,24,18,0.06)]">
              {salads.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={false}
                  />
                );
              })}
            </div>
            {salads.addOns && salads.addOnsTitle ? (
              <div className="mt-6 max-w-xl">
                <AddOnGrid title={salads.addOnsTitle} items={salads.addOns} />
              </div>
            ) : null}
          </section>

          <section id={sides.id} className="anchor-section">
            <SectionIntro
              eyebrow={sides.eyebrow}
              title={sides.title}
              description={sides.description}
            />
            <div className="menu-paper max-w-3xl divide-y divide-[rgba(36,24,18,0.07)] overflow-hidden">
              {sides.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={false}
                  />
                );
              })}
            </div>
          </section>

          <section id={pizza.id} className="anchor-section">
            <SectionIntro
              eyebrow={pizza.eyebrow}
              title={pizza.title}
              description={pizza.description}
            />
            <div className="menu-paper max-w-3xl divide-y divide-[rgba(36,24,18,0.06)]">
              {pizza.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={entry.featured}
                  />
                );
              })}
            </div>
            {pizza.addOns && pizza.addOnsTitle ? (
              <div className="mt-8 max-w-3xl space-y-3">
                <AddOnGrid title={pizza.addOnsTitle} items={pizza.addOns} />
                <p className="font-sans text-xs leading-relaxed text-[#5c4d42]">
                  Party-size pies stay easy for office drops — ask when you call
                  if you need timing help.
                </p>
              </div>
            ) : null}
          </section>

          <section id={pasta.id} className="anchor-section">
            <div className="menu-paper p-5 sm:p-7">
              <SectionIntro
                eyebrow={pasta.eyebrow}
                title={pasta.title}
                description={pasta.description}
                note={pasta.note}
              />
              <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
                {pasta.pastaGroups?.map((group) => (
                  <div
                    key={group.title}
                    className="overflow-hidden rounded-sm border border-[rgba(36,24,18,0.1)] bg-[#f7f2eb]"
                  >
                    <div className="border-b border-[rgba(36,24,18,0.08)] bg-[#2a1f19] px-4 py-2.5">
                      <h3 className="font-serif text-base tracking-tight text-[#f4ebe3]">
                        {group.title}
                      </h3>
                    </div>
                    <div className="divide-y divide-[rgba(36,24,18,0.07)]">
                      {group.items.map((entry) => {
                        const liveItem = getLiveItem(entry.name);
                        return (
                          <MenuRow
                            key={entry.name}
                            item={entry}
                            liveItem={liveItem}
                            quantity={getCartQuantity(liveItem?.id)}
                            onAdd={handleAdd}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                            compact
                            showDescription={false}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {pasta.signatureItems ? (
                <div className="mt-10 border-t border-[rgba(36,24,18,0.08)] pt-8">
                  <p className="section-kicker">Signature plates</p>
                  <p className="mt-2 max-w-xl font-sans text-sm text-[#5c4d42]">
                    Fuller plates when you do not want to build a custom pasta
                    bowl.
                  </p>
                  <div className="mt-4 divide-y divide-[rgba(36,24,18,0.06)] rounded-md border border-[rgba(36,24,18,0.08)] bg-[#faf7f3]">
                    {pasta.signatureItems.map((entry) => {
                      const liveItem = getLiveItem(entry.name);
                      return (
                        <MenuRow
                          key={entry.name}
                          item={entry}
                          liveItem={liveItem}
                          quantity={getCartQuantity(liveItem?.id)}
                          onAdd={handleAdd}
                          onIncrement={handleIncrement}
                          onDecrement={handleDecrement}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>

      <Section tone="muted" className="border-t border-[rgba(26,18,14,0.08)] py-12">
        <div>
          <div className="flex flex-col gap-6 border border-[rgba(26,18,14,0.1)] bg-[hsla(34,38%,97%,0.85)] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Larger orders</p>
              <h2 className="mt-2 font-serif text-2xl text-[#1c120e] sm:text-3xl">
                Trays, platters, and buffets stay on catering.
              </h2>
              <p className="mt-2 max-w-xl font-sans text-sm text-[#5c4d42]">
                One place for appetizers through dessert, with per-person
                packages when that fits your event.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                className="rounded-md bg-[#9c4f38] font-sans text-white hover:bg-[#7a3c2a]"
                asChild
              >
                <Link href="/catering">
                  Catering menu
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-md border-[rgba(36,24,18,0.12)] bg-white font-sans"
                asChild
              >
                <a href={BUSINESS_INFO.phoneHref}>
                  <Phone className="mr-2 h-4 w-4" />
                  {BUSINESS_INFO.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
