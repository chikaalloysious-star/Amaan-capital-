import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">

        <Link
          to="/"
          className="text-2xl font-extrabold text-yellow-400"
        >
          Amaan Capital
        </Link>

        <div className="hidden md:flex items-center gap-8 text-gray-300">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400"
                : "hover:text-yellow-400"
            }
          >
            {t.home}
          </NavLink>

          <NavLink
            to="/plans"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400"
                : "hover:text-yellow-400"
            }
          >
            {t.plans}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400"
                : "hover:text-yellow-400"
            }
          >
            {t.about}
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400"
                : "hover:text-yellow-400"
            }
          >
            {t.contact}
          </NavLink>

        </div>

        <div className="flex gap-3">

          <Link
            to="/login"
            className="border border-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition"
          >
            {t.login}
          </Link>

          <Link
            to="/register"
            className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            {t.register}
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
