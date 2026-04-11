import { Router } from "express";
import Stripe from "stripe";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreatePaymentIntentBody, ConfirmPaymentBody } from "@workspace/api-zod";

const router = Router();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key, { apiVersion: "2025-01-27.acacia" });
}

router.post("/create-intent", async (req, res) => {
  const parsed = CreatePaymentIntentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, parsed.data.orderId));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  try {
    const stripe = getStripe();
    const amount = Math.round(parseFloat(order.total) * 100);
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "cad",
      metadata: { orderId: String(order.id) },
      automatic_payment_methods: { enabled: true },
    });

    await db.update(ordersTable)
      .set({ stripePaymentIntentId: intent.id, stripeStatus: intent.status })
      .where(eq(ordersTable.id, order.id));

    res.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount,
    });
  } catch (err: unknown) {
    req.log?.error({ err }, "Stripe create intent error");
    const msg = err instanceof Error ? err.message : "Payment error";
    res.status(500).json({ error: msg });
  }
});

router.post("/confirm", async (req, res) => {
  const parsed = ConfirmPaymentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, parsed.data.orderId));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(parsed.data.paymentIntentId);

    const status = intent.status === "succeeded" ? "confirmed" : "pending";
    const [updated] = await db
      .update(ordersTable)
      .set({
        status,
        stripeStatus: intent.status,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.id, order.id))
      .returning();

    res.json({
      ...updated,
      total: parseFloat(updated.total),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      items: [],
    });
  } catch (err: unknown) {
    req.log?.error({ err }, "Stripe confirm error");
    const msg = err instanceof Error ? err.message : "Payment error";
    res.status(500).json({ error: msg });
  }
});

router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret && sig) {
    try {
      const stripe = getStripe();
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata.orderId ? Number(intent.metadata.orderId) : null;
        if (orderId) {
          await db.update(ordersTable)
            .set({ status: "confirmed", stripeStatus: "succeeded", updatedAt: new Date() })
            .where(eq(ordersTable.id, orderId));
        }
      }
    } catch (_err) {
      res.status(400).send("Webhook Error");
      return;
    }
  }

  res.json({ received: true });
});

export default router;
