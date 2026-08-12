import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Withdrawal = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  destination: string | null;
  status: string;
  created_at: string;
};

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  async function loadWithdrawals() {
    try {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in.");
        return;
      }

      const { data: admin, error: adminError } =
        await supabase.rpc("is_super_admin");

      if (adminError) {
        throw adminError;
      }

      if (!admin) {
        setError("Access denied.");
        return;
      }

      setAuthorized(true);

      const { data, error: withdrawalError } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false });

      if (withdrawalError) {
        throw withdrawalError;
      }

      setWithdrawals(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load withdrawals."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function approveWithdrawal(id: string) {
    try {
      setUpdating(id);
      setError("");

      const { error: rpcError } = await supabase.rpc(
        "approve_withdrawal",
        {
          p_withdrawal_id: id,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setWithdrawals((current) =>
        current.map((withdrawal) =>
          withdrawal.id === id
            ? {
                ...withdrawal,
                status: "approved",
              }
            : withdrawal
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to approve withdrawal."
      );
    } finally {
      setUpdating(null);
    }
  }

  async function rejectWithdrawal(id: string) {
    try {
      setUpdating(id);
      setError("");

      const { error: updateError } = await supabase
        .from("withdrawals")
        .update({
          status: "rejected",
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      setWithdrawals((current) =>
        current.map((withdrawal) =>
          withdrawal.id === id
            ? {
                ...withdrawal,
                status: "rejected",
              }
            : withdrawal
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject withdrawal."
      );
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading withdrawals...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-5">🔒</div>

          <h1 className="text-3xl font-bold">
            Access Denied
          </h1>

          <p className="text-gray-400 mt-3">
            {error}
          </p>

          <Link
            to="/admin"
            className="inline-block mt-7 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <Link
            to="/admin"
            className="text-gray-400 hover:text-yellow-400"
          >
            ← Admin Control Center
          </Link>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">

        <p className="text-yellow-400 uppercase tracking-widest text-sm font-semibold">
          Owner Control
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-3">
          Withdrawal{" "}
          <span className="text-yellow-400">
            Management
          </span>
        </h1>

        <p className="text-gray-400 mt-4">
          Review and manage user withdrawal requests.
        </p>

        {error && (
          <div className="mt-8 border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-red-300">
            {error}
          </div>
        )}

        <section className="mt-10">

          {withdrawals.length === 0 ? (
            <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 text-gray-500">
              No withdrawal requests yet.
            </div>
          ) : (
            <div className="space-y-5">

              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="text-2xl font-bold">
                          {withdrawal.amount}{" "}
                          {withdrawal.currency}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            withdrawal.status === "pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : withdrawal.status === "approved"
                              ? "bg-green-400/10 text-green-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {withdrawal.status.toUpperCase()}
                        </span>

                      </div>

                      <p className="text-gray-500 text-sm mt-3">
                        User ID: {withdrawal.user_id}
                      </p>

                      <p className="text-gray-500 text-sm mt-2 break-all">
                        Destination:{" "}
                        {withdrawal.destination ||
                          "Not provided"}
                      </p>

                      <p className="text-gray-600 text-xs mt-2">
                        Submitted:{" "}
                        {new Date(
                          withdrawal.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                    {withdrawal.status === "pending" && (
                      <div className="flex gap-3">

                        <button
                          type="button"
                          disabled={
                            updating === withdrawal.id
                          }
                          onClick={() =>
                            approveWithdrawal(
                              withdrawal.id
                            )
                          }
                          className="bg-green-500 text-black px-5 py-3 rounded-xl font-bold disabled:opacity-50"
                        >
                          {updating === withdrawal.id
                            ? "Updating..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            updating === withdrawal.id
                          }
                          onClick={() =>
                            rejectWithdrawal(
                              withdrawal.id
                            )
                          }
                          className="border border-red-500/40 text-red-400 px-5 py-3 rounded-xl font-bold disabled:opacity-50"
                        >
                          {updating === withdrawal.id
                            ? "Updating..."
                            : "Reject"}
                        </button>

                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default AdminWithdrawals;
