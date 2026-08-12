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
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired."
        );
      }

      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setError("");
        }
      }
    );

    return () => {
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
        navigate("/login");
      }, 1800);
    } catch (err) {
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
            Create a new secure password for your account.
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
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400 transition"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition disabled:opacity-60"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          )}

          {error && (
            <Link
              to="/forgot-password"
              className="block text-center mt-5 text-yellow-400 font-semibold hover:text-yellow-300"
            >
              Request a new reset link
            </Link>
          )}

          <div className="text-center mt-7 pt-6 border-t border-gray-800">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white transition"
            >
              ← Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
