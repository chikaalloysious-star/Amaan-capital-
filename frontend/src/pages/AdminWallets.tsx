import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type DepositWallet = {
  id: string;
  asset: string;
  network: string;
  wallet_address: string;
  label: string | null;
  is_active: boolean;
};

function AdminWallets() {
  const [wallets, setWallets] = useState<DepositWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [asset, setAsset] = useState("USDT");
  const [network, setNetwork] = useState("TRC20");
  const [walletAddress, setWalletAddress] = useState("");
  const [label, setLabel] = useState("");

  async function loadWallets() {
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

      const { data, error: walletError } = await supabase
        .from("deposit_wallets")
        .select("*")
        .order("created_at", { ascending: false });

      if (walletError) {
        throw walletError;
      }

      setWallets(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load deposit wallets."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWallets();
  }, []);

  async function saveWallet(event: React.FormEvent) {
    event.preventDefault();

    if (!walletAddress.trim()) {
      setError("Enter a wallet address.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { error: insertError } = await supabase
        .from("deposit_wallets")
        .insert({
          asset: asset.trim().toUpperCase(),
          network: network.trim().toUpperCase(),
          wallet_address: walletAddress.trim(),
          label: label.trim() || null,
          is_active: true,
        });

      if (insertError) {
        throw insertError;
      }

      setWalletAddress("");
      setLabel("");
      setMessage("Deposit wallet saved successfully.");

      await loadWallets();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save wallet."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateWallet(id: string) {
    try {
      setError("");
      setMessage("");

      const { error: updateError } = await supabase
        .from("deposit_wallets")
        .update({ is_active: false })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      setMessage("Deposit wallet deactivated.");

      await loadWallets();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to deactivate wallet."
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading wallet settings...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">

          <div className="text-5xl mb-5">
            🔒
          </div>

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
          Owner Settings
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-3">
          Deposit <span className="text-yellow-400">Wallets</span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-2xl">
          Configure the public receiving addresses displayed
          to users on the deposit page.
        </p>

        {error && (
          <div className="mt-8 border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-8 border border-green-500/30 bg-green-500/10 rounded-2xl p-5 text-green-300">
            {message}
          </div>
        )}

        <section className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">

          <h2 className="text-2xl font-bold">
            Add Deposit Wallet
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Only enter a public receiving address. Never enter
            a private key or seed phrase.
          </p>

          <form
            onSubmit={saveWallet}
            className="mt-7 space-y-5"
          >

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm text-gray-400 mb-2">
                  Asset
                </label>

                <input
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
                  placeholder="USDT"
                />

              </div>

              <div>

                <label className="block text-sm text-gray-400 mb-2">
                  Network
                </label>

                <input
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
                  placeholder="TRC20"
                />

              </div>

            </div>

            <div>

              <label className="block text-sm text-gray-400 mb-2">
                Public Wallet Address
              </label>

              <input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
                placeholder="Enter public receiving address"
              />

            </div>

            <div>

              <label className="block text-sm text-gray-400 mb-2">
                Label
              </label>

              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
                placeholder="Primary USDT TRC20 wallet"
              />

            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 text-black px-7 py-4 rounded-xl font-bold hover:bg-yellow-300 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Deposit Wallet"}
            </button>

          </form>

        </section>

        <section className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Configured Wallets
          </h2>

          {wallets.length === 0 ? (

            <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 text-gray-500">
              No deposit wallets configured yet.
            </div>

          ) : (

            <div className="space-y-4">

              {wallets.map((wallet) => (

                <div
                  key={wallet.id}
                  className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                      <div className="flex items-center gap-3">

                        <h3 className="text-xl font-bold">
                          {wallet.asset}
                        </h3>

                        <span className="text-yellow-400 text-sm">
                          {wallet.network}
                        </span>

                        {wallet.is_active && (
                          <span className="text-green-400 text-sm font-semibold">
                            Active
                          </span>
                        )}

                      </div>

                      {wallet.label && (
                        <p className="text-gray-500 text-sm mt-2">
                          {wallet.label}
                        </p>
                      )}

                      <p className="text-gray-300 text-sm break-all mt-3">
                        {wallet.wallet_address}
                      </p>

                    </div>

                    {wallet.is_active && (
                      <button
                        onClick={() => deactivateWallet(wallet.id)}
                        className="border border-red-500/30 text-red-400 px-5 py-3 rounded-xl hover:bg-red-500/10"
                      >
                        Deactivate
                      </button>
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

export default AdminWallets;
