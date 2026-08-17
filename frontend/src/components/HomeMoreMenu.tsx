import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomeMoreMenu() {
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

  const items = [
    { icon: "❓", label: "FAQ", path: "/faq" },
    { icon: "🎁", label: "Referral Program", path: "/referral" },
    { icon: "🛟", label: "Customer Care", path: "/help" },
    {
      icon: "📣",
      label: "Local Growth Partners — Hiring",
      path: "/growth-partners",
    },
    { icon: "🔒", label: "Privacy Policy", path: "/privacy" },
    { icon: "📄", label: "Terms & Conditions", path: "/terms" },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed right-4 top-4 z-[99999]"
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
        <div className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 p-2 shadow-2xl">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400">
            Amaan Capital
          </p>

          <div className="space-y-1">
            {items.map((item) => (
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
      )}
    </div>
  );
}

export default HomeMoreMenu;
