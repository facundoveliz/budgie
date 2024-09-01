import type { NextFunction, Request, Response } from "express";
import { collectDefaultMetrics, Counter, Histogram, Registry } from "prom-client";

export const register = new Registry();
collectDefaultMetrics({ register });

const requestCounter = new Counter({
	name: "http_requests_total",
	help: "Total number of HTTP requests",
	labelNames: ["method", "route", "code"],
	registers: [register],
});

const httpRequestDurationMicroseconds = new Histogram({
	name: "http_request_duration_seconds",
	help: "Duration of HTTP requests in seconds",
	labelNames: ["method", "route", "code"],
	registers: [register],
});

export const metricsHandler = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    const { method, originalUrl: route } = req;
    const { statusCode: code } = res;
    end({ method, route, code });
    requestCounter.inc({ method, route, code });
  });
  next();
};
