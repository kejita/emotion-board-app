import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getEmotionBoardPosts } from "../db";

/**
 * Fetch initial posts and inject them as window.__INITIAL_POSTS__ into the HTML.
 * This eliminates the JS waterfall: the browser can render content immediately
 * after JS hydrates, without waiting for a separate tRPC round-trip.
 */
async function injectInitialData(html: string): Promise<string> {
  try {
    const posts = await getEmotionBoardPosts(undefined, undefined, 20, 0);
    // Serialize safely — escape </script> to prevent XSS
    const json = JSON.stringify(posts).replace(/<\/script>/gi, '<\\/script>');
    const injection = `<script>window.__INITIAL_POSTS__ = ${json};</script>`;
    return html.replace('</head>', `${injection}\n</head>`);
  } catch {
    // If prefetch fails, fall back to normal client-side fetch
    return html;
  }
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      let page = await vite.transformIndexHtml(url, template);
      // Inject prefetched posts to eliminate tRPC waterfall on first load
      page = await injectInitialData(page);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (_req, res) => {
    try {
      let html = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      html = await injectInitialData(html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch {
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
