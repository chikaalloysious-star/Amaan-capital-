import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Deposit = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  reference: string | null;
  created_at: string;
};

function AdminDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  async function loadDeposits() {
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

      const { data, error: depositError } = await supabase
        .from("deposits")
        .select("*")
        .order("created_at", { ascending: false });

      if (depositError) {
        throw depositError;
      }

      console.log("ADMIN DEPOSITS FROM SUPABASE:", data);
      setDeposits(data || []);
    } catch (err: any) {
      console.error("Load deposits error:", err);

      setError(
        err?.message ||
        err?.details ||
        err?.hint ||
        "Unable to load deposits."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeposits();
  }, []);

  async function updateStatus(
    id: string,
    status: "approved" | "rejected"
  ) {
    try {
      setUpdating(id);
      setError("");

      if (status === "approved") {
        const { data, error: approveError } =
          await supabase.rpc("approve_deposit", {
            p_deposit_id: id,
          });

        console.log("approve_deposit result:", data);
        console.log("approve_deposit error:", approveError);

        if (approveError) {
          throw approveError;
        }
      } else {
        const { error: rejectError } = await supabase
          .from("deposits")
          .update({ status: "rejected" })
          .eq("id", id);

        if (rejectError) {
          throw rejectError;
        }
      }

      await loadDeposits();
    } catch (err: any) {
      console.error("Deposit update error:", err);

      const detailedError =
        err?.message ||
        err?.details ||
        err?.hint ||
        err?.code ||
        "Unable to update deposit.";

      setError(`Deposit update failed: ${detailedError}`);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading deposits...
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
          Deposit <span className="text-yellow-400">Management</span>
        </h1>

        <p className="text-gray-400 mt-4">
          Review and manage deposit requests submitted by users.
        </p>

        {error && (
          <div className="mt-8 border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-red-300">
            {error}
          </div>
        )}

        <section className="mt-10">

          {deposits.length === 0 ? (

            <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 text-gray-500">
              No deposit requests yet.
            </div>

          ) : (

            <div className="space-y-5">

              {deposits.map((deposit) => (

                <div
                  key={deposit.id}
                  className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="text-2xl font-bold">
                          {deposit.amount} {deposit.currency}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            deposit.status === "pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : deposit.status === "approved"
                              ? "bg-green-400/10 text-green-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {deposit.status.toUpperCase()}
                        </span>

                      </div>

                      <p className="text-gray-500 text-sm mt-3">
                        User ID: {deposit.user_id}
                      </p>

                      {deposit.reference && (
                        <p className="text-gray-500 text-sm mt-1">
                          Reference: {deposit.reference}
                        </p>
                      )}

                      <p className="text-gray-600 text-xs mt-2">
                        {new Date(
                          deposit.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                    {deposit.status === "pending" && (

                      <div className="flex gap-3">

                        <button
                          disabled={updating === deposit.id}
                          onClick={() =>
                            updateStatus(
                              deposit.id,
                              "approved"
                            )
                          }
                          className="bg-green-500 text-black px-5 py-3 rounded-xl font-bold disabled:opacity-50"
                        >
                          {updating === deposit.id
                            ? "Updating..."
                            : "Approve"}
                        </button>

                        <button
                          disabled={updating === deposit.id}
                          onClick={() =>
                            updateStatus(
                              deposit.id,
                              "rejected"
                            )
                          }
                          className="border border-red-500/40 text-red-400 px-5 py-3 rounded-xl font-bold disabled:opacity-50"
                        >
                          Reject
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

export default AdminDeposits;

