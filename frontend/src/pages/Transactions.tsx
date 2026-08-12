import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Transaction = {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  currency: string;
  description: string | null;
  reference: string | null;
  created_at: string;
  status: string;
};

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTransactions() {
    try {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error: transactionError } = await supabase
        .from("transactions")
        .select(
          "id,user_id,type,amount,currency,description,reference,created_at,status"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (transactionError) {
        throw transactionError;
      }

      setTransactions(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();

    const interval = setInterval(() => {
      loadTransactions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  function isWithdrawal(type: string) {
    return type.toLowerCase().includes("withdraw");
  }

  function isDeposit(type: string) {
    return (
      type.toLowerCase().includes("deposit") ||
      type.toLowerCase().includes("credit")
    );
  }

  function formatType(type: string) {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatStatus(status: string) {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function statusClass(status: string) {
    const value = status.toLowerCase();

    if (
      value === "approved" ||
      value === "completed" ||
      value === "success" ||
      value === "successful"
    ) {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (value === "rejected" || value === "failed") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-semibold text-yellow-400">
          Loading transactions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="border-b border-yellow-500/20 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-semibold text-gray-400 hover:text-yellow-400 transition"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* TITLE */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Account
          </p>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            Transaction <span className="text-yellow-400">History</span>
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Review your deposits, withdrawals and other account activity.
          </p>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {/* TRANSACTIONS */}
        <section className="mt-10">

          <div className="rounded-3xl border border-gray-800 bg-gray-950 overflow-hidden">

            {/* DESKTOP HEADER */}
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-gray-800 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <div>Transaction</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>

            {transactions.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-3xl">
                  📜
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  No transactions yet
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your deposits, withdrawals and other activity will appear here.
                </p>

                <Link
                  to="/deposit"
                  className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300 transition"
                >
                  Make a Deposit
                </Link>

              </div>

            ) : (

              <div className="divide-y divide-gray-900">

                {transactions.map((transaction) => {

                  const withdrawal = isWithdrawal(transaction.type);
                  const deposit = isDeposit(transaction.type);

                  const amountClass = withdrawal
                    ? "text-red-400"
                    : deposit
                    ? "text-green-400"
                    : "text-yellow-400";

                  const amountPrefix = withdrawal ? "-" : "+";

                  return (
                    <div
                      key={transaction.id}
                      className="px-6 py-6 transition hover:bg-gray-900/50"
                    >

                      {/* MOBILE / DESKTOP CONTENT */}
                      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:items-center">

                        {/* TRANSACTION */}
                        <div className="flex items-center gap-4">

                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                              withdrawal
                                ? "bg-red-500/10"
                                : "bg-green-500/10"
                            }`}
                          >
                            {withdrawal ? "↑" : "↓"}
                          </div>

                          <div className="min-w-0">

                            <p className="font-bold">
                              {formatType(transaction.type)}
                            </p>

                            {transaction.description && (
                              <p className="mt-1 truncate text-sm text-gray-500">
                                {transaction.description}
                              </p>
                            )}

                            {transaction.reference && (
                              <p className="mt-1 truncate text-xs text-gray-700">
                                Ref: {transaction.reference}
                              </p>
                            )}

                          </div>

                        </div>

                        {/* AMOUNT */}
                        <div>

                          <p className="text-xs text-gray-600 md:hidden">
                            Amount
                          </p>

                          <p className={`mt-1 font-extrabold ${amountClass}`}>
                            {amountPrefix}
                            {Number(transaction.amount).toFixed(2)}{" "}
                            {transaction.currency}
                          </p>

                        </div>

                        {/* STATUS */}
                        <div>

                          <p className="text-xs text-gray-600 md:hidden">
                            Status
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(
                              transaction.status
                            )}`}
                          >
                            {formatStatus(transaction.status)}
                          </span>

                        </div>

                        {/* DATE */}
                        <div>

                          <p className="text-xs text-gray-600 md:hidden">
                            Date
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString()}
                          </p>

                          <p className="text-xs text-gray-600">
                            {new Date(
                              transaction.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </section>

        {/* BOTTOM ACTIONS */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">

          <Link
            to="/dashboard"
            className="rounded-xl border border-gray-800 bg-gray-950 px-6 py-4 text-center font-bold text-gray-300 hover:border-yellow-500/40 hover:text-yellow-400 transition"
          >
            ← Back to Dashboard
          </Link>

          <Link
            to="/deposit"
            className="rounded-xl bg-yellow-400 px-6 py-4 text-center font-bold text-black hover:bg-yellow-300 transition"
          >
            + Make a Deposit
          </Link>

          <Link
            to="/withdraw"
            className="rounded-xl border border-yellow-500/30 px-6 py-4 text-center font-bold text-yellow-400 hover:bg-yellow-400/10 transition"
          >
            Withdraw Funds
          </Link>

        </div>

        {/* LIVE INDICATOR */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-600">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          Transaction history updates automatically
        </div>

      </main>

    </div>
  );
}

export default Transactions;
