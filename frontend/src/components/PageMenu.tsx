import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function PageMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sections = [
    {
      title: "ACCOUNT",
      items: [
        { icon: "👤", label: "Profile", path: "/profile" },
        { icon: "🔐", label: "KYC Verification", path: "/kyc" },
        { icon: "⚙️", label: "Settings", path: "/settings" },
        { icon: "🔔", label: "Notifications", path: "/notifications" },
      ],
    },
    {
      title: "FINANCE",
      items: [
        { icon: "📊", label: "Dashboard", path: "/dashboard" },
        { icon: "💰", label: "Investment Plans", path: "/plans" },
        { icon: "📈", label: "My Investments", path: "/investments" },
        { icon: "💳", label: "Deposit", path: "/deposit" },
        { icon: "💸", label: "Withdraw", path: "/withdraw" },
        { icon: "🧾", label: "Transactions", path: "/transactions" },
      ],
    },
    {
      title: "DISCOVER",
      items: [
        { icon: "⭐", label: "Amaan Opportunities", path: "/opportunities" },
        { icon: "📈", label: "Markets", path: "/markets" },
        { icon: "📰", label: "Crypto News", path: "/crypto-news" },
        { icon: "🎁", label: "Referral Program", path: "/referral" },
        {
          icon: "📣",
          label: "Local Growth Partners",
          path: "/growth-partners",
        },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { icon: "ℹ️", label: "About Amaan Capital", path: "/about" },
        { icon: "❓", label: "FAQ", path: "/faq" },
        { icon: "📞", label: "Contact", path: "/contact" },
        { icon: "🔒", label: "Privacy Policy", path: "/privacy" },
        { icon: "📄", label: "Terms & Conditions", path: "/terms" },
      ],
    },
  ];

  async function logout() {
    setOpen(false);
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div
      ref={menuRef}
      className="relative z-[99999]"
    >
      <button
        type="button"
        aria-label="More options"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-bold text-black shadow-xl ring-1 ring-black/20 transition hover:bg-gray-100 active:scale-95"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-80 overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 p-2 shadow-2xl">
          <div className="border-b border-gray-800 px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400">
              Amaan Capital
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Account & Platform Menu
            </p>
          </div>

          <div className="max-h-[75vh] overflow-y-auto py-2">
            {sections.map((section) => (
              <div key={section.title} className="mb-3">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        navigate(item.path);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-300 transition hover:bg-yellow-400/10 hover:text-yellow-400"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black">
                        {item.icon}
                      </span>

                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-800 pt-2">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                  ↪
                </span>

                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageMenu;
