import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigation = [
    { label: t.home, icon: "⌂", path: "/dashboard" },
    { label: t.markets, icon: "↗", path: "/markets" },
    { label: t.investments, icon: "◆", path: "/investments" },
    { label: t.deposit, icon: "↓", path: "/deposit" },
    { label: t.withdraw, icon: "↑", path: "/withdraw" },
    { label: t.transactions, icon: "▤", path: "/transactions" },
  ];

  const accountNavigation = [
    { label: t.profile, icon: "◉", path: "/profile" },
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

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
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

        {/* MOBILE TOP BAR */}
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/95 backdrop-blur lg:hidden">
          <div className="flex items-center px-5 py-4">
            <Link
              to="/dashboard"
              className="text-xl font-extrabold text-yellow-400"
            >
              Amaan Capital
            </Link>
          </div>
        </header>

        <main className="pb-24 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-black/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 px-2 py-2">

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
