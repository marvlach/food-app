import express from "express";
import exchangeRouter from "./routes";
import { settings } from "./globals";
import { globalErrorMiddleware } from "./middlewares";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { updateExchangeRates } from "./services";
import { prisma } from "./globals";

const app = express();

app.use(cookieParser());
app.use(express.json());

// add routes
app.get(`/`, async (_, res) => {
  res.json({ message: "Up and running" });
});

app.use('/exchange', exchangeRouter)

// errors
app.use(globalErrorMiddleware);

// run task every minute
cron.schedule(settings.fixerFetchExchangeRatesCronSchedule, async () => await updateExchangeRates(prisma));

// start
app.listen(settings.port, () => {
  console.log(`🚀 Server ready at: http://localhost:${settings.port}`);
});
