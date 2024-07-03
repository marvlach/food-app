import express from "express";
import { routes } from "./routes";
import { settings } from "./globals/settings";
import { globalErrorMiddleware } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import { credentials } from "./middlewares/credentials.middleware";
import { corsRules } from "./middlewares/cors.middleware";

const app = express();

app.set("view engine", "ejs");

app.use(credentials);
app.use(corsRules);

app.use(cookieParser());
app.use(express.json());

// add routes
app.get(`/`, async (_, res) => {
  res.json({ message: "Up and running" });
});

for (const path in routes) {
  app.use(`/${path}`, routes[path as keyof typeof routes]);
}

// errors
app.use(globalErrorMiddleware);

// start
app.listen(settings.port, () => {
  console.log(`🚀 Server ready at: http://localhost:${settings.port}`);
});
