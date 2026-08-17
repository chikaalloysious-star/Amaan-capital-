import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref")?.trim().toUpperCase() || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please agree to the terms and privacy policy.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              referral_code: referralCode || null,
              phone: phone.trim(),
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      if (data.session) {
        if (referralCode) {
          const { error: referralError } = await supabase.rpc(
            "apply_referral_code",
            {
              p_code: referralCode,
            }
          );

          if (referralError) {
            console.error("Referral application error:", referralError);
          }
        }

        navigate("/dashboard");
        return;
      }

      setSuccess(
        "Account created successfully. Please check your email to verify your account before signing in."
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create your account.";

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
            Create Your Account
          </h1>

          <p className="text-gray-400 mt-3">
            Start your journey with Amaan Capital
          </p>

        </div>


        {/* Registration Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-7 md:p-8 shadow-2xl">

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}


            {/* Success */}
            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {success}
              </div>
            )}


            {/* Full Name */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400 transition"
              />

            </div>


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


            {/* Phone */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="+234 800 000 0000"
                autoComplete="tel"
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
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400 transition"
              />

            </div>


            {/* Confirm Password */}
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
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400 transition"
              />

            </div>


            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">

              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) =>
                  setAcceptedTerms(event.target.checked)
                }
                className="w-4 h-4 mt-1 accent-yellow-400"
              />

              <p className="text-sm text-gray-400">
                I agree to the Amaan Capital terms and privacy policy.
              </p>

            </div>


            {/* Register */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>


          {/* Login */}
          <div className="text-center mt-7 pt-6 border-t border-gray-800">

            <p className="text-gray-400">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-block mt-2 text-yellow-400 font-semibold hover:text-yellow-300"
            >
              Sign in
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

export default Register;
