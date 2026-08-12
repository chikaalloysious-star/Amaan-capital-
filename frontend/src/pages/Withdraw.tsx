import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Withdraw() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("TRC20");
  const [walletAddress, setWalletAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBalance() {
    try {
      setError("");

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
        throw balanceError;
      }

      if (data) {
        setBalance(Number(data.balance || 0));
        setCurrency(data.currency || "USDT");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your balance."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBalance();
  }, []);

  async function submitWithdrawal(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const withdrawalAmount = Number(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (withdrawalAmount > balance) {
      setError("Insufficient available balance.");
      return;
    }

    if (!walletAddress.trim()) {
      setError("Please enter your destination wallet address.");
      return;
    }

    if (
      network === "TRC20" &&
      walletAddress.trim().length < 20
    ) {
      setError("Please enter a valid TRC20 wallet address.");
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      /*
       * The current withdrawals table contains:
       * user_id
       * amount
       * currency
       * destination
       * status
       *
       * So we insert only those fields.
       */

      const { error: withdrawalError } = await supabase
        .from("withdrawals")
        .insert({
          user_id: user.id,
          amount: withdrawalAmount,
          currency,
          destination: walletAddress.trim(),
          status: "pending",
        });

      if (withdrawalError) {
        throw withdrawalError;
      }

      setAmount("");
      setWalletAddress("");

      setMessage(
        "Withdrawal request submitted successfully. It is now pending admin review."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit withdrawal request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading withdrawal page...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="border-b border-yellow-500/20">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-yellow-400"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">

        <p className="text-sm uppercase tracking-widest text-yellow-400 font-semibold">
          Account
        </p>

        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">
          Withdraw{" "}
          <span className="text-yellow-400">
            Funds
          </span>
        </h1>

        <p className="mt-4 text-gray-400">
          Request a withdrawal to your cryptocurrency wallet.
        </p>

        <div className="mt-8 rounded-3xl border border-yellow-500/20 bg-gray-950 p-6">

          <p className="text-sm text-gray-500">
            Available Balance
          </p>

          <p className="mt-2 text-3xl font-extrabold text-yellow-400">
            {balance.toFixed(2)} {currency}
          </p>

        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-green-300">
            {message}
          </div>
        )}

        <form
          onSubmit={submitWithdrawal}
          className="mt-8 rounded-3xl border border-gray-800 bg-gray-950 p-7"
        >

          <h2 className="text-2xl font-bold">
            Withdrawal Request
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Make sure your wallet address and network are correct.
          </p>

          <div className="mt-6">

            <label className="block text-sm text-gray-400 mb-2">
              Asset
            </label>

            <input
              value={currency}
              readOnly
              className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white"
            />

          </div>

          <div className="mt-5">

            <label className="block text-sm text-gray-400 mb-2">
              Network
            </label>

            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white"
            >
              <option value="TRC20">
                TRON (TRC20)
              </option>
            </select>

          </div>

          <div className="mt-5">

            <label className="block text-sm text-gray-400 mb-2">
              Amount
            </label>

            <div className="relative">

              <input
                type="number"
                min="0"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 pr-20 text-white outline-none focus:border-yellow-400"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-yellow-400">
                {currency}
              </span>

            </div>

          </div>

          <div className="mt-5">

            <label className="block text-sm text-gray-400 mb-2">
              Destination Wallet Address
            </label>

            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your USDT TRC20 wallet address"
              className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
            />

            <p className="mt-2 text-xs text-gray-600">
              Only enter a public wallet address. Never enter a
              private key or seed phrase.
            </p>

          </div>

          <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-300">
            Make sure the destination wallet supports USDT on
            the TRC20 network. Sending to an incompatible network
            may result in permanent loss of funds.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Withdrawal Request"}
          </button>

        </form>

      </main>

    </div>
  );
}

export default Withdraw;
