import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Truck, Clock, Users, DollarSign, CheckCircle2, Phone, Mail, UtensilsCrossed } from "lucide-react";

const cateringSchema = z.object({
  companyName: z.string().min(2, "Company or contact name required"),
  contactName: z.string().min(2, "Contact name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone number required"),
  eventDate: z.string().min(1, "Event date required"),
  guestCount: z.string().min(1, "Guest count required"),
  eventType: z.string().min(1, "Event type required"),
  deliveryType: z.string().min(1, "Select pickup or delivery"),
  notes: z.string().optional(),
});

type CateringValues = z.infer<typeof cateringSchema>;

const CATERING_MENU = [
  {
    section: "Sandwich & Wrap Trays",
    note: "Quote-based — pricing varies by selection and quantity",
    items: [
      { name: "Sandwich Favourite Tray", price: "Quote" },
      { name: "Vegetable Sandwich Tray", price: "Quote" },
      { name: "Meat & Cheese Wrap Tray", price: "Quote" },
      { name: "Veal Sandwiches", price: "$10.95 each" },
      { name: "Chicken Sandwiches", price: "$10.95 each" },
    ],
  },
  {
    section: "Platters & Antipasto",
    note: "Perfect for receptions and pre-event networking",
    items: [
      { name: "Antipasto Tray", price: "Quote" },
      { name: "Cheese & Fruit Platter", price: "Quote" },
      { name: "Meat & Cheese Platter", price: "Quote" },
    ],
  },
  {
    section: "Pasta Trays (Small / Large)",
    note: "Serves approx. 8–10 / 18–20 guests",
    items: [
      { name: "Penne Tray — Tomato Sauce", price: "$75 / $125" },
      { name: "Penne Tray — Bolognese", price: "$95 / $185" },
      { name: "Penne Tray — Rosé Sauce", price: "$85 / $160" },
      { name: "Gnocchi Tray — Tomato Sauce", price: "$75 / $125" },
      { name: "Gnocchi Tray — Rosé Sauce", price: "$85 / $160" },
      { name: "Gnocchi Tray — Bolognese", price: "$95 / $185" },
    ],
  },
  {
    section: "Lasagna Trays (Small / Large)",
    note: "Made fresh daily in-house",
    items: [
      { name: "Lasagna Bolognese", price: "$85 / $160" },
      { name: "Vegetable Lasagna", price: "$70 / $140" },
      { name: "Spinach & Ricotta Lasagna", price: "$85 / $160" },
    ],
  },
  {
    section: "Proteins & Cutlets",
    note: "Per piece pricing",
    items: [
      { name: "Veal Cutlets", price: "$9.95 each" },
      { name: "Chicken Cutlets", price: "$9.95 each" },
      { name: "Cannelloni (Meat or Cheese)", price: "$6.95 each" },
    ],
  },
  {
    section: "Arancini (Rice Balls)",
    note: "Perfect for cocktail receptions",
    items: [
      { name: "Arancini Mozzarella", price: "$4.95 each" },
      { name: "Arancini Mozzarella & Ham", price: "$5.95 each" },
      { name: "Arancini Bolognese", price: "$5.95 each" },
    ],
  },
  {
    section: "Salad Trays (Small / Large)",
    note: "Dressed and ready to serve",
    items: [
      { name: "Caesar Salad Tray", price: "$65 / $90" },
      { name: "Greek Salad Tray", price: "$70 / $95" },
      { name: "Italian Salad Tray", price: "$60 / $85" },
    ],
  },
];

const RULES = [
  { icon: <DollarSign className="w-5 h-5" />, title: "Minimum Order", text: "$100 CAD minimum for all catering orders" },
  { icon: <Clock className="w-5 h-5" />, title: "Advance Notice", text: "At least 2 full business days before your event date" },
  { icon: <Truck className="w-5 h-5" />, title: "Local Delivery", text: "Available for $30 delivery fee within the Mississauga area" },
  { icon: <Users className="w-5 h-5" />, title: "Custom Quotes", text: "Contact us for large events or custom corporate packages" },
];

export default function Catering() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<CateringValues>({
    resolver: zodResolver(cateringSchema),
    defaultValues: { deliveryType: "pickup" },
  });

  const onSubmit = async (data: CateringValues) => {
    // In production this would hit /api/catering/inquiries
    // For now simulate a submit
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    toast.success("Catering inquiry sent! We'll be in touch within one business day.");
    console.log("Catering inquiry:", data);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-14 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20 border-none text-sm px-4 py-1">
            Office Lunches · Private Events · Corporate Catering
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Catering by Skymark Eatery</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Authentic Italian food — delivered to your boardroom, your event, your team. Fresh trays, platters, and bespoke menus prepared daily in our Mississauga kitchen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="#inquire">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                Request a Quote
              </Button>
            </a>
            <a href="tel:+19052065550">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" />
                (905) 206-5550
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-10 bg-muted/40 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RULES.map((rule) => (
              <div key={rule.title} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  {rule.icon}
                </div>
                <div className="font-semibold text-sm">{rule.title}</div>
                <div className="text-xs text-muted-foreground">{rule.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catering Menu */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Catering Menu</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All items are freshly prepared. Prices listed as <em>small tray / large tray</em> where applicable. Contact us for custom builds.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {CATERING_MENU.map((section) => (
              <div key={section.section} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-primary/5 border-b border-border/50">
                  <h3 className="font-serif font-bold text-lg">{section.section}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{section.note}</p>
                </div>
                <div className="p-6 divide-y divide-border/40">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={`text-sm font-semibold ${item.price === "Quote" ? "text-muted-foreground italic" : "text-primary"}`}>
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquire" className="py-16 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold mb-3">Request a Quote</h2>
              <p className="text-muted-foreground">
                Tell us about your event and we'll get back to you within one business day with a custom quote.
              </p>
            </div>

            {submitted ? (
              <div className="bg-card border border-emerald-200 rounded-xl p-10 text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">Inquiry Received!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you! Our team will review your request and reach out within one business day to discuss your event details.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="tel:+19052065550">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Call us directly
                    </Button>
                  </a>
                  <a href="mailto:skymarkeatery@gmail.com">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email us
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company / Organization</FormLabel>
                          <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="contactName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="jane@acmecorp.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input placeholder="(905) 555-1234" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <FormField control={form.control} name="eventDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="guestCount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guests</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g. 25" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="deliveryType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup or Delivery</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pickup">Pickup</SelectItem>
                              <SelectItem value="delivery">Local Delivery (+$30)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="eventType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="office-lunch">Office Lunch</SelectItem>
                            <SelectItem value="team-meeting">Team Meeting</SelectItem>
                            <SelectItem value="corporate-event">Corporate Event</SelectItem>
                            <SelectItem value="private-party">Private Party</SelectItem>
                            <SelectItem value="birthday">Birthday / Celebration</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Menu Preferences / Special Requests (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what you're thinking — dietary restrictions, preferred dishes, budget range, etc."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full h-12 text-base" disabled={form.formState.isSubmitting}>
                      <UtensilsCrossed className="w-4 h-4 mr-2" />
                      {form.formState.isSubmitting ? "Sending..." : "Submit Catering Request"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Minimum order $100 · Please allow 2 business days notice · We'll confirm and send a detailed quote.
                    </p>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
