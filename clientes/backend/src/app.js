const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const logger = require("./utils/logger");

// Import routes
const productRoutes = require("./routes/product.routes");
const collectionRoutes = require("./routes/collection.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "35mb" }));
app.use(express.urlencoded({ extended: true, limit: "35mb" }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/products", productRoutes);
app.use("/api/collections", collectionRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
