import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

type UserProfile = {
  email: string;
  userId: string;
  createdAt: string;
};

function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setProfile({
        email: user.email || "Not available",
        userId: user.id,
        createdAt: user.created_at,
      });
    } catch (err) {
      console.error("Profile loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : t.unableToLoad
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, t.unableToLoad]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-semibold text-yellow-400">
          {t.loading}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            {t.account}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
            {t.profile}
          </h1>

          <p className="mt-3 text-gray-400">
            {t.profileDescription}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {profile && (
          <>
            <section className="rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-400/10 text-2xl font-bold text-yellow-400">
                  {profile.email.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">
                    {profile.email}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {t.personalProfile}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
              <h2 className="text-lg font-bold">
                {t.account}
              </h2>

              <div className="mt-6 space-y-5">

                <div className="border-b border-gray-800 pb-5">
                  <p className="text-xs uppercase tracking-wider text-gray-600">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold text-gray-200">
                    {profile.email}
                  </p>
                </div>

                <div className="border-b border-gray-800 pb-5">
                  <p className="text-xs uppercase tracking-wider text-gray-600">
                    ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-gray-400">
                    {profile.userId}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600">
                    {t.started}
                  </p>

                  <p className="mt-1 font-semibold text-gray-200">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>

              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
              <h2 className="text-lg font-bold">
                {t.account}
              </h2>

              <div className="mt-5 space-y-3">

                <Link
                  to="/settings"
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-black px-4 py-4 text-sm font-semibold text-gray-300 transition hover:border-yellow-500/30 hover:text-yellow-400"
                >
                  <span>{t.settings}</span>
                  <span>→</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  {t.signOut}
                </button>

              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}

export default Profile;
