import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Referral = {
  id: string;
  referred_id: string;
  created_at: string;
};

type Reward = {
  id: string;
  referred_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

function Referral() {
  const navigate = useNavigate();

  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");

  async function loadReferralData() {
    try {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: code, error: codeError } =
        await supabase.rpc("get_my_referral_code");

      if (codeError) {
        throw codeError;
      }

      setReferralCode(String(code || ""));

      const { data: referralData, error: referralError } =
        await supabase
          .from("referrals")
          .select("id,referred_id,created_at")
          .eq("referrer_id", user.id)
          .order("created_at", { ascending: false });

      if (referralError) {
        throw referralError;
      }

      setReferrals(referralData || []);

      const { data: rewardData, error: rewardError } =
        await supabase
          .from("referral_rewards")
          .select(
            "id,referred_id,amount,currency,status,created_at"
          )
          .eq("referrer_id", user.id)
          .order("created_at", { ascending: false });

      if (rewardError) {
        throw rewardError;
      }

      setRewards(rewardData || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load referral information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReferralData();
  }, []);

  async function copyReferralLink() {
    if (!referralCode) return;

    const link =
      `${window.location.origin}/register?ref=${encodeURIComponent(
        referralCode
      )}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopyMessage("Referral link copied.");

      setTimeout(() => {
        setCopyMessage("");
      }, 2500);
    } catch {
      setCopyMessage("Unable to copy referral link.");
    }
  }

  const referralLink = referralCode
    ? `${window.location.origin}/register?ref=${encodeURIComponent(
        referralCode
      )}`
    : "";

  const totalRewards = rewards.reduce(
    (total, reward) =>
      reward.status === "approved"
        ? total + Number(reward.amount || 0)
        : total,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading referral program...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link
            to="/dashboard"
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

      <main className="mx-auto max-w-5xl px-6 py-10">

        <p className="text-sm uppercase tracking-widest text-yellow-400 font-semibold">
          Referral Program
        </p>

        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">
          Invite & Earn
        </h1>

        <p className="mt-4 text-gray-400">
          Invite people to Amaan Capital using your personal referral link.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Your Referrals
            </p>

            <p className="mt-2 text-4xl font-extrabold text-yellow-400">
              {referrals.length}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Approved Rewards
            </p>

            <p className="mt-2 text-4xl font-extrabold text-yellow-400">
              {totalRewards.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-500">
              Referral Code
            </p>

            <p className="mt-2 text-xl font-extrabold tracking-widest text-white">
              {referralCode || "—"}
            </p>
          </div>

        </div>

        <section className="mt-8 rounded-3xl border border-yellow-500/20 bg-gray-950 p-7">

          <h2 className="text-2xl font-bold">
            Your Referral Link
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Share this link with someone you want to invite.
          </p>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">

            <input
              value={referralLink}
              readOnly
              className="flex-1 rounded-xl border border-gray-800 bg-black px-4 py-4 text-sm text-gray-300 outline-none"
            />

            <button
              type="button"
              onClick={copyReferralLink}
              className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
            >
              Copy Link
            </button>

          </div>

          {copyMessage && (
            <p className="mt-3 text-sm text-green-400">
              {copyMessage}
            </p>
          )}

        </section>

        <section className="mt-8 rounded-3xl border border-gray-800 bg-gray-950 p-7">

          <h2 className="text-2xl font-bold">
            Your Referrals
          </h2>

          {referrals.length === 0 ? (
            <p className="mt-5 text-gray-500">
              You have not referred anyone yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-black p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Referral
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        referral.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-green-400">
                    Registered
                  </span>
                </div>
              ))}
            </div>
          )}

        </section>

        <section className="mt-8 rounded-3xl border border-gray-800 bg-gray-950 p-7">

          <h2 className="text-2xl font-bold">
            Referral Rewards
          </h2>

          {rewards.length === 0 ? (
            <p className="mt-5 text-gray-500">
              No referral rewards yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-black p-4"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {Number(reward.amount).toFixed(2)}{" "}
                      {reward.currency}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        reward.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="text-xs font-semibold uppercase text-yellow-400">
                    {reward.status}
                  </span>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Referral;
