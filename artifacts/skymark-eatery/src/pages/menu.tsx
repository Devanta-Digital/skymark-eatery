import { useMemo } from "react";
import { Link } from "wouter";
import { MenuItem, useListMenuItems } from "@workspace/api-client-react";
import { ArrowRight, Clock, Minus, Phone, Plus, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/layout";
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

function splitItems(items: StaticMenuItem[]) {
  if (items.length <= 6) return [items];

  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

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
  return (
    <div
      className={cn(
        "group flex gap-4 border-b border-[rgba(36,24,18,0.06)] last:border-b-0",
        compact ? "px-4 py-3 sm:px-5" : "px-5 py-4 sm:px-6",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3
            className={cn(
              "font-serif tracking-tight text-[#1c120e]",
              compact ? "text-[1.02rem]" : "text-lg",
            )}
          >
            {item.name}
          </h3>
          {item.featured ? (
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[#9c4f38]">
              House favourite
            </span>
          ) : null}
        </div>
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
      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
        <span className="font-serif text-base tabular-nums text-[#1c120e] sm:text-[1.05rem]">
          {formatPrice(item.price, liveItem)}
        </span>
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
    <header className="mb-6 max-w-2xl">
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#1c120e] sm:text-[2.1rem]">
        {title}
      </h2>
      <p className="mt-3 font-sans text-sm leading-relaxed text-[#5c4d42] sm:text-base">
        {description}
      </p>
      {note ? (
        <p className="mt-2 font-sans text-xs text-[#7a4a38] sm:text-sm">{note}</p>
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
      "Skymark Eatery by Caffe E Pranzo weekday menu: breakfast, sandwiches, salads, pizza, pasta, and sides. Italian takeout on Skymark Ave, Mississauga — call or order pickup online when available.",
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
      <section className="relative overflow-hidden border-b border-black/10 bg-[#16100d] text-white">
        <div className="absolute inset-0 opacity-35">
          <img
            src={SITE_IMAGES.menuHero}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(14,10,8,0.96),rgba(22,16,13,0.88)_55%,rgba(22,16,13,0.5))]" />

        <div className="relative container mx-auto px-4 py-10 sm:py-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#deb39a]">
                Takeout menu
              </p>
              <h1 className="mt-3 font-serif text-[2rem] leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.65rem]">
                Italian lunch, written for a workday.
              </h1>
              <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-[#c9b5a6] sm:text-[0.95rem]">
                Breakfast through pasta and pizza — made in-house on Skymark
                Avenue.{" "}
                {onlineOrderingReady
                  ? "Add items where offered, or call for the fastest same-day help."
                  : "Browse here, then call the kitchen to place your order."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="rounded-md bg-[#b55a3c] font-sans text-white hover:bg-[#9c4f38]"
                  asChild
                >
                  <a href={BUSINESS_INFO.phoneHref}>Call to order</a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-md border-white/20 font-sans text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/catering">Group catering</Link>
                </Button>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 pt-6 font-sans text-sm text-[#d8c8bc] sm:border-t-0 sm:pt-0 lg:border-l lg:border-t-0 lg:pl-8">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#deb39a]" />
                Mon–Fri · 7:30a–4:30p
              </span>
              <span className="text-xs leading-relaxed text-[#b5a090]">
                {BUSINESS_INFO.addressLine1}, {BUSINESS_INFO.city}
              </span>
            </div>
          </div>
        </div>
      </section>

      <StickySectionNav
        label="Categories"
        items={MAIN_MENU_SECTIONS.map((section) => ({
          id: section.id,
          label: section.shortLabel,
        }))}
        cta={
          <Button
            size="sm"
            className="rounded-md bg-[#2a1f19] font-sans text-xs text-white hover:bg-black"
            asChild
          >
            <a href={BUSINESS_INFO.phoneHref}>{BUSINESS_INFO.phone}</a>
          </Button>
        }
      />

      <div className="border-b border-[rgba(36,24,18,0.06)] bg-[#e8dfd4] py-3">
        <div className="container mx-auto flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-[#4a3d35] sm:text-sm">
            Trays and buffets live on the{" "}
            <Link href="/catering" className="font-semibold text-[#9c4f38]">
              catering page
            </Link>
            . This menu is weekday takeout.
          </p>
          <Link
            href="/catering"
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#2a1f19] hover:text-[#9c4f38] sm:text-sm"
          >
            Open catering
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <section className="py-12 sm:py-14">
        <div className="container mx-auto space-y-16 px-4 sm:space-y-20">
          <section id={breakfast.id} className="anchor-section">
            <SectionIntro
              eyebrow={breakfast.eyebrow}
              title={breakfast.title}
              description={breakfast.description}
              note={breakfast.note}
            />
            <div className="menu-paper overflow-hidden">
              <div className="grid md:grid-cols-2">
                {splitItems(breakfast.items ?? []).map((column, columnIndex) => (
                  <div
                    key={`${breakfast.id}-${columnIndex}`}
                    className={cn(
                      "divide-y divide-[rgba(36,24,18,0.06)]",
                      columnIndex === 0 &&
                        "md:border-r md:border-[rgba(36,24,18,0.06)]",
                    )}
                  >
                    {column.map((entry) => {
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
                ))}
              </div>
            </div>
          </section>

          <section id={sandwiches.id} className="anchor-section">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
              <div>
                <SectionIntro
                  eyebrow={sandwiches.eyebrow}
                  title={sandwiches.title}
                  description={sandwiches.description}
                />
                <div className="menu-paper divide-y divide-[rgba(36,24,18,0.06)]">
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
              </div>
              {sandwiches.addOns && sandwiches.addOnsTitle ? (
                <AddOnGrid
                  title={sandwiches.addOnsTitle}
                  items={sandwiches.addOns}
                />
              ) : null}
            </div>
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
            <div className="menu-paper">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {sides.items?.map((entry, i) => {
                  const liveItem = getLiveItem(entry.name);
                  const colBorder =
                    i % 3 !== 2 ? "lg:border-r lg:border-[rgba(36,24,18,0.06)]" : "";
                  const smBorder =
                    i % 2 === 0 ? "sm:border-r sm:border-[rgba(36,24,18,0.06)]" : "";
                  return (
                    <div
                      key={entry.name}
                      className={cn(
                        "border-b border-[rgba(36,24,18,0.06)] sm:border-b-0",
                        smBorder,
                        colBorder,
                      )}
                    >
                      <MenuRow
                        item={entry}
                        liveItem={liveItem}
                        quantity={getCartQuantity(liveItem?.id)}
                        onAdd={handleAdd}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        compact
                        showDescription={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section id={pizza.id} className="anchor-section">
            <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
              <div>
                <SectionIntro
                  eyebrow={pizza.eyebrow}
                  title={pizza.title}
                  description={pizza.description}
                />
                <div className="menu-paper divide-y divide-[rgba(36,24,18,0.06)]">
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
              </div>
              {pizza.addOns && pizza.addOnsTitle ? (
                <div className="space-y-4">
                  <AddOnGrid title={pizza.addOnsTitle} items={pizza.addOns} />
                  <p className="font-sans text-xs leading-relaxed text-[#5c4d42]">
                    Party-size pies stay easy for office drops — ask when you
                    call if you need timing help.
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <section id={pasta.id} className="anchor-section">
            <div className="menu-paper p-6 sm:p-8">
              <SectionIntro
                eyebrow={pasta.eyebrow}
                title={pasta.title}
                description={pasta.description}
                note={pasta.note}
              />
              <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                {pasta.pastaGroups?.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-md border border-[rgba(36,24,18,0.08)] bg-[#faf7f3]"
                  >
                    <div className="border-b border-[rgba(36,24,18,0.06)] px-4 py-3">
                      <h3 className="font-serif text-lg text-[#1c120e]">
                        {group.title}
                      </h3>
                    </div>
                    <div className="divide-y divide-[rgba(36,24,18,0.06)]">
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

      <section className="border-t border-[rgba(36,24,18,0.08)] bg-[#ede4d9] py-12">
        <div className="container mx-auto px-4">
          <div className="menu-paper flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
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
      </section>
    </Layout>
  );
}
