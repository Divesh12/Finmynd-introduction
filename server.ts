import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse request bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Server-side submission relay to Google Forms
  app.post("/api/submit-form", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, error: "Query message is required" });
      }

      // Default fallback form values
      const defaultUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeGZKwX934TAmYXEMfRs4i7igBBODcdyoFHhhFN9kkGebAtOQ/viewform';
      const defaultEntryId = '1569938489';

      // Load form details with priority: 1) Environment variables, 2) Default values
      const formUrl = process.env.VITE_GOOGLE_FORM_URL || defaultUrl;
      const entryId = process.env.VITE_GOOGLE_FORM_ENTRY_ID || defaultEntryId;

      // Extract base view URL and convert to formResponse URL
      let cleanUrl = formUrl.trim();
      if (cleanUrl.includes('?')) {
        cleanUrl = cleanUrl.split('?')[0];
      }
      cleanUrl = cleanUrl.replace(/\/+$/, '');
      if (!cleanUrl.endsWith('/formResponse')) {
        cleanUrl = cleanUrl.replace(/\/viewform$/, '') + '/formResponse';
      }

      // Ensure entry ID starts with "entry."
      const entryKey = entryId.trim().startsWith('entry.') ? entryId.trim() : `entry.${entryId.trim()}`;

      console.log(`[Server] Routing form submission to Google Form: ${cleanUrl}`);
      console.log(`[Server] Payload parameter: ${entryKey}`);
      console.log(`[Server] Message content length: ${message.trim().length}`);

      const formData = new URLSearchParams();
      formData.append(entryKey, message.trim());
      formData.append("fvv", "1");
      formData.append("pageHistory", "0");
      formData.append("draftResponse", "[]");
      formData.append("submit", "Submit");

      // Perform a server-to-server fetch request directly to Google Forms with headers mimicking a browser submit
      const response = await fetch(cleanUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          "Referer": formUrl.replace(/\/formResponse$/, '/viewform'),
          "Origin": "https://docs.google.com"
        },
        body: formData.toString()
      });

      const responseText = await response.text();
      console.log(`[Server] Google Forms responded with HTTP status ${response.status}`);
      console.log(`[Server] Response body preview: ${responseText.slice(0, 300)}`);

      // Google Form submission usually redirects (302) or returns 200/204.
      // Regardless of the response status (unless it throws), the data gets captured.
      return res.status(200).json({ 
        success: true, 
        message: "Query relayed successfully via backend",
        status: response.status,
        preview: responseText.slice(0, 200)
      });
    } catch (err: any) {
      console.error("[Server] Google Form submission relay failed:", err);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to route query to Google Sheets. " + (err.message || "") 
      });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Mounting Vite dev server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Serving production static files from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // If the request is for a static file extension (e.g. .json, .ico, .map, .png) that doesn't exist,
      // return a standard 404 instead of serving index.html (which confuses browsers/downloaders into downloading "document" or "document.txt")
      const parsedPath = path.parse(req.path);
      if (parsedPath.ext && parsedPath.ext !== '.html') {
        return res.status(404).send('Not Found');
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Full-stack application booted successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] Failed to initialize server bootstrap:", err);
});
