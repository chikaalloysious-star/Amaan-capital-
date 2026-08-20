import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function prepareRecovery() {
      try {
        /*
         * Supabase may deliver the recovery session through
         * the URL hash. getSession() reads the session after
         * Supabase has processed it.
         */
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          setError(
            "This password reset link is invalid or has expired. Please request a new one."
          );
        }
      } catch (err) {
        console.error("Password recovery session error:", err);

        if (mounted) {
          setError(
            "Unable to verify the password reset link. Please request a new one."
          );
        }
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    prepareRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth recovery event:", event);

      if (!mounted) return;

      if (
        event === "PASSWORD_RECOVERY" ||
        event === "SIGNED_IN"
      ) {
        if (session) {
          setError("");
          setCheckingSession(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError(
        "Your new password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Your password reset session has expired. Please request a new reset link."
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw updateError;
      }

      setMessage(
        "Your password has been reset successfully. Redirecting to login..."
      );

      await supabase.auth.signOut();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1800);
    } catch (err) {
      console.error("Password reset error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <p className="text-yellow-400 font-semibold">
          Verifying password reset link...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-3xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <h1 className="text-4xl font-bold mt-8">
            Reset Password
          </h1>

          <p className="text-gray-400 mt-3">
            Create a new password for your account.
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-7 md:p-8 shadow-2xl">

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {message}
            </div>
          )}

          {!error && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-yellow-400 px-5 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
              >
                {loading
                  ? "Updating Password..."
                  : "Reset Password"}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="text-yellow-400 hover:underline"
              >
                Request a new reset link
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
