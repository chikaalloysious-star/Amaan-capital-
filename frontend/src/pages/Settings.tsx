import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";

const languages: Language[] = [
  "English",
  "French",
  "German",
  "Italian",
  "Spanish",
  "Filipino",
];

function Settings() {
  const navigate = useNavigate();

  const { language, setLanguage, t } = useLanguage();

  const [currency, setCurrency] = useState(
    () => localStorage.getItem("amaan_currency") || "USDT"
  );

  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("amaan_notifications") !== "false"
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [accountStatus, setAccountStatus] = useState<
    "active" | "suspended" | "unknown"
  >("unknown");

  const [lastSignIn, setLastSignIn] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadSecurityInfo() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setEmail(user.email || "");
      setLastSignIn(user.last_sign_in_at || null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("account_status")
        .eq("id", user.id)
        .maybeSingle();

      if (
        profile?.account_status === "active" ||
        profile?.account_status === "suspended"
      ) {
        setAccountStatus(profile.account_status);
      }
    }

    loadSecurityInfo();
  }, [navigate]);

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setMessage("");
    setError("");
  }

  function savePreferences() {
    localStorage.setItem("amaan_currency", currency);
    localStorage.setItem(
      "amaan_notifications",
      String(notifications)
    );

    setError("");
    setMessage(t.preferencesSaved);
  }

  async function changePassword() {
    setMessage("");
    setError("");

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const { error: passwordError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (passwordError) {
        throw passwordError;
      }

      setNewPassword("");
      setConfirmPassword("");

      setMessage("Your password has been changed successfully.");
    } catch (err) {
      console.error("Password update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            {t.account}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
            {t.settings}
          </h1>

          <p className="mt-3 text-gray-400">
            {t.languageDescription}
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* LANGUAGE */}

        <section className="rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
            {t.preferences}
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {t.language}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {t.languageDescription}
          </p>

          <select
            value={language}
            onChange={(event) =>
              handleLanguageChange(
                event.target.value as Language
              )
            }
            className="mt-6 w-full rounded-xl border border-gray-700 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        {/* CURRENCY */}

        <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
          <h2 className="text-xl font-bold">
            {t.currency}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {t.currencyDescription}
          </p>

          <select
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value)
            }
            className="mt-6 w-full rounded-xl border border-gray-700 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
          >
            <option>USDT</option>
            <option>USD</option>
            <option>NGN</option>
            <option>CHF</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>PHP</option>
          </select>
        </section>

        {/* NOTIFICATIONS */}

        <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold">
                {t.notifications}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {t.notificationsDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-yellow-400"
                  : "bg-gray-700"
              }`}
              aria-label={t.notifications}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  notifications ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* SAVE */}

        <button
          type="button"
          onClick={savePreferences}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-4 font-bold text-black transition hover:bg-yellow-300"
        >
          {t.savePreferences}
        </button>

        {/* SECURITY CENTER */}

        <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
              Security
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Security Center
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage your password and review the security status of your account.
            </p>
          </div>

          {/* ACCOUNT SECURITY */}

          <div className="mt-7 rounded-2xl border border-gray-800 bg-black p-5">

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Account status
                </p>

                <p
                  className={`mt-1 font-bold ${
                    accountStatus === "suspended"
                      ? "text-red-400"
                      : accountStatus === "active"
                        ? "text-green-400"
                        : "text-gray-400"
                  }`}
                >
                  {accountStatus === "suspended"
                    ? "Suspended"
                    : accountStatus === "active"
                      ? "Active"
                      : "Unknown"}
                </p>
              </div>

              <span
                className={`h-3 w-3 rounded-full ${
                  accountStatus === "suspended"
                    ? "bg-red-400"
                    : accountStatus === "active"
                      ? "bg-green-400"
                      : "bg-gray-500"
                }`}
              />
            </div>

            <div className="mt-5 border-t border-gray-800 pt-5">
              <p className="text-sm text-gray-500">
                Account email
              </p>

              <p className="mt-1 break-all font-semibold">
                {email || "Not available"}
              </p>
            </div>

            <div className="mt-5 border-t border-gray-800 pt-5">
              <p className="text-sm text-gray-500">
                Last sign in
              </p>

              <p className="mt-1 font-semibold">
                {lastSignIn
                  ? new Date(lastSignIn).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          </div>

          {/* CHANGE PASSWORD */}

          <div className="mt-6 rounded-2xl border border-gray-800 bg-black p-5">

            <h3 className="text-lg font-bold">
              Change Password
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Use a strong password that you do not reuse on other websites.
            </p>

            <div className="mt-5 space-y-4">

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="New password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-4 text-white outline-none focus:border-yellow-400"
              />

              <button
                type="button"
                onClick={changePassword}
                disabled={changingPassword}
                className="w-full rounded-xl bg-yellow-400 px-5 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changingPassword
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

            </div>
          </div>

          {/* SIGN OUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-left font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            {t.signOut}
          </button>

        </section>

      </main>
    </div>
  );
}

export default Settings;
