import { Layout } from "@/components/layout";
import { useGetTodaySpecial, useListCategories, useListMenuItems, MenuItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, UtensilsCrossed, MapPin, Phone, Clock, Mail, ChefHat, Users, Truck, Star, Gift, X, Crown, Calendar, Sparkles, ExternalLink } from "lucide-react";
import Hero3D from "@/components/hero-3d";
import { useState, useEffect } from "react";
import { SafeImage } from "@/components/safe-image";

export default function Home() {
  const { data: special, isLoading: isSpecialLoading } = useGetTodaySpecial({
    query: { queryKey: ["today-special"], refetchInterval: 30000, staleTime: 0 },
  });

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories({
    query: { queryKey: ["categories"] },
  });

  const { data: menuItems, isLoading: isMenuLoading } = useListMenuItems(
    { available: true },
    { query: { queryKey: ["menu-items", { available: true }] } }
  );

  const { addItem, items, updateQuantity, removeItem } = useCart();
  const { user, token, isAdmin } = useAuth();

  const getCartItem = (itemId: number) => items.find(i => i.menuItem.id === itemId);
  const handleIncrement = (item: MenuItem) => {
    const c = getCartItem(item.id);
    if (c) updateQuantity(item.id, c.quantity + 1); else addItem(item);
  };
  const handleDecrement = (item: MenuItem) => {
    const c = getCartItem(item.id);
    if (!c) return;
    if (c.quantity <= 1) removeItem(item.id); else updateQuantity(item.id, c.quantity - 1);
  };
  const [reward, setReward] = useState<{ hasReward: boolean; discountPercent: number; validUntil?: string } | null>(null);
  const [showRewardBanner, setShowRewardBanner] = useState(false);
  const [rewardDismissed, setRewardDismissed] = useState(false);

  useEffect(() => {
    if (!user || !token || user.role !== "customer" || rewardDismissed) return;
    const dismissed = sessionStorage.getItem("reward_banner_dismissed");
    if (dismissed) { setRewardDismissed(true); return; }
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/rewards/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.hasReward) {
          setReward(data);
          setShowRewardBanner(true);
        }
      })
      .catch(() => {});
  }, [user, token, rewardDismissed]);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast.success(`Added ${item.name} to cart`);
  };

  const dismissRewardBanner = () => {
    setShowRewardBanner(false);
    setRewardDismissed(true);
    sessionStorage.setItem("reward_banner_dismissed", "1");
  };

  const previewCategories = categories?.filter(c => c.name !== "Catering").slice(0, 4) || [];

  return (
    <Layout>
      {/* Rewards Banner */}
      {showRewardBanner && reward && (
        <div className="bg-gradient-to-r from-accent/90 to-accent text-white py-3 px-4 relative">
          <div className="container mx-auto flex items-center justify-center gap-3 text-sm font-medium">
            <Gift className="w-4 h-4 shrink-0" />
            <span>
              Welcome! You have a <strong>{reward.discountPercent}% discount</strong> on your orders for the next 30 days — enjoy Skymark on us!
            </span>
            <button onClick={dismissRewardBanner} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden min-h-[85vh] flex items-center">
        {/* 3D Floating Scene */}
        <Hero3D />

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" style={{ zIndex: 1 }}></div>

        {/* Subtle food texture overlay */}
        <div className="absolute inset-0 opacity-8 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" style={{ zIndex: 1 }}></div>

        {/* Italian flag stripe at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex h-2" style={{ zIndex: 3 }}>
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-white/80"></div>
          <div className="flex-1 bg-red-500"></div>
        </div>
        
        <div className="relative w-full container mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center" style={{ zIndex: 2 }}>
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl scale-110" />
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/30 px-8 py-5 ring-1 ring-white/20">
                <img 
                  src="/logo.webp" 
                  alt="Skymark Eatery by Caffé É Pranzo" 
                  className="h-24 md:h-32 w-auto object-contain"
                />
              </div>
            </div>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-5 max-w-3xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Authentic Italian Flavours<br />
            <span className="text-3xl md:text-4xl font-light opacity-85 tracking-wide">in Mississauga</span>
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/85 max-w-xl mb-3 font-light">
            Freshly prepared Italian-inspired meals — dine in or order for pickup.
          </p>
          <p className="text-sm text-primary-foreground/60 mb-10 tracking-wide">
            2630 Skymark Ave., Unit 102 &nbsp;·&nbsp; Mon–Fri 7:30 AM – 4:30 PM &nbsp;·&nbsp; (905) 206-5550
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 h-auto shadow-xl font-semibold" asChild>
              <Link href="/menu">Order Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 h-auto backdrop-blur-sm" asChild>
              <a href="#special">Today's Special</a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 h-auto backdrop-blur-sm" asChild>
              <Link href="/catering">Catering</Link>
            </Button>
          </div>

          {/* New customer badge */}
          {!user && (
            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-primary-foreground/90">
              <Gift className="w-3.5 h-3.5 text-yellow-300" />
              New customers get <strong className="text-yellow-300">15% off</strong> their first 30 days — create an account to unlock it
            </div>
          )}
        </div>
      </section>

      {/* Today's Special */}
      <section id="special" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative">
                {isSpecialLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <SafeImage
                    src={special?.imageUrl}
                    alt={special?.title ?? "Today's Special"}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary border-none px-3 py-1 shadow-md text-sm">
                    Today's Special
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
              {isSpecialLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-8 w-1/4" />
                </div>
              ) : special ? (
                <>
                  <div className="flex items-center gap-2 text-secondary text-sm font-medium uppercase tracking-widest">
                    <Star className="w-4 h-4 fill-current" />
                    Chef's Feature
                  </div>
                  <h2 className="font-serif text-4xl font-bold text-primary leading-tight">{special.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{special.description}</p>
                  {special.price && (
                    <div className="text-2xl font-serif font-medium text-foreground">
                      ${special.price.toFixed(2)}
                    </div>
                  )}
                  <Button size="lg" className="w-full sm:w-auto mt-4" asChild>
                    <Link href="/menu">Order This Special</Link>
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="italic">Check back soon for today's special creation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tavola Calda — Hot Counter */}
      <section className="py-16 bg-muted/40 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">Hot Italian Counter</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">Tavola Calda</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Italy's beloved tradition — restaurant-quality Italian mains kept warm and ready at the counter. Pick up your lunch without the wait.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Gnocchi", sub: "Tomato · Rosé · Bolognese", icon: "🥟", from: "From $11.95" },
              { name: "Lasagna", sub: "Bolognese · Vegetable · Spinach & Ricotta", icon: "🍝", from: "From $12.95" },
              { name: "Arancini", sub: "Mozzarella · Ham & Cheese · Bolognese", icon: "🍙", from: "From $4.95" },
              { name: "Personal Pizza", sub: "Made to order · Gluten-free available", icon: "🍕", from: "From $9.95" },
            ].map((item) => (
              <div key={item.name} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow group cursor-default">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.sub}</p>
                <div className="text-sm font-semibold text-primary">{item.from}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/menu">
              <Button variant="outline" size="lg">
                See Full Menu →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dinner Pickup CTA */}
      <section className="py-12 bg-amber-50 border-t border-amber-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                🌙
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Dinner Pickup Available</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Order by <strong>1:30 PM</strong> for same-day pickup by 4:30 PM. Take the best of Skymark home tonight.
                </p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/menu">
                <Button className="whitespace-nowrap">Order for Pickup</Button>
              </Link>
              <a href="tel:+19052065550">
                <Button variant="outline" className="whitespace-nowrap flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call Ahead
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-24 bg-card border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">What We Serve</p>
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Menu</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Crafted with fresh ingredients and Italian passion, every dish tells a story.</p>
          </div>

          {isCategoriesLoading || isMenuLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {previewCategories.map(category => {
                const categoryItems = menuItems?.filter(item => item.categoryId === category.id).slice(0, 4) || [];
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id}>
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="font-serif text-2xl font-bold text-foreground">{category.name}</h3>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex gap-4 group">
                          <SafeImage
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-md shadow-sm border border-border flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="font-serif font-semibold text-lg text-primary leading-tight">{item.name}</h4>
                                <span className="font-medium whitespace-nowrap text-foreground">${Number(item.price).toFixed(2)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              {item.isPopular && (
                                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider py-0 px-2 bg-accent/20 text-accent hover:bg-accent/20 border-none">Popular</Badge>
                              )}
                              {(() => {
                                const cartItem = getCartItem(item.id);
                                if (!cartItem) {
                                  return (
                                    <Button variant="ghost" size="sm" className="h-8 px-2 ml-auto text-primary hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleAddToCart(item)}>
                                      <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                  );
                                }
                                return (
                                  <div className="flex items-center gap-1 ml-auto">
                                    {cartItem.quantity >= 2 && (
                                      <button className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => removeItem(item.id)}>
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                    <div className="flex items-center border border-primary/30 rounded-md overflow-hidden bg-primary/5">
                                      <button className="w-7 h-7 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleDecrement(item)}><Minus className="w-3 h-3" /></button>
                                      <span className="w-6 text-center text-sm font-semibold text-primary">{cartItem.quantity}</span>
                                      <button className="w-7 h-7 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleIncrement(item)}><Plus className="w-3 h-3" /></button>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link href="/menu">View Full Menu →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catering CTA */}
      <section id="catering" className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=70')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm font-medium uppercase tracking-widest">
                <Users className="w-4 h-4" />
                Group & Corporate Events
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                Catering for<br />Every Occasion
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-lg">
                From office lunches to corporate events — we bring authentic Italian flavours to your table. Minimum 10 guests. Custom menus available.
              </p>
              <ul className="space-y-3 text-primary-foreground/75">
                {["Pasta & risotto stations", "Antipasto platters & charcuterie", "Pizza varieties", "Full lunch packages with dessert"].map(feat => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold" asChild>
                  <Link href="/catering">View Catering Menu</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/40 hover:bg-primary-foreground/10 text-primary-foreground" asChild>
                  <Link href="/catering#inquire">Request a Quote</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-6 text-center space-y-2">
                <Truck className="w-8 h-8 mx-auto text-primary-foreground/60" />
                <div className="font-serif text-xl font-bold">Delivery Available</div>
                <div className="text-sm text-primary-foreground/60">For orders 15+ guests</div>
              </div>
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-6 text-center space-y-2">
                <ChefHat className="w-8 h-8 mx-auto text-primary-foreground/60" />
                <div className="font-serif text-xl font-bold">Custom Menus</div>
                <div className="text-sm text-primary-foreground/60">Tailored to your event</div>
              </div>
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-6 text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-primary-foreground/60" />
                <div className="font-serif text-xl font-bold">10–200 Guests</div>
                <div className="text-sm text-primary-foreground/60">Any size, any occasion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Hours / Location */}
      <section id="contact" className="py-20 bg-background border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-2">Find Us</p>
            <h2 className="font-serif text-4xl font-bold text-primary">Visit Skymark Eatery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Hours */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-2">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Hours</h3>
              <div className="space-y-1 text-muted-foreground text-sm">
                <p className="font-medium text-foreground">Monday – Friday</p>
                <p>7:30 AM – 4:30 PM</p>
                <p className="mt-2 text-xs text-muted-foreground/70 italic">Closed weekends & public holidays</p>
              </div>
            </div>
            {/* Location */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-2">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Location</h3>
              <div className="space-y-1 text-muted-foreground text-sm">
                <p>2630 Skymark Ave., Unit 102</p>
                <p>Mississauga, ON L4W 5A4</p>
                <a 
                  href="https://maps.google.com/?q=2630+Skymark+Ave+Unit+102+Mississauga" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block mt-2 text-primary hover:underline text-xs font-medium"
                >
                  Get Directions →
                </a>
              </div>
            </div>
            {/* Contact */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-2">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Contact</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <div>
                  <a href="tel:+19052065550" className="text-foreground hover:text-primary font-medium">(905) 206-5550</a>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:skymarkeatery@gmail.com" className="hover:text-primary">skymarkeatery@gmail.com</a>
                </div>
                <div className="mt-2">
                  <a href="https://www.instagram.com/skymark___eatery/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs font-medium">
                    @skymark___eatery on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map embed */}
          <div className="mt-12 max-w-4xl mx-auto rounded-xl overflow-hidden border border-border shadow-sm" id="map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891.5867040432!2d-79.6427!3d43.6441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b38c6b9d5d4f7%3A0x1234567890abcdef!2s2630+Skymark+Ave+Unit+102%2C+Mississauga%2C+ON+L4W+5A4!5e0!3m2!1sen!2sca!4v1618000000000!5m2!1sen!2sca"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Skymark Eatery Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Admin-only: Subscription Plans Preview */}
      {isAdmin && (
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5 border-t-2 border-dashed border-primary/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-widest mb-2">
                  <Crown className="w-4 h-4" />
                  Admin Preview — Subscription Plans
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Membership Plans</h2>
                <p className="text-muted-foreground mt-1 text-sm">Visible to admins only · Will be made public in a future release</p>
              </div>
              <Link href="/admin/subscriptions">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Manage Subscriptions
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: <Calendar className="w-6 h-6" />,
                  name: "Weekly Plan",
                  cycle: "Every 7 days",
                  price: "Varies",
                  discount: "20% off every order",
                  meals: "Up to 2 free meals/week",
                  earnedWhen: "After 1 month",
                  color: "border-blue-200 bg-blue-50/50",
                  iconColor: "text-blue-600 bg-blue-100",
                  badge: "blue",
                },
                {
                  icon: <Star className="w-6 h-6" />,
                  name: "Bi-Weekly Plan",
                  cycle: "Every 14 days",
                  price: "Varies",
                  discount: "20% off every order",
                  meals: "Up to 4 free meals/cycle",
                  earnedWhen: "Per cycle",
                  color: "border-primary/30 bg-primary/5 ring-2 ring-primary/20",
                  iconColor: "text-primary bg-primary/10",
                  badge: "primary",
                },
                {
                  icon: <Crown className="w-6 h-6" />,
                  name: "Monthly Plan",
                  cycle: "Every 30 days",
                  price: "Varies",
                  discount: "20% off every order",
                  meals: "Up to 6 free meals/month",
                  earnedWhen: "Per cycle",
                  color: "border-amber-200 bg-amber-50/50",
                  iconColor: "text-amber-700 bg-amber-100",
                  badge: "amber",
                },
              ].map((plan) => (
                <div key={plan.name} className={`rounded-xl border p-6 space-y-4 ${plan.color}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.iconColor}`}>
                      {plan.icon}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-lg">{plan.name}</div>
                      <div className="text-xs text-muted-foreground">{plan.cycle}</div>
                    </div>
                  </div>
                  <Badge className="bg-accent/20 text-accent hover:bg-accent/20 border-none text-xs">
                    {plan.discount}
                  </Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-accent" />
                      <span className="font-medium text-foreground">{plan.meals}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChefHat className="w-3.5 h-3.5 shrink-0" />
                      <span>Earned: {plan.earnedWhen}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Customers pay ahead and lock in their discount. Free meals unlock after sustained membership.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 max-w-5xl mx-auto rounded-xl border border-secondary/30 bg-secondary/5 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-serif font-bold">Corporate Catering Plans</div>
                  <div className="text-sm text-muted-foreground">Special pricing for employee meal programs</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Corporate clients receive custom pricing based on volume, invoicing preferences, and delivery schedule. Contact to arrange a dedicated catering account.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a href="tel:+19052065550" className="text-sm font-medium text-primary hover:underline">(905) 206-5550</a>
                <a href="mailto:skymarkeatery@gmail.com" className="text-sm font-medium text-primary hover:underline">skymarkeatery@gmail.com</a>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
