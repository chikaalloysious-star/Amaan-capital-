import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import FloatingCustomerCare from "../components/FloatingCustomerCare";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
  total_volume: number;
  last_updated?: string;
};

const COINS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "ripple",
];

function Markets() {
  const { t } = useLanguage();

  const [marketData, setMarketData] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const getMarkets = useCallback(async () => {
    try {
      setError("");
      setRefreshing(true);

      const url =
        "https://api.coingecko.com/api/v3/coins/markets" +
        "?vs_currency=usd" +
        `&ids=${COINS.join(",")}` +
        "&order=market_cap_desc" +
        "&per_page=6" +
        "&page=1" +
        "&sparkline=false" +
        "&price_change_percentage=24h";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Market provider returned ${response.status}`);
      }

      const data: Coin[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No market data was returned.");
      }

      setMarketData(data);

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.error("Market error:", err);
      setError("Unable to load live market data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getMarkets();

    const timer = setInterval(() => {
      getMarkets();
    }, 60000);

    return () => clearInterval(timer);
  }, [getMarkets]);

  const formatPrice = (price: number) => {
    if (price < 1) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      });
    }

    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatBillions = (value: number) => {
    if (!value) return "$0";

    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }

    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }

    return `$${value.toLocaleString("en-US")}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingCustomerCare />
      <header className="border-b border-yellow-500/20 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-extrabold text-yellow-400">
              Amaan Capital
            </h1>

            <p className="mt-1 text-xs text-gray-600">
              {t.liveCryptocurrencyMarketData}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-green-400">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />
              {t.live}
            </span>

            <button
              onClick={getMarkets}
              disabled={refreshing}
              className="rounded-xl border border-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50"
            >
              {refreshing ? t.updatingMarkets : t.refreshMarkets}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
            {t.liveCryptocurrencyMarketData}
          </p>

          <h2 className="mt-3 text-4xl font-extrabold md:text-6xl">
            {t.markets}
          </h2>

          <p className="mt-5 max-w-2xl text-gray-400">
            {t.liveMarketDescription}
          </p>

          {lastUpdated && (
            <p className="mt-4 text-xs text-gray-600">
              {t.updated} {lastUpdated} {" • "}
              {t.autoRefresh}
            </p>
          )}
        </section>

        {loading && (
          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-800 border-t-yellow-400" />

            <p className="mt-6 font-semibold text-yellow-400">
              {t.loadingLiveMarkets}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {t.connectingToMarketData}
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-10 text-center">
            <h3 className="text-xl font-bold text-red-300">
              {t.marketUnavailable}
            </h3>

            <p className="mt-3 text-gray-400">
              {error}
            </p>

            <button
              onClick={() => {
                setLoading(true);
                getMarkets();
              }}
              className="mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {!loading && !error && (
          <section>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {marketData.map((coin) => {
                const change = coin.price_change_percentage_24h ?? 0;
                const positive = change >= 0;

                return (
                  <article
                    key={coin.id}
                    className="rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="h-12 w-12 rounded-full"
                        />

                        <div>
                          <h3 className="text-lg font-bold">
                            {coin.name}
                          </h3>

                          <p className="text-sm uppercase text-gray-500">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                          positive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="text-xs uppercase tracking-wider text-gray-600">
                        {t.currentPrice}
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-yellow-400">
                        ${coin.id === "tether" ? "1.00" : formatPrice(coin.current_price)}
                      </p>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-black p-4">
                        <p className="text-xs text-gray-600">
                          {t.marketCap}
                        </p>

                        <p className="mt-2 font-bold">
                          {formatBillions(coin.market_cap)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-black p-4">
                        <p className="text-xs text-gray-600">
                          {t.volume24h}
                        </p>

                        <p className="mt-2 font-bold">
                          {formatBillions(coin.total_volume)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Markets;
