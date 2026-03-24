import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

import errorHandler from "./middleware/errorHandler.js";
import indexRouter from "./routes/index.routes.js";

const app = express();

app.set('trust proxy', 1);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(compression());

app.use('/api', indexRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export default app;