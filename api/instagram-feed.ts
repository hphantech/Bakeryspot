type FeedPost = {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
};

const INSTAGRAM_ACCOUNT = "bakeryspotnetherlands";

function getStaticFallbackFeed(): FeedPost[] {
  const now = new Date().toISOString();
  return [
    {
      id: "fb_1",
      media_url: "/Images/RandomIGposts/Screenshot 2026-04-22 at 16-12-57 Instagram.png",
      permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
      caption: "Vers gebakken bento cakes!",
      timestamp: now,
    },
    {
      id: "fb_2",
      media_url: "/Images/RandomIGposts/Screenshot 2026-04-22 at 16-13-30 Instagram.png",
      permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
      caption: "Workshop sfeer impressie",
      timestamp: now,
    },
    {
      id: "fb_3",
      media_url: "/Images/RandomIGposts/Screenshot 2026-04-22 at 16-13-48 Instagram.png",
      permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
      caption: "Creativiteit de vrije loop laten",
      timestamp: now,
    },
    {
      id: "fb_4",
      media_url: "/Images/RandomIGposts/Screenshot 2026-04-22 at 16-14-27 Instagram.png",
      permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
      caption: "Decoratie goals",
      timestamp: now,
    },
    {
      id: "fb_5",
      media_url: "/Images/RandomIGposts/Screenshot 2026-04-22 at 16-14-48 Instagram.png",
      permalink: `https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`,
      caption: "Klaar om mee naar huis te nemen",
      timestamp: now,
    },
  ];
}

function parsePostsFromLegacyJson(html: string): FeedPost[] {
  const additionalDataRegex = /__additionalDataLoaded\('feed',({.+?})\);/g;
  const sharedDataRegex = /_sharedData\s*=\s*({.+?});/g;
  let posts: FeedPost[] = [];

  const additionalMatch = additionalDataRegex.exec(html);
  if (additionalMatch?.[1]) {
    try {
      const data = JSON.parse(additionalMatch[1]);
      const edges = data.graphql?.user?.edge_owner_to_timeline_media?.edges;
      if (Array.isArray(edges)) {
        posts = edges.slice(0, 10).map((edge: any) => ({
          id: edge.node.id,
          media_url: edge.node.display_url,
          permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
          caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || "",
          timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
        }));
      }
    } catch (_error) {
      // Ignore and continue to next parser.
    }
  }

  if (posts.length > 0) {
    return posts;
  }

  const sharedMatch = sharedDataRegex.exec(html);
  if (sharedMatch?.[1]) {
    try {
      const data = JSON.parse(sharedMatch[1]);
      const edges = data.entry_data?.ProfilePage?.[0]?.graphql?.user?.edge_owner_to_timeline_media?.edges;
      if (Array.isArray(edges)) {
        posts = edges.slice(0, 10).map((edge: any) => ({
          id: edge.node.id,
          media_url: edge.node.display_url,
          permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
          caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || "",
          timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
        }));
      }
    } catch (_error) {
      // Ignore and continue to next parser.
    }
  }

  return posts;
}

function parsePostsFromShortcodes(html: string): FeedPost[] {
  const shortcodeRegex = /"shortcode":"([A-Za-z0-9_-]+)"/g;
  const shortcodes: string[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = shortcodeRegex.exec(html)) !== null) {
    shortcodes.push(match[1]);
    if (shortcodes.length >= 20) {
      break;
    }
  }

  const uniqueShortcodes = [...new Set(shortcodes)].slice(0, 10);
  return uniqueShortcodes.map((shortcode, index) => ({
    id: `sc_${shortcode}_${index}`,
    media_url: `https://www.instagram.com/p/${shortcode}/media/?size=l`,
    permalink: `https://www.instagram.com/p/${shortcode}/`,
    caption: "",
    timestamp: new Date().toISOString(),
  }));
}

export default async function handler(_req: any, res: any) {
  try {
    const response = await fetch(`https://www.instagram.com/${INSTAGRAM_ACCOUNT}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (response.ok) {
      const html = await response.text();
      let posts = parsePostsFromLegacyJson(html);
      if (posts.length === 0) {
        posts = parsePostsFromShortcodes(html);
      }
      if (posts.length > 0) {
        return res.status(200).json(posts);
      }
    }

    return res.status(200).json(getStaticFallbackFeed());
  } catch (_error) {
    return res.status(200).json(getStaticFallbackFeed());
  }
}
