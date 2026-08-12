import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type KYC = {
  id: string;
  full_name: string | null;
  country: string | null;
  status: string | null;
};

export default function AdminKYC() {
  const [kyc, setKyc] = useState<KYC[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");

    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_super_admin");

    if (adminError) {
      setError(adminError.message);
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      setError("Administrator access required.");
      setLoading(false);
      return;
    }

    const { data, error: kycError } = await supabase
      .from("kyc_verifications")
      .select("id,full_name,country,status")
      .order("created_at", { ascending: false });

    if (kycError) {
      setError(kycError.message);
    } else {
      setKyc(data || []);
    }

    setLoading(false);
  }

  async function changeStatus(
    id: string,
    status: "approved" | "rejected"
  ) {
    setError("");

    const { error: updateError } = await supabase
      .from("kyc_verifications")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading KYC...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <h1 className="text-3xl font-bold">
        KYC Applications
      </h1>

      {error && (
        <p className="mt-4 rounded bg-red-900 p-4 text-red-200">
          {error}
        </p>
      )}

      {kyc.length === 0 ? (
        <p className="mt-8 text-gray-400">
          No KYC applications found.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {kyc.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-800 p-5"
            >
              <p className="text-xl font-bold">
                {item.full_name || "No name"}
              </p>

              <p className="text-gray-400">
                {item.country || "No country"}
              </p>

              <p className="mt-2">
                Status:{" "}
                <strong>
                  {item.status || "pending"}
                </strong>
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    changeStatus(item.id, "approved")
                  }
                  disabled={item.status === "approved"}
                  className="rounded bg-green-500 px-4 py-2 font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    changeStatus(item.id, "rejected")
                  }
                  disabled={item.status === "rejected"}
                  className="rounded bg-red-500 px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
