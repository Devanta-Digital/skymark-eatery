import { AdminLayout } from "@/components/admin-layout";
import { useGetTodaySpecial, useListSpecials, useCreateSpecial, useUpdateSpecial, useAiSpecialSuggest, Special } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Wand2, Loader2, Star, Calendar, ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { SafeImage } from "@/components/safe-image";

const specialSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  price: z.coerce.number().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  activeDate: z.string(),
  isActive: z.boolean().default(true),
});

type SpecialValues = z.infer<typeof specialSchema>;

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

async function generateSpecialImage(title: string, description: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/ai/generate-special-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? "Image generation failed");
  }
  const data = await res.json();
  return data.imageUrl as string;
}


export default function AdminSpecials() {
  const queryClient = useQueryClient();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  const { data: todaySpecial, isLoading: isTodayLoading } = useGetTodaySpecial({
    query: { queryKey: ["today-special"] },
  });

  const { data: allSpecials, isLoading: isAllLoading } = useListSpecials({
    query: { queryKey: ["all-specials"] },
  });

  const createSpecial = useCreateSpecial();
  const updateSpecial = useUpdateSpecial();
  const aiSuggest = useAiSpecialSuggest();

  const form = useForm<SpecialValues>({
    resolver: zodResolver(specialSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
      activeDate: format(new Date(), "yyyy-MM-dd"),
      isActive: true,
    },
  });

  const onSubmit = async (data: SpecialValues) => {
    try {
      const existingToday = allSpecials?.find(
        (s) => s.activeDate.split("T")[0] === data.activeDate
      );

      if (existingToday) {
        await updateSpecial.mutateAsync({
          id: existingToday.id,
          data: {
            ...data,
            imageUrl: data.imageUrl || null,
            price: data.price || null,
          },
        });
      } else {
        await createSpecial.mutateAsync({
          data: {
            ...data,
            imageUrl: data.imageUrl || null,
            price: data.price || null,
          },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["today-special"] });
      queryClient.invalidateQueries({ queryKey: ["all-specials"] });
      setGeneratedPreview(null);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 4000);
      toast.success("Special saved — now live on the homepage!");
    } catch {
      toast.error("Failed to save special. Please try again.");
    }
  };

  const handleAiEnhance = async () => {
    const title = form.getValues("title");
    if (!title) {
      toast.error("Enter a dish name first so AI knows what to write about");
      return;
    }
    try {
      const suggestion = await aiSuggest.mutateAsync({ data: { title } });
      form.setValue("description", suggestion.description, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (suggestion.suggestedPrice) {
        form.setValue("price", suggestion.suggestedPrice, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      toast.success("AI copy written — edit freely before saving");
    } catch {
      toast.error("AI writing failed — please try again");
    }
  };

  const handleGenerateImage = async () => {
    const title = form.getValues("title");
    const description = form.getValues("description");
    if (!title) {
      toast.error("Enter a dish name first so the AI knows what to photograph");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateSpecialImage(title, description);
      form.setValue("imageUrl", imageUrl, { shouldDirty: true });
      setGeneratedPreview(imageUrl);
      toast.success("Photo generated! It's ready — save to push it live.");
    } catch (e: any) {
      toast.error(e?.message ?? "Image generation failed — please try again");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const loadSpecialToForm = (special: Special) => {
    form.reset({
      title: special.title,
      description: special.description,
      price: Number(special.price) || 0,
      imageUrl: special.imageUrl || "",
      activeDate: special.activeDate.split("T")[0],
      isActive: special.isActive,
    });
    setGeneratedPreview(special.imageUrl || null);
    setSavedOk(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const imageUrl = form.watch("imageUrl");
  const isSaving = createSpecial.isPending || updateSpecial.isPending;
  const previewSrc = imageUrl || generatedPreview || "";

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Daily Specials</h1>
          <p className="text-muted-foreground mt-1">
            Set today's featured special — it appears live on the homepage the moment you save.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Edit Special
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="activeDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dish Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Lobster Ravioli" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Marketing Copy</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAiEnhance}
                        disabled={aiSuggest.isPending}
                        className="h-8"
                      >
                        {aiSuggest.isPending ? (
                          <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Writing…</>
                        ) : (
                          <><Wand2 className="w-4 h-4 mr-1.5" />AI Write Description</>
                        )}
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              className="resize-none h-28"
                              placeholder="Describe the dish beautifully…"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Photo Section */}
                  <div className="bg-muted/50 p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" /> Dish Photo
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                        className="h-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {isGeneratingImage ? (
                          <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Generating…</>
                        ) : (
                          <><Wand2 className="w-4 h-4 mr-1.5" />Generate AI Photo</>
                        )}
                      </Button>
                    </div>

                    {isGeneratingImage && (
                      <div className="rounded-md bg-muted border border-dashed flex flex-col items-center justify-center h-48 gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        Creating a professional food photo… this takes about 20 seconds
                      </div>
                    )}

                    {previewSrc && !isGeneratingImage && (
                      <div className="relative rounded-md overflow-hidden border border-border">
                        <SafeImage
                          src={previewSrc}
                          alt="Special preview"
                          className="w-full h-48 object-cover"
                        />
                        {generatedPreview && imageUrl === generatedPreview && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> AI Generated
                          </div>
                        )}
                      </div>
                    )}

                    {!previewSrc && !isGeneratingImage && (
                      <div className="rounded-md bg-muted border border-dashed flex items-center justify-center h-28 text-sm text-muted-foreground gap-2">
                        <ImageIcon className="w-4 h-4" />
                        No photo yet — generate one with AI or paste a URL below
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Or paste image URL / path (e.g. /food/myimage.png)"
                              {...field}
                              value={
                                field.value?.startsWith("data:") ? "(AI-generated photo)" : field.value
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "(AI-generated photo)") return;
                                field.onChange(val);
                                setGeneratedPreview(null);
                              }}
                              onFocus={(e) => {
                                if (field.value?.startsWith("data:")) {
                                  e.target.select();
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">Push Live</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Make this special visible on the homepage.
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className={`w-full h-12 text-lg transition-all ${
                      savedOk
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                    }`}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving…</>
                    ) : savedOk ? (
                      <><CheckCircle className="w-5 h-5 mr-2" />Saved & Live!</>
                    ) : (
                      "Save & Go Live"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Current & Past Specials */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif text-primary">Currently Live</CardTitle>
              </CardHeader>
              <CardContent>
                {isTodayLoading ? (
                  <Skeleton className="h-32 w-full rounded-md" />
                ) : todaySpecial ? (
                  <div className="flex gap-4 items-start">
                    {todaySpecial.imageUrl && (
                      <SafeImage
                        src={todaySpecial.imageUrl}
                        alt={todaySpecial.title}
                        className="w-28 h-28 object-cover rounded-md shadow-sm border border-border flex-shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-xl">{todaySpecial.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                        {todaySpecial.description}
                      </p>
                      {todaySpecial.price && (
                        <div className="font-medium mt-2 text-lg">
                          ${Number(todaySpecial.price).toFixed(2)}
                        </div>
                      )}
                      <Button
                        variant="link"
                        className="px-0 mt-2 h-auto text-primary"
                        onClick={() => loadSpecialToForm(todaySpecial)}
                      >
                        Load into editor →
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                    <AlertCircle className="w-4 h-4" />
                    No special is currently active for today.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Recent Specials</CardTitle>
                <CardDescription>Click any entry to load it into the editor</CardDescription>
              </CardHeader>
              <CardContent>
                {isAllLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : allSpecials && allSpecials.length > 0 ? (
                  <div className="space-y-3">
                    {allSpecials.slice(0, 10).map((special) => (
                      <div
                        key={special.id}
                        className="flex justify-between items-center p-3 border border-border rounded-md hover:bg-muted cursor-pointer transition-colors gap-3"
                        onClick={() => loadSpecialToForm(special)}
                      >
                        {special.imageUrl && (
                          <SafeImage
                            src={
                              special.imageUrl.startsWith("data:")
                                ? special.imageUrl
                                : `${special.imageUrl}?v=${special.id}`
                            }
                            alt={special.title}
                            className="w-12 h-12 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{special.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(special.activeDate), "MMM d, yyyy")}
                            {!special.isActive && (
                              <span className="text-red-500 font-medium">(Inactive)</span>
                            )}
                          </div>
                        </div>
                        {special.price && (
                          <div className="font-medium text-sm flex-shrink-0">
                            ${Number(special.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm py-4">No specials on record yet.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
