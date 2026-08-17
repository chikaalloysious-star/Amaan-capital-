import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type PlatformSettings = {
  id: string;
  min_withdrawal: number;
  max_withdrawal: number;
  min_investment: number;
  max_investment: number;
  registration_enabled: boolean;
  deposits_enabled: boolean;
  withdrawals_enabled: boolean;
  maintenance_mode: boolean;
  announcement: string | null;
};

function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const { data: { user }, } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in.");
        return;
      }

      const { data: admin, error: adminError } =
        await supabase.rpc("is_super_admin");

      if (adminError) throw adminError;

      if (!admin) {
        setError("Access denied.");
        return;
      }

      const { data, error: settingsError } = await supabase
        .from("platform_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (!data) {
        setError("Platform settings could not be found.");
        return;
      }

      setSettings(data);
    } catch (err: any) {
      console.error("Load platform settings error:", err);
      setError(err?.message || "Unable to load platform settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function updateField(
    field: keyof PlatformSettings,
    value: string | number | boolean
  ) {
    setSettings((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  async function saveSettings() {
    if (!settings) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const { data: { user }, } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in.");
        return;
      }

      const { data: admin, error: adminError } =
        await supabase.rpc("is_super_admin");

      if (adminError) throw adminError;

      if (!admin) {
        setError("Access denied.");
        return;
      }

      const { error: updateError } = await supabase
        .from("platform_settings")
        .update({
          min_withdrawal: settings.min_withdrawal,
          max_withdrawal: settings.max_withdrawal,
          min_investment: settings.min_investment,
          max_investment: settings.max_investment,
          registration_enabled: settings.registration_enabled,
          deposits_enabled: settings.deposits_enabled,
          withdrawals_enabled: settings.withdrawals_enabled,
          maintenance_mode: settings.maintenance_mode,
          announcement: settings.announcement,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (updateError) throw updateError;

      setMessage("Platform settings saved successfully.");
    } catch (err: any) {
      console.error("Save platform settings error:", err);
      setError(err?.message || "Unable to save platform settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-semibold text-yellow-400">
          Loading platform settings...
        </p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold">
            Platform Settings
          </h1>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Amaan Capital
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
            Platform Settings
          </h1>

          <p className="mt-3 text-gray-400">
            Control important platform-wide settings from one place.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <section className="mt-8 rounded-3xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="text-xl font-bold">
            Financial Limits
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <label className="block">
              <span className="text-sm text-gray-400">
                Minimum withdrawal
              </span>

              <input
                type="number"
                min="0"
                value={settings.min_withdrawal}
                onChange={(e) =>
                  updateField(
                    "min_withdrawal",
                    Number(e.target.value)
                  )
                }
                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">
                Maximum withdrawal
              </span>

              <input
                type="number"
                min="0"
                value={settings.max_withdrawal}
                onChange={(e) =>
                  updateField(
                    "max_withdrawal",
                    Number(e.target.value)
                  )
                }
                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">
                Minimum investment
              </span>

              <input
                type="number"
                min="0"
                value={settings.min_investment}
                onChange={(e) =>
                  updateField(
                    "min_investment",
                    Number(e.target.value)
                  )
                }
                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-400">
                Maximum investment
              </span>

              <input
                type="number"
                min="0"
                value={settings.max_investment}
                onChange={(e) =>
                  updateField(
                    "max_investment",
                    Number(e.target.value)
                  )
                }
                className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              />
            </label>

          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="text-xl font-bold">
            Platform Controls
          </h2>

          <div className="mt-6 space-y-4">

            {[
              ["registration_enabled", "User registration"],
              ["deposits_enabled", "Deposits"],
              ["withdrawals_enabled", "Withdrawals"],
              ["maintenance_mode", "Maintenance mode"],
            ].map(([field, label]) => (
              <label
                key={field}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-black p-4"
              >
                <span className="font-semibold">
                  {label}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      field as keyof PlatformSettings,
                      !settings[field as keyof PlatformSettings]
                    )
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    settings[field as keyof PlatformSettings]
                      ? "bg-yellow-400"
                      : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      settings[field as keyof PlatformSettings]
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </label>
            ))}

          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="text-xl font-bold">
            Platform Announcement
          </h2>

          <textarea
            value={settings.announcement ?? ""}
            onChange={(e) =>
              updateField("announcement", e.target.value)
            }
            placeholder="Optional announcement for users..."
            rows={5}
            className="mt-5 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
          />
        </section>

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="mt-8 w-full rounded-2xl bg-yellow-400 px-5 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Platform Settings"}
        </button>

      </main>
    </div>
  );
}

export default AdminSettings;
