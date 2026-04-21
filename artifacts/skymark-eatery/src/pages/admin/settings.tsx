import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Clock, Truck, ChefHat, DollarSign, Save, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const SETTINGS_KEY = "skymark_business_settings";

const DEFAULTS = {
  businessName: "Skymark Eatery by Caffe E Pranzo",
  address: "2630 Skymark Ave., Unit 102, Mississauga, ON L4W 5A4",
  phone: "(905) 206-5550",
  email: "info@skymarkeatery.ca",
  hoursWeekday: "Monday – Friday: 7:30 AM – 4:30 PM",
  hoursClosed: "Closed weekends & public holidays",
  defaultPrepTime: "15",
  peakPrepTime: "25",
  peakHourStart: "11:00",
  peakHourEnd: "13:00",
  cateringMinOrder: "100",
  cateringDeliveryFee: "30",
  cateringLeadDays: "2",
  dinnerPickupCutoffMsg: "Order by 1:30 PM for same-day pickup by 4:30 PM.",
  heroHeadline: "Authentic Italian Breakfast & Lunch in Mississauga",
  heroSubtext: "Freshly prepared Italian-inspired meals — dine in or order for pickup.",
  hstRate: "13",
  smallItemTaxRate: "5",
  smallItemThreshold: "4.00",
  taxNote: "Ontario HST applies. Items ≤ $4.00 may qualify for the 5% reduced rate on qualifying prepared food.",
};

type Settings = typeof DEFAULTS;

function load(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch { return DEFAULTS; }
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">{icon}</div>
        <h2 className="font-serif text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(load);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Settings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    toast.success("Settings saved successfully!");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!confirm("Reset all settings to factory defaults?")) return;
    localStorage.removeItem(SETTINGS_KEY);
    setSettings(DEFAULTS);
    toast.info("Settings reset to defaults");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
              <Settings className="w-4 h-4" />
              Admin Settings
            </div>
            <h1 className="font-serif text-3xl font-bold">Business Settings</h1>
            <p className="text-muted-foreground mt-1">Configure restaurant-wide settings. Changes are saved locally.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} size="sm">Reset to Defaults</Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-3 text-sm text-blue-800">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Settings are stored in your browser. A future update will persist them server-side. Changes to prep times and hours affect new orders immediately after saving.</p>
        </div>

        <Section title="Business Information" icon={<Info className="w-4 h-4" />}>
          <Field label="Business Name">
            <Input value={settings.businessName} onChange={(e) => set("businessName", e.target.value)} />
          </Field>
          <Field label="Address">
            <Input value={settings.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone">
              <Input value={settings.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Email">
              <Input type="email" value={settings.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="Hours & Availability" icon={<Clock className="w-4 h-4" />}>
          <Field label="Weekday Hours" note="Displayed in the footer and homepage contact block">
            <Input value={settings.hoursWeekday} onChange={(e) => set("hoursWeekday", e.target.value)} />
          </Field>
          <Field label="Closed Days / Holidays Message">
            <Input value={settings.hoursClosed} onChange={(e) => set("hoursClosed", e.target.value)} />
          </Field>
          <Field label="Dinner Pickup Cutoff Message" note="Shown in the homepage Dinner Pickup section">
            <Input value={settings.dinnerPickupCutoffMsg} onChange={(e) => set("dinnerPickupCutoffMsg", e.target.value)} />
          </Field>
        </Section>

        <Section title="Order Prep Times" icon={<ChefHat className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Default Prep Time (minutes)" note="Applied outside peak hours">
              <Input type="number" min="5" max="60" value={settings.defaultPrepTime} onChange={(e) => set("defaultPrepTime", e.target.value)} />
            </Field>
            <Field label="Peak Hour Prep Time (minutes)" note="Applied during peak window">
              <Input type="number" min="5" max="90" value={settings.peakPrepTime} onChange={(e) => set("peakPrepTime", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Peak Hours Start (24h)" note="e.g. 11:00 = 11 AM">
              <Input type="time" value={settings.peakHourStart} onChange={(e) => set("peakHourStart", e.target.value)} />
            </Field>
            <Field label="Peak Hours End (24h)" note="e.g. 13:00 = 1 PM">
              <Input type="time" value={settings.peakHourEnd} onChange={(e) => set("peakHourEnd", e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="Catering Rules" icon={<Truck className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Minimum Order (CAD)" note="Below this, catering not accepted">
              <Input type="number" min="0" value={settings.cateringMinOrder} onChange={(e) => set("cateringMinOrder", e.target.value)} />
            </Field>
            <Field label="Local Delivery Fee (CAD)">
              <Input type="number" min="0" value={settings.cateringDeliveryFee} onChange={(e) => set("cateringDeliveryFee", e.target.value)} />
            </Field>
            <Field label="Lead Time (Business Days)" note="Minimum advance notice required">
              <Input type="number" min="1" value={settings.cateringLeadDays} onChange={(e) => set("cateringLeadDays", e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="Tax / Pricing Rules" icon={<DollarSign className="w-4 h-4" />}>
          <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            Please have your accountant confirm tax rules before adjusting. Ontario HST = 13% as default.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Standard HST Rate (%)" note="Ontario: 13%">
              <Input type="number" min="0" max="30" step="0.5" value={settings.hstRate} onChange={(e) => set("hstRate", e.target.value)} />
            </Field>
            <Field label="Small Item Tax Rate (%)" note="For qualifying items ≤ threshold">
              <Input type="number" min="0" max="30" step="0.5" value={settings.smallItemTaxRate} onChange={(e) => set("smallItemTaxRate", e.target.value)} />
            </Field>
            <Field label="Small Item Threshold (CAD)" note="Items at or below this price may qualify for reduced rate">
              <Input type="number" min="0" step="0.25" value={settings.smallItemThreshold} onChange={(e) => set("smallItemThreshold", e.target.value)} />
            </Field>
          </div>
          <Field label="Tax Notes (for accountant reference)">
            <Textarea value={settings.taxNote} onChange={(e) => set("taxNote", e.target.value)} className="resize-none" rows={3} />
          </Field>
        </Section>

        <Section title="Homepage Copy" icon={<Settings className="w-4 h-4" />}>
          <Field label="Hero Headline">
            <Input value={settings.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
          </Field>
          <Field label="Hero Subtext">
            <Textarea value={settings.heroSubtext} onChange={(e) => set("heroSubtext", e.target.value)} className="resize-none" rows={2} />
          </Field>
        </Section>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="flex items-center gap-2 px-8">
            <Save className="w-4 h-4" />
            {saved ? "All Saved!" : "Save All Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
