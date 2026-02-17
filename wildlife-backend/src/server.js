require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");

// Import models FIRST
const Animal = require("./models/Animal");
const User = require("./models/User");
// Import middleware AFTER models
const { auth, adminAuth } = require("./middleware/auth");

// Import routes AFTER models
const animalRoutes = require("./routes/animals");
const adminAnimalRoutes = require("./routes/adminAnimals");
const authRoutes = require("./routes/auth");
const newsletterRoutes = require("./routes/newsletter");
const reserveRoutes = require("./routes/reserves");
const userRoutes = require("./routes/user");
const mapIconRoutes = require("./routes/mapIcon");

const app = express();

// ========================================
// PRODUCTION READY CONFIGURATION
// ========================================
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

// 1. PERFORMANCE MIDDLEWARE (FIRST)
app.use(compression()); // Gzip compression

// 2. BODY PARSERS (URLS ONLY - NO UPLOADS)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. PRODUCTION SECURITY (STRICTER)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["data:", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// Enhanced rate limiting for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === "production" ? 100 : 500,
  message: { error: "Too many requests from this IP" },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and local dev
    return req.path === "/api/health" || req.ip === "127.0.0.1";
  },
});
app.use("/api/", limiter);

// 4. CORS - PRODUCTION READY
const allowedOrigins = [
  "https://yourdomain.com",
  "https://www.yourdomain.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.some((allowed) => origin?.endsWith(allowed))
      ) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 5. NO STATIC FILES - URLS ONLY
// Images are URLs from external CDNs (Cloudinary, Unsplash, etc.)

// ========================================
// DATABASE - PRODUCTION READY
// ========================================
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGODB_URI required in .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 30000, // 30s timeout
    maxPoolSize: 10, // Connection pooling
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB failed:", err);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`🛑 Received ${signal}. Closing gracefully...`);
  await mongoose.connection.close();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// ========================================
// ROUTES - CLEAN PRODUCTION ORDER
// ========================================
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/reserves", reserveRoutes);
app.use("/api/mapIcon", mapIconRoutes);

app.use("/api/admin/animals", adminAnimalRoutes);
app.use("/api/admin/users", userRoutes); // Admin can manage users too
app.use("/api/admin/reserves", reserveRoutes); // Admin can manage reserves too

// ========================================
// PRODUCTION ADMIN STATS
// ========================================
app.get("/api/admin/stats", async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          categories: { $push: { category: "$_id", count: "$count" } },
        },
      },
    ];

    const [stats] = await Animal.aggregate(pipeline);
    res.json({
      totalAnimals: stats?.total || 0,
      categories: stats?.categories || [],
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ========================================
// SEED - DISABLED IN PRODUCTION
// ========================================
if (NODE_ENV !== "production") {
  app.post("/api/seed", async (req, res) => {
    try {
      await Animal.deleteMany({});

      const seedAnimals = [
        {
          name: "Bengal Tiger",
          category: "mammals",
          image:
            "https://images.unsplash.com/photo-1556228570-65fa9986a3ac?w=400", // URL only
          facts: "Largest big cat in Asia",
          habitat: "Tropical forests",
          diet: "carnivore",
          description: "India's national animal, powerful predator",
          conservationStatus: "EN",
        },
        {
          name: "Indian Peafowl",
          category: "birds",
          image:
            "https://images.unsplash.com/photo-1574194295394-f4dd879bd90c?w=400",
          facts: "National bird of India",
          habitat: "Open forests",
          diet: "omnivore",
          description: "Famous for iridescent tail feathers",
          conservationStatus: "LC",
        },
        {
          name: "Saltwater Crocodile",
          category: "reptiles",
          image:
            "https://images.unsplash.com/photo-1605793184511-1f7a4e7cd1bd?w=400",
          facts: "Largest living reptile",
          habitat: "Estuaries & rivers",
          diet: "carnivore",
          description: "Apex predator of waterways",
          conservationStatus: "LC",
        },
      ];

      await Animal.insertMany(seedAnimals);
      res.json({ success: true, count: seedAnimals.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ========================================
// HEALTH CHECK - PRODUCTION READY
// ========================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: process.memoryUsage(),
  });
});

// ========================================
// 404 & ERROR HANDLING - PRODUCTION
// ========================================
app.use((req, res, next) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("🚨 ERROR:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  const status = err.status || 500;
  res.status(status).json({
    error: status === 404 ? "Not Found" : "Internal Server Error",
    ...(NODE_ENV === "development" && { details: err.message }),
  });
});

// ========================================
// START SERVER
// ========================================
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV.toUpperCase()}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  if (NODE_ENV !== "production") {
    console.log(`🌱 Seed: http://localhost:${PORT}/api/seed`);
  }
});

// Error handling
process.on("unhandledRejection", (reason) => {
  console.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:", error);
  process.exit(1);
});

module.exports = app;
