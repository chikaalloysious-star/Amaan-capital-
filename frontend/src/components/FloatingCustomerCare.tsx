import { Link } from "react-router-dom";

function FloatingCustomerCare() {
  return (
    <Link
      to="/help"
      aria-label="Help and Customer Care"
      className="fixed bottom-5 left-5 z-[60] flex items-center gap-3 rounded-full border border-yellow-500/40 bg-gray-950/95 px-3 py-2 shadow-2xl shadow-yellow-500/10 backdrop-blur transition hover:border-yellow-400 hover:bg-gray-900"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-2xl">
        👩🏽‍💼
      </span>

      <span className="hidden pr-2 sm:block">
        <span className="block text-xs font-bold text-yellow-400">
          Need Help?
        </span>

        <span className="block text-xs text-gray-400">
          Customer Care
        </span>
      </span>
    </Link>
  );
}

export default FloatingCustomerCare;
