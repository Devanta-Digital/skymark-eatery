import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check, AlertTriangle, ChefHat, Star, Megaphone, Users, MessageSquare, List } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Action = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
  endpoint: string;
  buildBody: (fields: Record<string, string>) => object;
  resultKey: string;
};

const ACTIONS: Action[] = [
  {
    id: "menu-rewrite",
    label: "Rewrite Menu Description",
    icon: <ChefHat className="w-4 h-4" />,
    description: "Generate an appetizing menu item description.",
    fields: [
      { key: "name", label: "Item Name", placeholder: "e.g. Penne alla Rosé" },
      { key: "category", label: "Category", placeholder: "e.g. Pasta" },
      { key: "currentDescription", label: "Current Description (optional)", placeholder: "Leave blank to generate fresh", multiline: true },
      { key: "price", label: "Price (optional)", placeholder: "e.g. 11.95" },
    ],
    endpoint: "/api/ai/menu-suggest",
    buildBody: (f) => ({ name: f.name, category: f.category, currentDescription: f.currentDescription || undefined, price: f.price || undefined }),
    resultKey: "description",
  },
  {
    id: "special-description",
    label: "Generate Today's Special",
    icon: <Star className="w-4 h-4" />,
    description: "Create a compelling featured special write-up.",
    fields: [
      { key: "title", label: "Special Title", placeholder: "e.g. Rosé Penne with Grilled Chicken" },
      { key: "ingredients", label: "Key Ingredients", placeholder: "e.g. penne, rosé sauce, grilled chicken, garlic bread" },
      { key: "price", label: "Price", placeholder: "e.g. 14.95" },
    ],
    endpoint: "/api/ai/special-suggest",
    buildBody: (f) => ({ title: f.title, ingredients: f.ingredients, price: f.price }),
    resultKey: "description",
  },
  {
    id: "catering-copy",
    label: "Improve Catering Copy",
    icon: <Users className="w-4 h-4" />,
    description: "Polish your catering pitch for office clients and event planners.",
    fields: [
      { key: "existingCopy", label: "Existing Copy", placeholder: "Paste your current catering description here...", multiline: true },
      { key: "targetAudience", label: "Target Audience", placeholder: "e.g. office lunch teams, corporate event planners" },
    ],
    endpoint: "/api/ai/general",
    buildBody: (f) => ({
      prompt: `Improve this catering copy for ${f.targetAudience} at Skymark Eatery, an authentic Italian restaurant in Mississauga: "${f.existingCopy}". Write in a warm, professional Italian hospitality tone. Return JSON: {"result": "improved copy"}`,
    }),
    resultKey: "result",
  },
  {
    id: "homepage-copy",
    label: "Homepage Featured Copy",
    icon: <Megaphone className="w-4 h-4" />,
    description: "Write a punchy homepage feature block for today's special.",
    fields: [
      { key: "specialName", label: "Special Name", placeholder: "e.g. Rosé Penne with Grilled Chicken" },
      { key: "price", label: "Price", placeholder: "e.g. 14.95" },
    ],
    endpoint: "/api/ai/general",
    buildBody: (f) => ({
      prompt: `Write a short, compelling homepage feature block (2-3 sentences + a CTA line) for today's special at Skymark Eatery: "${f.specialName}" priced at $${f.price}. Warm Italian hospitality tone. Return JSON: {"result": "your copy here"}`,
    }),
    resultKey: "result",
  },
  {
    id: "social-caption",
    label: "Social Media Caption",
    icon: <MessageSquare className="w-4 h-4" />,
    description: "Draft an Instagram caption for a dish or special.",
    fields: [
      { key: "dishName", label: "Dish / Item", placeholder: "e.g. Tiramisu Classico" },
      { key: "vibe", label: "Vibe", placeholder: "e.g. lunch crowd, cozy Friday, new menu item" },
    ],
    endpoint: "/api/ai/general",
    buildBody: (f) => ({
      prompt: `Write an Instagram caption for Skymark Eatery (Italian restaurant in Mississauga) featuring "${f.dishName}". Vibe: ${f.vibe}. Include 3-5 relevant hashtags. Keep it warm, authentic, not corporate. Return JSON: {"result": "caption here"}`,
    }),
    resultKey: "result",
  },
  {
    id: "short-teaser",
    label: "Short Card Teaser",
    icon: <List className="w-4 h-4" />,
    description: "Condense a long description into a 1–2 sentence card teaser.",
    fields: [
      { key: "longDescription", label: "Full Description", placeholder: "Paste the full item description...", multiline: true },
    ],
    endpoint: "/api/ai/general",
    buildBody: (f) => ({
      prompt: `Summarize this menu item description into a 1-2 sentence card teaser (max 25 words) for Skymark Eatery: "${f.longDescription}". Return JSON: {"result": "teaser here"}`,
    }),
    resultKey: "result",
  },
];

export default function AdminAI() {
  const { token } = useAuth();
  const [selectedAction, setSelectedAction] = useState<Action>(ACTIONS[0]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectAction = (action: Action) => {
    setSelectedAction(action);
    setFieldValues({});
    setResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = selectedAction.buildBody(fieldValues);
      const res = await fetch(`${BASE}${selectedAction.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI generation failed");
      const text = data[selectedAction.resultKey] || data.description || data.result || JSON.stringify(data);
      setResult(text);
    } catch (e: any) {
      setError(e.message || "Failed to generate. Check your AI integration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
            <Sparkles className="w-4 h-4" />
            Admin Tool
          </div>
          <h1 className="font-serif text-3xl font-bold">AI Writing Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Generate menu descriptions, specials copy, and social captions. All output is a draft — you must review and publish manually.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>AI suggestions are drafts only. <strong>Never published automatically.</strong> Review carefully before using in the restaurant.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Selector */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Choose an action</p>
            {ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => selectAction(action)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  selectedAction.id === action.id
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${selectedAction.id === action.id ? "bg-primary text-white" : "bg-muted"}`}>
                  {action.icon}
                </div>
                <div>
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{action.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Form + Result */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                {selectedAction.icon}
                {selectedAction.label}
              </h2>

              <div className="space-y-4">
                {selectedAction.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-foreground block mb-1.5">{field.label}</label>
                    {field.multiline ? (
                      <Textarea
                        placeholder={field.placeholder}
                        value={fieldValues[field.key] || ""}
                        onChange={(e) => setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="resize-none"
                        rows={4}
                      />
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        value={fieldValues[field.key] || ""}
                        onChange={(e) => setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isLoading ? "Generating..." : "Generate Draft"}
                </Button>
              </div>
            </div>

            {/* Result */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
            {result && (
              <div className="bg-card border border-primary/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">AI Draft</span>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 text-xs">Draft — Not Published</Badge>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleCopy} className="flex items-center gap-1.5">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm bg-muted/40 rounded-md p-4">{result}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Copy this text and paste it into the Menu Manager or Specials editor. It will not be saved or published automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
