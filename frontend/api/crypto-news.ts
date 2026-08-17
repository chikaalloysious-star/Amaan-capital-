import type { VercelRequest, VercelResponse } from "@vercel/node";

type NewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: string;
};

const feeds = [
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
  },
  {
    name: "Cointelegraph",
    url: "https://cointelegraph.com/rss",
  },
];

function getTag(xml: string, tag: string) {
  const match = xml.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i")
  );

  return match
    ? match[1]
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/<[^>]+>/g, "")
        .trim()
    : "";
}

function decode(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const results: NewsArticle[] = [];

    for (const feed of feeds) {
      try {
        const response = await fetch(feed.url, {
          headers: {
            "User-Agent": "AmaanCapital-News/1.0",
          },
        });

        if (!response.ok) continue;

        const xml = await response.text();

        const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

        for (const item of items.slice(0, 15)) {
          const title = decode(getTag(item, "title"));
          const link = decode(getTag(item, "link"));
          const description = decode(getTag(item, "description"));
          const pubDate = getTag(item, "pubDate");

          if (!title || !link) continue;

          results.push({
            id: `${feed.name}-${Buffer.from(link).toString("base64")}`,
            title,
            description,
            url: link,
            publishedAt: pubDate
              ? new Date(pubDate).toISOString()
              : new Date().toISOString(),
            source: feed.name,
          });
        }
      } catch (feedError) {
        console.error(`News feed error: ${feed.name}`, feedError);
      }
    }

    results.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );

    if (results.length === 0) {
      return res.status(503).json({
        success: false,
        articles: [],
        error: "No crypto news sources are currently available.",
      });
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).json({
      success: true,
      articles: results.slice(0, 30),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Crypto news API error:", error);

    return res.status(500).json({
      success: false,
      articles: [],
      error: "Unable to load crypto news.",
    });
  }
}
