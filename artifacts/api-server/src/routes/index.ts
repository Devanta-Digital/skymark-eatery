import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import menuRouter from "./menu/index.js";
import specialsRouter from "./specials/index.js";
import ordersRouter from "./orders/index.js";
import paymentsRouter from "./payments/index.js";
import adminRouter from "./admin/index.js";
import aiRouter from "./ai/index.js";
import authRouter from "./auth/index.js";
import rewardsRouter from "./rewards/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/menu", menuRouter);
router.use("/specials", specialsRouter);
router.use("/orders", ordersRouter);
router.use("/payments", paymentsRouter);
router.use("/admin", adminRouter);
router.use("/ai", aiRouter);
router.use("/rewards", rewardsRouter);

export default router;
