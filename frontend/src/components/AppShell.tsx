import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";
import NotificationBell from "./NotificationBell";
import PageMenu from "./PageMenu";

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const navigation = [
    { label: "Referral Program", icon: "🎁", path: "/referral" },
    { label: t.home, icon: "⌂", path: "/dashboard" },
    { label: t.markets, icon: "↗", path: "/markets" },
    { label: t.investments, icon: "◆", path: "/investments" },
    { label: t.deposit, icon: "↓", path: "/deposit" },
    { label: t.withdraw, icon: "↑", path: "/withdraw" },
    { label: t.transactions, icon: "▤", path: "/transactions" },
  ];

const accountNavigation = [
  { label: t.profile, icon: "◉", path: "/profile" },
  { label: "KYC Verification", icon: "✓", path: "/kyc" },
  { label: t.settings, icon: "⚙", path: "/settings" },
];
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const { data, error } = await supabase
          .from("platform_settings")
          .select("announcement")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Load platform announcement error:", error);
          return;
        }

        setAnnouncement(String(data?.announcement || "").trim());
      } catch (error) {
        console.error("Load platform announcement error:", error);
      }
    }

    loadAnnouncement();
  }, []);

  useEffect(() => {
    let mounted = true;

    async function checkAccount() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setCheckingAuth(false);
            navigate("/login", { replace: true });
          }
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("account_status")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (
          profile?.account_status &&
          String(profile.account_status).toLowerCase() === "suspended"
        ) {
          await supabase.auth.signOut();

          if (mounted) {
            setCheckingAuth(false);
            navigate("/login", { replace: true });
          }

          return;
        }

        if (mounted) {
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error("App authentication check error:", error);

        await supabase.auth.signOut();

        if (mounted) {
          setCheckingAuth(false);
          navigate("/login", { replace: true });
        }
      }
    }

    checkAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Checking account...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gray-800 bg-black lg:flex">

        <div className="border-b border-gray-800 px-6 py-7">
          <Link
            to="/dashboard"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <p className="mt-1 text-xs text-gray-600">
            {t.wealthManagement}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            {t.main}
          </p>

          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive(item.path)
                    ? "bg-yellow-400 text-black"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <span className="w-6 text-center text-lg">
                  {item.icon}
                </span>

                {item.label}
              </Link>
            ))}
          </div>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            {t.account}
          </p>

          <div className="space-y-1">
            {accountNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive(item.path)
                    ? "bg-yellow-400 text-black"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <span className="w-6 text-center text-lg">
                  {item.icon}
                </span>

                {item.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="w-6 text-center text-lg">
              ↪
            </span>

            {t.logout}
          </button>

        </nav>

        <div className="border-t border-gray-800 p-4">
          <Link
            to="/profile"
            className="block rounded-xl border border-gray-800 bg-gray-950 p-4 transition hover:border-yellow-500/30"
          >
            <p className="text-xs text-gray-600">
              {t.account}
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {t.personalProfile}
            </p>
          </Link>
        </div>

      </aside>

      {/* MAIN APPLICATION AREA */}
      <div className="lg:pl-64">

{/* APPLICATION TOP BAR */}
<header className="sticky top-0 z-40 border-b border-gray-800 bg-black/95 backdrop-blur">
  <div className="flex items-center justify-between px-5 py-4">
    <Link
      to="/dashboard"
      className="text-xl font-extrabold text-yellow-400"
    >
      Amaan Capital
    </Link>

    <div className="flex items-center gap-2">
      <NotificationBell />
      <PageMenu />
    </div>
  </div>
</header>
        <main className="pb-24 lg:pb-0">
          {announcement && !announcementDismissed && (
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
              <div className="relative rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 pr-12 text-yellow-200">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                  Amaan Capital Announcement
                </p>
                <p className="mt-1 text-sm leading-6">
                  {announcement}
                </p>
                <button
                  type="button"
                  onClick={() => setAnnouncementDismissed(true)}
                  className="absolute right-3 top-3 rounded-lg px-2 py-1 text-lg text-yellow-400 hover:bg-yellow-400/10"
                  aria-label="Dismiss announcement"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <Outlet />
        </main>

      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-black/95 backdrop-blur lg:hidden">

<div className="grid grid-cols-5 px-2 py-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold ${
              isActive("/dashboard")
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            <span className="text-lg">⌂</span>
            {t.home}
          </Link>

          <Link
            to="/markets"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold ${
              isActive("/markets")
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            <span className="text-lg">↗</span>
            {t.markets}
          </Link>

          <Link
            to="/investments"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold ${
              isActive("/investments")
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            <span className="text-lg">◆</span>
            {t.investments}
          </Link>
          <Link
            to="/kyc"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold ${
              isActive("/kyc")
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            <span className="text-lg">✓</span>
            KYC
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold ${
              isActive("/profile")
                ? "text-yellow-400"
                : "text-gray-500"
            }`}
          >
            <span className="text-lg">◉</span>
            {t.profile}
          </Link>

        </div>

      </nav>

    </div>
  );
}

export default AppShell;
