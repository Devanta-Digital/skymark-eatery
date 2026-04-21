import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { AiMenuSuggestBody, AiSpecialSuggestBody } from "@workspace/api-zod";
import { generateImageBuffer } from "@workspace/integrations-openai-ai-server/image";

const router = Router();

function getAnthropicClient() {
  return new Anthropic({
    baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
    apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY ?? "dummy",
  });
}

router.post("/menu-suggest", async (req, res) => {
  const parsed = AiMenuSuggestBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const { name, currentDescription, category, price } = parsed.data;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{
        role: "user",
        content: `You are a culinary writer for Skymark Eatery by Caffe E Pranzo, an upscale Italian restaurant in Mississauga, Ontario. Write a mouth-watering menu description for the following item.

Item name: ${name}
Category: ${category ?? "Italian"}
Current description: ${currentDescription ?? "None"}
Price: ${price ? `$${price}` : "Not specified"}

Respond with JSON only (no markdown) in this exact format:
{
  "description": "2-3 sentence appetizing description in Italian restaurant style",
  "allergenSuggestions": "Common allergens this likely contains, e.g. 'Contains gluten, dairy'",
  "pricingSuggestion": "Optional pricing note if relevant, or null"
}`
      }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");

    const text = content.text.trim();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const result = JSON.parse(jsonStr);

    res.json({
      description: result.description ?? "",
      allergenSuggestions: result.allergenSuggestions ?? "",
      pricingSuggestion: result.pricingSuggestion ?? null,
    });
  } catch (err) {
    req.log?.error({ err }, "AI menu suggest error");
    res.status(500).json({ error: "AI service error" });
  }
});

router.post("/special-suggest", async (req, res) => {
  const parsed = AiSpecialSuggestBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const { title, components } = parsed.data;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{
        role: "user",
        content: `You are a culinary writer for Skymark Eatery by Caffe E Pranzo, an upscale Italian restaurant in Mississauga. Write an evocative description for today's daily special to be featured on the restaurant's homepage.

Special name: ${title}
Components: ${components ?? "Not specified"}

This will appear prominently on the restaurant's landing page as the "Featured Today" section. Make it irresistible.

Respond with JSON only (no markdown) in this exact format:
{
  "description": "2-4 sentence poetic, appetizing description of the special that makes customers want to order it",
  "suggestedPrice": 18.99
}`
      }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");

    const text = content.text.trim();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const result = JSON.parse(jsonStr);

    res.json({
      description: result.description ?? "",
      suggestedPrice: result.suggestedPrice ?? null,
    });
  } catch (err) {
    req.log?.error({ err }, "AI special suggest error");
    res.status(500).json({ error: "AI service error" });
  }
});

router.post("/generate-special-image", async (req, res) => {
  const { title, description } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title required" }); return;
  }

  try {
    const prompt = `Professional food photography for an upscale Italian restaurant called Skymark Eatery. The dish is: "${title}". ${description ? `Description: ${description}.` : ""} Style: rustic wooden table, warm natural window light from the side, shallow depth of field, white ceramic bowl or plate, fresh garnish visible, rich colours, restaurant quality plating. Square composition. Photorealistic. No text, no watermarks, no people, no hands. The photo must clearly and accurately show the named dish.`;

    const buffer = await generateImageBuffer(prompt, "1024x1024");
    const base64 = buffer.toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    res.json({ imageUrl });
  } catch (err) {
    req.log?.error({ err }, "AI image generation error");
    res.status(500).json({ error: "Image generation failed" });
  }
});

router.post("/generate-menu-item-image", async (req, res) => {
  const { name, description, category } = req.body;
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "name required" }); return;
  }

  try {
    const prompt = `Professional food photography for Skymark Eatery, an Italian lunch and catering kitchen in Mississauga. Create a square photorealistic image of "${name}". ${category ? `Category: ${category}.` : ""} ${description ? `Description: ${description}.` : ""} Style: real plated food, warm natural light, clean table styling, appetizing restaurant presentation, no people, no hands, no text, no watermarks. The dish must look believable for an Italian restaurant menu item.`;

    const buffer = await generateImageBuffer(prompt, "1024x1024");
    const base64 = buffer.toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    res.json({ imageUrl });
  } catch (err) {
    req.log?.error({ err }, "AI menu item image generation error");
    res.status(500).json({ error: "Image generation failed" });
  }
});

router.post("/general", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt required" }); return;
  }
  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{
        role: "user",
        content: `You are an AI assistant for Skymark Eatery by Caffe E Pranzo, an authentic upscale Italian restaurant in Mississauga, Ontario (2630 Skymark Ave., Unit 102). You help the restaurant admin with menu writing, marketing copy, daily specials, catering proposals, and general restaurant operations. Always respond in the context of this Italian restaurant's brand: warm, professional, authentic Italian culinary tradition. ${prompt}`
      }],
    });
    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");
    const text = content.text.trim();
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      if (jsonStart >= 0) {
        const parsed = JSON.parse(text.slice(jsonStart, jsonEnd));
        res.json(parsed); return;
      }
    } catch { /* fall through to raw */ }
    res.json({ result: text });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "AI service error" });
  }
});

export default router;
