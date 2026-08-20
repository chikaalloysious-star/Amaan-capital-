import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

type Plan = {
  name: string;
  min: number;
  max: number;
  roi: number;
  duration: number;
  featured?: boolean;
  minimumWithdrawal: number;
};

const plans: Plan[] = [
  {
    name: "Starter",
    min: 100,
    max: 999,
    roi: 0.40,
    duration: 30,
    minimumWithdrawal: 25,
  },
  {
    name: "Silver",
    min: 1000,
    max: 9999,
    roi: 0.45,
    duration: 30,
    minimumWithdrawal: 50,
  },
  {
    name: "Gold",
    min: 10000,
    max: 49999,
    roi: 0.50,
    duration: 30,
    minimumWithdrawal: 100,
    featured: true,
  },
  {
    name: "Platinum",
    min: 50000,
    max: 99999,
    roi: 0.55,
    duration: 30,
    minimumWithdrawal: 250,
  },
  {
    name: "Diamond",
    min: 100000,
    max: 599999,
    roi: 0.60,
    duration: 30,
    minimumWithdrawal: 500,
  },
  {
    name: "Elite",
    min: 600000,
    max: 600000,
    roi: 0.65,
    duration: 30,
    minimumWithdrawal: 1000,
  },
];

function formatUSDT(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateROI(
  principal: number,
  dailyROI: number,
  duration: number
) {
  return principal * (dailyROI / 100) * duration;
}

function Plans() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("USDT");
  const [loadingBalance, setLoadingBalance] = useState(true);

  const [selectedPlan, setSelectedPlan] =
    useState<Plan | null>(null);

  const [amount, setAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBalance() {
      setLoadingBalance(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error: balanceError } = await supabase
        .from("account_balances")
        .select("balance,currency")
        .eq("user_id", user.id)
        .maybeSingle();

      if (balanceError) {
        setError(balanceError.message);
      } else if (data) {
        setBalance(Number(data.balance || 0));
        setCurrency(data.currency || "USDT");
      }

      setLoadingBalance(false);
    }

    loadBalance();
  }, [navigate]);

  async function handleInvest() {
    setError("");
    setMessage("");

    if (!selectedPlan) {
      return;
    }

    const investmentAmount = Number(amount);

    if (!investmentAmount || investmentAmount <= 0) {
      setError(t.invalidInvestmentAmount);
      return;
    }

    if (
      investmentAmount < selectedPlan.min ||
      investmentAmount > selectedPlan.max
    ) {
      setError(
        `${selectedPlan.name}: ${formatUSDT(
          selectedPlan.min
        )} - ${formatUSDT(selectedPlan.max)} USDT.`
      );
      return;
    }

    if (investmentAmount > balance) {
      setError(t.insufficientBalance);
      return;
    }

    setInvesting(true);

    const { error: investmentError } = await supabase.rpc(
      "create_investment",
      {
        p_plan_name: selectedPlan.name,
        p_amount: investmentAmount,
        p_currency: currency,
      }
    );

    if (investmentError) {
      setError(investmentError.message);
      setInvesting(false);
      return;
    }

    setBalance(
      (current) => current - investmentAmount
    );

    setMessage(
      `${formatUSDT(investmentAmount)} ${currency} ${t.investmentSuccessful}`
    );

    setAmount("");
    setInvesting(false);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white md:px-12">

      <div className="mx-auto max-w-5xl text-center">

        <Link
          to="/"
          className="text-2xl font-extrabold text-yellow-400"
        >
          Amaan Capital
        </Link>

        <h1 className="mt-10 text-4xl font-bold md:text-6xl">
          {t.investment}{" "}
          <span className="text-yellow-400">
            {t.plans}
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
          {t.plansDescription}
        </p>

        <div className="mt-6 inline-block rounded-2xl border border-gray-800 bg-gray-950 px-6 py-4">

          <p className="text-sm text-gray-500">
            {t.availableBalance}
          </p>

          <p className="mt-1 text-2xl font-extrabold text-yellow-400">
            {loadingBalance
              ? t.loading
              : `${formatUSDT(balance)} ${currency}`}
          </p>

        </div>
      </div>

      {error && (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-300">
          {error}
        </div>
      )}

      {message && (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-300">
          {message}
        </div>
      )}

      <div className="mx-auto mt-14 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {plans.map((plan) => {
          const dailyROI = calculateROI(
            plan.max,
            plan.roi,
            1
          );

          const totalROI = calculateROI(
            plan.max,
            plan.roi,
            plan.duration
          );

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-7 transition hover:-translate-y-1 ${
                plan.featured
                  ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10"
                  : "border-gray-800 bg-gray-900/70 hover:border-yellow-500/50"
              }`}
            >

              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-black">
                    {t.mostPopular}
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold">
                {plan.name}
              </h2>

              <p className="mt-5 text-sm text-gray-500">
                {t.investmentRange}
              </p>

              <p className="mt-1 text-2xl font-extrabold text-yellow-400">
                {formatUSDT(plan.min)} USDT
              </p>

              <p className="text-sm text-gray-500">
                {t.to} {formatUSDT(plan.max)} USDT
              </p>

              <div className="my-6 border-t border-gray-800" />

              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-400">
                  {t.dailyROI}
                </span>

                <span className="font-bold text-yellow-400">
                  {plan.roi.toFixed(2)}%
                </span>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-400">
                  {t.duration}
                </span>

                <span className="font-semibold">
                  {plan.duration} {t.days}
                </span>
              </div>

              <div className="mb-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🔒</span>

                  <div>
                    <p className="font-semibold text-yellow-400">
                      Locked until maturity
                    </p>

                    <p className="mt-1 text-sm leading-5 text-gray-400">
                      Your investment and earnings remain locked
                      until the {plan.duration}-day investment period
                      is completed.
                    </p>

                    <p className="mt-2 text-sm font-medium text-gray-300">
                      Earnings become withdrawable after maturity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-400">
                  {t.minimumWithdrawal}
                </span>

                <span className="font-semibold">
                  {formatUSDT(plan.minimumWithdrawal)} USDT
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-black/50 p-4">

                <p className="text-sm text-gray-500">
                  {t.dailyROIAtMaximum}
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {formatUSDT(dailyROI)} USDT
                </p>

              </div>

              <div className="mt-4">

                <p className="text-sm text-gray-500">
                  {t.totalROIOver} {plan.duration} {t.days}
                </p>

                <p className="mt-1 text-xl font-bold text-yellow-400">
                  {formatUSDT(totalROI)} USDT
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlan(plan);
                  setAmount("");
                  setError("");
                  setMessage("");
                }}
                className={`mt-8 w-full rounded-xl py-4 text-center font-bold transition ${
                  plan.featured
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "border border-yellow-500 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                {t.choose} {plan.name}
              </button>

            </div>
          );
        })}

      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5">

          <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-7">

            <h2 className="text-2xl font-bold">
              {t.investIn}{" "}
              <span className="text-yellow-400">
                {selectedPlan.name}
              </span>
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {t.enterAmountBetween}{" "}
              {formatUSDT(selectedPlan.min)}{" "}
              {t.and}{" "}
              {formatUSDT(selectedPlan.max)} USDT.
            </p>

            <p className="mt-5 text-sm text-gray-400">
              {t.available}:{" "}
              <span className="font-bold text-yellow-400">
                {formatUSDT(balance)} {currency}
              </span>
            </p>

            <input
              type="number"
              min={selectedPlan.min}
              max={selectedPlan.max}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.enterInvestmentAmount}
              className="mt-4 w-full rounded-xl border border-gray-700 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
            />

            <button
              type="button"
              onClick={handleInvest}
              disabled={investing}
              className="mt-5 w-full rounded-xl bg-yellow-400 py-4 font-bold text-black disabled:opacity-50"
            >
              {investing
                ? t.processing
                : t.confirmInvestment}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPlan(null);
                setAmount("");
                setError("");
              }}
              disabled={investing}
              className="mt-3 w-full rounded-xl border border-gray-700 py-4 font-bold text-gray-300"
            >
              {t.cancel}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Plans;
