import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  fallback?: string;
};

export default function BackButton({
  fallback = "/dashboard",
}: BackButtonProps) {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
      aria-label="Go back"
    >
      <span className="text-lg leading-none">←</span>
      <span>Back</span>
    </button>
  );
}
