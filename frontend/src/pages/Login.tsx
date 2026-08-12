import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.session || !data.user) {
        setError(
          "Login was not completed. Please verify your email and try again."
        );
        return;
      }

      /*
       * Check the user's account status immediately after login.
       */
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("account_status")
          .eq("id", data.user.id)
          .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (
        profile?.account_status &&
        String(profile.account_status).toLowerCase() === "suspended"
      ) {
        await supabase.auth.signOut();

        setError(
          "Your account has been suspended. Please contact Amaan Capital support."
        );

        return;
      }

      navigate("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to sign in.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">

          <Link
            to="/"
            className="text-3xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <h1 className="text-4xl font-bold mt-8">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-3">
            Sign in to access your account
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-7 md:p-8 shadow-2xl">

          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Email */}
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

            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400 transition"
              />

            </div>
<div className="text-right">
  <Link
    to="/forgot-password"
    className="text-sm text-yellow-400 hover:text-yellow-300"
  >
    Forgot your password?
  </Link>
</div>
            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-7 pt-6 border-t border-gray-800">

            <p className="text-gray-400">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="inline-block mt-2 text-yellow-400 font-semibold hover:text-yellow-300"
            >
              Create an account
            </Link>

          </div>

        </div>

        {/* Back */}
        <div className="text-center mt-6">

          <Link
            to="/"
            className="text-gray-500 hover:text-white transition"
          >
            ← Back to Amaan Capital
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;
