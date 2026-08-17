import { useCallback, useEffect, useState } from "react";

type NewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: string;
};

type NewsResponse = {
  success?: boolean;
  articles?: NewsArticle[];
  error?: string;
};

function CryptoNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const loadNews = useCallback(async (manual = false) => {
    try {
      if (manual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        "/api/crypto-news",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`News API returned ${response.status}`);
      }

      const data: NewsResponse = await response.json();

      if (!Array.isArray(data.articles)) {
        throw new Error(data.error || "Invalid news response");
      }

      const formatted: NewsArticle[] = data.articles
        .filter((item) => item && item.title)
        .map((item, index) => ({
          id: String(item.id || `${item.source}-${index}`),
          title: String(item.title || "Crypto News"),
          description: String(item.description || ""),
          url: String(item.url || "#"),
          image: item.image ? String(item.image) : undefined,
          publishedAt: item.publishedAt
            ? new Date(item.publishedAt).toLocaleString()
            : "",
          source: String(item.source || "Crypto"),
        }));

      setArticles(formatted);

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.error("Crypto news error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Live crypto news is temporarily unavailable."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();

    const timer = setInterval(() => {
      loadNews();
    }, 60000);

    return () => clearInterval(timer);
  }, [loadNews]);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col justify-between gap-5 border-b border-gray-800 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
              Amaan Capital
            </p>

            <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
              Crypto <span className="text-yellow-400">News</span>
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Stay informed with the latest developments across the
              cryptocurrency and digital asset markets.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadNews(true)}
            disabled={refreshing}
            className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-bold text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-gray-600">
          <span>
            {lastUpdated
              ? `Last updated ${lastUpdated}`
              : "Loading latest news..."}
          </span>

          <span>Auto-refresh: 1 minute</span>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
            Live crypto news is currently unavailable.
            <div className="mt-2 text-xs text-red-400">
              {error}
            </div>

            <button
              type="button"
              onClick={() => loadNews(true)}
              className="mt-4 rounded-lg border border-red-400/40 px-4 py-2 font-semibold hover:bg-red-400/10"
            >
              Try Again
            </button>
          </div>
        )}

        {loading && articles.length === 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl border border-gray-800 bg-gray-950"
              />
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="mt-10 rounded-3xl border border-gray-800 bg-gray-950 p-10 text-center text-gray-500">
            No crypto news is available right now.
          </div>
        )}

        {articles.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 transition hover:-translate-y-1 hover:border-yellow-500/40"
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt=""
                    className="h-48 w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 text-xs text-gray-600">
                    <span className="font-semibold text-yellow-400">
                      {article.source}
                    </span>

                    <span>{article.publishedAt}</span>
                  </div>

                  <h2 className="mt-4 line-clamp-3 text-lg font-bold leading-7">
                    {article.title}
                  </h2>

                  {article.description && (
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                      {article.description}
                    </p>
                  )}

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-xl border border-gray-700 px-4 py-3 text-sm font-bold text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    Read Full Story →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default CryptoNews;
