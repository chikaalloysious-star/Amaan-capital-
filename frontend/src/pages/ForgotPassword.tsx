import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) {
        throw resetError;
      }

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send password reset email."
      );
    } finally {
      setLoading(false);
    }
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
            Forgot Password?
          </h1>

          <p className="text-gray-400 mt-3">
            Enter your email and we'll send you a secure reset link.
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

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-7 pt-6 border-t border-gray-800">
            <Link
              to="/login"
              className="text-yellow-400 font-semibold hover:text-yellow-300"
            >
              ← Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
