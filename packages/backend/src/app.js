JavaScript
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path"); //se der erro foi isso 1

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Muitas requisições. Tente novamente em 15 minutos." },
  })
);

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://biko-app.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origem não permitida pelo CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// se der erro foi isso 2
app.use(express.static(path.join(__dirname, '../frontend')));

app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "Bíko API", timestamp: new Date().toISOString() });
});

//se der erro foi isso 3
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use(errorHandler);

module.exports = app;
