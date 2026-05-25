import path from "path";
import express from "express";
import * as dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { createApp } from "./src/server/app";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  const app = createApp();

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
