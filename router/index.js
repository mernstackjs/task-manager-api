import { Router } from "express";

const router = Router();

import taskRoute from "./api/task.js";
import authRoute from "./api/user.js";
router.use("/task", taskRoute);
router.use("/auth", authRoute);

export default router;
