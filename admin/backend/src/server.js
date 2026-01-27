require("dotenv").config();

const app = require("./app");
const { pool } = require("./database/connection");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    logger.info("Database connection established");
    return true;
  } catch (error) {
    logger.error("Database connection failed", { error: error.message });
    return false;
  }
};

const startServer = async () => {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    logger.error("Cannot start server without database connection");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log("----------------- SERVER RUNNING -----------------");
    console.log("http://localhost:" + PORT);
    
    
    logger.info(`Server running on port ${PORT}`, {
      environment: process.env.NODE_ENV || "development",
    });
  });
};

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  await pool.end();
  process.exit(0);
});

startServer();
