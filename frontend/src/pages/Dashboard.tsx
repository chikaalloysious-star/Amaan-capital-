import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
};

const COINS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "ripple",
];

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("USDT");
  const [investmentTotal, setInvestmentTotal] = useState(0);
  const [activeInvestments, setActiveInvestments] = useState<any[]>([]);

  const [marketData, setMarketData] = useState<Coin[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState("");
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState("");
  const [investmentError, setInvestmentError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const loadBalance = useCallback(async () => {
    try {
      setBalanceError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("account_balances")
        .select("balance,currency")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setBalance(Number(data.balance || 0));
        setCurrency(data.currency || "USDT");
      } else {
        setBalance(0);
        setCurrency("USDT");
      }
    } catch (error) {
      console.error("Balance error:", error);

      setBalanceError(
        error instanceof Error
          ? error.message
          : "Unable to load account balance."
      );
    } finally {
      setLoadingBalance(false);
    }
  }, [navigate]);

  const loadInvestments = useCallback(async () => {
    try {
      setInvestmentError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("investments")
        .select(
          "plan_name,amount,currency,status,started_at,ends_at"
        )
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      const active = (data || []).filter(
        (investment) =>
          String(investment.status || "")
            .trim()
            .toLowerCase() === "active"
      );

      setActiveInvestments(active);

      const total = active.reduce(
        (sum, investment) =>
          sum + Number(investment.amount || 0),
        0
      );

      setInvestmentTotal(total);
    } catch (error) {
      console.error("Investment error:", error);

      setInvestmentError(
        error instanceof Error
          ? error.message
          : "Unable to load investments."
      );
    }
  }, [navigate]);

  const getMarkets = useCallback(async () => {
    try {
      setMarketError("");

      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets" +
          "?vs_currency=usd" +
          `&ids=${COINS.join(",")}` +
          "&order=market_cap_desc" +
          "&per_page=6" +
          "&page=1" +
          "&sparkline=false" +
          "&price_change_percentage=24h"
      );

      if (!response.ok) {
        throw new Error("Market request failed");
      }

      const data: Coin[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid market response");
      }

      setMarketData(data);

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (error) {
      console.error("Market error:", error);
      setMarketError(
        "Live market data is temporarily unavailable."
      );
    } finally {
      setMarketLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
    loadInvestments();
    getMarkets();

    const marketTimer = setInterval(() => {
      getMarkets();
    }, 60000);

    const accountTimer = setInterval(() => {
      loadBalance();
      loadInvestments();
    }, 30000);

    return () => {
      clearInterval(marketTimer);
      clearInterval(accountTimer);
    };
  }, [loadBalance, loadInvestments, getMarkets]);

  const formatMoney = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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

  const portfolioBalance = balance + investmentTotal;

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="border-b border-yellow-500/20 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:block">
              {t.welcomeBack}
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 font-bold text-black">
              U
            </div>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* INTRO */}

        <section className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            {t.dashboard}
          </p>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            {t.welcomeBack}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            {t.dashboardDescription}
          </p>
        </section>

        {/* BALANCE CARDS */}

        <section className="grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              {t.portfolioBalance}
            </p>

            {loadingBalance ? (
              <p className="mt-3 text-2xl font-bold text-yellow-400">
                {t.loading}
              </p>
            ) : (
              <p className="mt-3 text-3xl font-extrabold text-yellow-400">
                {formatMoney(portfolioBalance)} {currency}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-600">
              {t.availableFundsActiveInvestments}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              {t.activeInvestments}
            </p>

            {investmentError ? (
              <p className="mt-3 text-sm text-red-400">
                {t.unableToLoad}
              </p>
            ) : (
              <p className="mt-3 text-3xl font-extrabold">
                {formatMoney(investmentTotal)} {currency}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-600">
              {t.currentlyInvested}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              {t.availableBalance}
            </p>

            {loadingBalance ? (
              <p className="mt-3 text-2xl font-bold text-yellow-400">
                {t.loading}
              </p>
            ) : (
              <p className="mt-3 text-3xl font-extrabold">
                {formatMoney(balance)} {currency}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-600">
              {t.readyToUse}
            </p>
          </div>

        </section>

        {/* REFERRAL PROGRAM */}

        <section className="mt-6 rounded-3xl border border-yellow-500/20 bg-gray-950 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                Referral Program
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">
                Invite & Earn
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Invite friends to Amaan Capital and earn referral rewards.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/referral")}
              className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300"
            >
              Open Referral Program
            </button>
          </div>
        </section>


        {/* ERRORS */}

        {balanceError && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {t.unableToLoadBalance}: {balanceError}
          </div>
        )}

        {investmentError && (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {t.unableToLoadInvestments}: {investmentError}
          </div>
        )}

        {/* ACTIVE PORTFOLIO */}

        <section className="mt-10">
          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6">

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                  {t.activePortfolio}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {t.investmentDetails}
                </h2>
              </div>

              <span className="text-sm text-gray-500">
                {activeInvestments.length} {t.active}
              </span>

            </div>

            {activeInvestments.length === 0 ? (
              <p className="mt-6 text-gray-500">
                {t.noActiveInvestments}
              </p>
            ) : (
              <div className="mt-6 space-y-4">

                {activeInvestments.map(
                  (investment, index) => {
                    const start = new Date(
                      investment.started_at
                    );

                    const end = new Date(
                      investment.ends_at
                    );

                    const now = new Date();

                    const totalDays = Math.max(
                      1,
                      Math.ceil(
                        (end.getTime() -
                          start.getTime()) /
                          86400000
                      )
                    );

                    const remainingDays = Math.max(
                      0,
                      Math.ceil(
                        (end.getTime() -
                          now.getTime()) /
                          86400000
                      )
                    );

                    const progress = Math.min(
                      100,
                      Math.max(
                        0,
                        ((totalDays -
                          remainingDays) /
                          totalDays) *
                          100
                      )
                    );

                    return (
                      <div
                        key={`${investment.plan_name}-${investment.started_at}-${index}`}
                        className="rounded-2xl border border-gray-800 bg-black/40 p-5"
                      >

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                          <div>
                            <p className="text-sm text-gray-500">
                              {t.plan}
                            </p>

                            <p className="text-2xl font-bold text-yellow-400">
                              {investment.plan_name}
                            </p>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500">
                              {t.invested}
                            </p>

                            <p className="text-2xl font-extrabold">
                              {formatMoney(
                                Number(
                                  investment.amount
                                )
                              )}{" "}
                              {investment.currency}
                            </p>
                          </div>

                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">

                          <div>
                            <p className="text-xs text-gray-500">
                              {t.started}
                            </p>

                            <p className="mt-1 font-semibold">
                              {start.toLocaleDateString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              {t.maturity}
                            </p>

                            <p className="mt-1 font-semibold">
                              {end.toLocaleDateString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              {t.remaining}
                            </p>

                            <p className="mt-1 font-semibold text-yellow-400">
                              {remainingDays} {t.days}
                            </p>
                          </div>

                        </div>

                        <div className="mt-6">
                          <div className="mb-2 flex justify-between text-xs text-gray-500">
                            <span>
                              {t.investmentProgress}
                            </span>

                            <span>
                              {Math.round(progress)}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                            <div
                              className="h-full rounded-full bg-yellow-400"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>
        </section>

        {/* LIVE MARKETS */}

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                {t.liveMarkets}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {t.liveMarketDescription}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

              <span className="text-xs font-bold text-green-400">
                LIVE
              </span>
            </div>

          </div>

          {marketLoading && (
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-yellow-400" />

              <p className="mt-4 text-sm text-yellow-400">
                {t.loadingLiveMarkets}
              </p>

            </div>
          )}

          {!marketLoading && marketError && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-center">

              <p className="text-sm text-red-300">
                {marketError}
              </p>

              <button
                onClick={() => {
                  setMarketLoading(true);
                  getMarkets();
                }}
                className="mt-4 rounded-xl bg-yellow-400 px-5 py-2 text-sm font-bold text-black"
              >
                {t.tryAgain}
              </button>

            </div>
          )}

          {!marketLoading && !marketError && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {marketData.map((coin) => {
                const change =
                  coin.price_change_percentage_24h ?? 0;

                const positive = change >= 0;

                return (
                  <div
                    key={coin.id}
                    className="rounded-3xl border border-gray-800 bg-gray-950 p-5 transition hover:-translate-y-1 hover:border-yellow-500/40"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="h-10 w-10 rounded-full"
                        />

                        <div>
                          <h3 className="font-bold">
                            {coin.name}
                          </h3>

                          <p className="text-xs uppercase text-gray-600">
                            {coin.symbol}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          positive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>

                    </div>

                    <p className="mt-6 text-xs uppercase text-gray-600">
                      {t.price}
                    </p>

                    <p className="mt-1 text-2xl font-extrabold text-yellow-400">
                      ${formatPrice(coin.current_price)}
                    </p>

                  </div>
                );
              })}

            </div>
          )}

          {lastUpdated && !marketError && (
            <p className="mt-4 text-right text-xs text-gray-700">
              {t.updated} {lastUpdated} • {t.refreshesEvery60Seconds}
            </p>
          )}

        </section>

        {/* ACCOUNT ACTIONS */}

        <section className="mt-12">

          <h2 className="mb-5 text-2xl font-bold">
            {t.account}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <Link
              to="/markets"
              className="group rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black">
                📊
              </div>

              <h3 className="text-xl font-bold">
                {t.markets}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t.viewLiveCrypto}
              </p>

              <div className="mt-5 text-sm font-bold text-yellow-400">
                {t.viewMarkets} →
              </div>
            </Link>

            <Link
              to="/plans"
              className="group rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black">
                💰
              </div>

              <h3 className="text-xl font-bold">
                {t.investments}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t.explorePlans}
              </p>

              <div className="mt-5 text-sm font-bold text-yellow-400">
                {t.viewPlans} →
              </div>
            </Link>

            <Link
              to="/deposit"
              className="group rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black">
                💳
              </div>

              <h3 className="text-xl font-bold">
                {t.deposit}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t.addFundsDescription}
              </p>

              <div className="mt-5 text-sm font-bold text-yellow-400">
                {t.addFunds} →
              </div>
            </Link>

            <Link
              to="/withdraw"
              className="group rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black">
                💸
              </div>

              <h3 className="text-xl font-bold">
                {t.withdraw}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t.withdrawDescription}
              </p>

              <div className="mt-5 text-sm font-bold text-yellow-400">
                {t.requestWithdrawal} →
              </div>
            </Link>

            <Link
              to="/transactions"
              className="group rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black">
                🧾
              </div>

              <h3 className="text-xl font-bold">
                {t.transactions}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t.transactionDescription}
              </p>

              <div className="mt-5 text-sm font-bold text-yellow-400">
                {t.viewTransactions} →
              </div>
            </Link>

            <Link
              to="/profile"
              className="group rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-black">
                👤
              </div>

              <h3 className="text-xl font-bold">
                {t.profile}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t.profileDescription}
              </p>

              <div className="mt-5 text-sm font-bold text-yellow-400">
                {t.viewProfile} →
              </div>
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
