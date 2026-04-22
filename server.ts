import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/instagram-feed", async (req, res) => {
    try {
      const INSTAGRAM_ACCOUNT = "bakeryspotnetherlands";
      
      // Attempt to fetch and parse the public Instagram profile
      const response = await fetch(`https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win 64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (response.ok) {
        const html = await response.text();
        
        // Modern Instagram often puts data in __additionalDataLoaded
        const additionalDataRegex = /__additionalDataLoaded\('feed',({.+?})\);/g;
        const sharedDataRegex = /_sharedData\s*=\s*({.+?});/g;
        
        let posts = [];
        
        const additionalMatch = additionalDataRegex.exec(html);
        if (additionalMatch && additionalMatch[1]) {
          try {
            const data = JSON.parse(additionalMatch[1]);
            const edges = data.graphql?.user?.edge_owner_to_timeline_media?.edges;
            if (edges) {
              posts = edges.slice(0, 10).map((edge: any) => ({
                id: edge.node.id,
                media_url: edge.node.display_url,
                permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
                caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || "",
                timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString()
              }));
            }
          } catch (e) {
            console.error("Failed to parse additional data", e);
          }
        }
        
        if (posts.length === 0) {
          const sharedMatch = sharedDataRegex.exec(html);
          if (sharedMatch && sharedMatch[1]) {
            try {
              const data = JSON.parse(sharedMatch[1]);
              const user = data.entry_data?.ProfilePage?.[0]?.graphql?.user;
              if (user) {
                posts = user.edge_owner_to_timeline_media.edges.slice(0, 10).map((edge: any) => ({
                  id: edge.node.id,
                  media_url: edge.node.display_url,
                  permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
                  caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || "",
                  timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString()
                }));
              }
            } catch (e) {
              console.error("Failed to parse shared data", e);
            }
          }
        }

        if (posts.length > 0) {
          return res.json(posts);
        }
      }

      // NO-KEY FALLBACK: If scraping is blocked (common for data centers),
      // we provide a "dynamic" feed using the vetted local assets.
      // This ensures the site ALWAYS has a beautiful feed and links to real posts.
      const fallbackFeed = [
        {
          id: 'fb_1',
          media_url: '/Images/RandomIGposts/Screenshot 2026-04-22 at 16-12-57 Instagram.png',
          permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
          caption: 'Vers gebakken bento cakes! 🎂',
          timestamp: new Date().toISOString()
        },
        {
          id: 'fb_2',
          media_url: '/Images/RandomIGposts/Screenshot 2026-04-22 at 16-13-30 Instagram.png',
          permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
          caption: 'Workshop sfeer impressie 💕',
          timestamp: new Date().toISOString()
        },
        {
          id: 'fb_3',
          media_url: '/Images/RandomIGposts/Screenshot 2026-04-22 at 16-13-48 Instagram.png',
          permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
          caption: 'Creativiteit de vrije loop laten!',
          timestamp: new Date().toISOString()
        },
        {
          id: 'fb_4',
          media_url: '/Images/RandomIGposts/Screenshot 2026-04-22 at 16-14-27 Instagram.png',
          permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
          caption: 'Decoratie goals. ✨',
          timestamp: new Date().toISOString()
        },
        {
          id: 'fb_5',
          media_url: '/Images/RandomIGposts/Screenshot 2026-04-22 at 16-14-48 Instagram.png',
          permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
          caption: 'Klaar om mee naar huis te nemen.',
          timestamp: new Date().toISOString()
        }
      ];

      res.json(fallbackFeed);
    } catch (error) {
      console.error("Instagram feed fetch failed:", error);
      res.status(500).json({ error: "Service temporarily unavailable" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
