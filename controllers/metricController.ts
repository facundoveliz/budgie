import express from "express";
import { register } from "../middleware/metricsHandlerMiddleware";
import type { Request, Response } from "../types";

const router = express.Router();

export const getMetrics = async (req: Request, res: Response) => {
	res.set("Content-Type", register.contentType);
	res.end(await register.metrics());
};

export default router;
