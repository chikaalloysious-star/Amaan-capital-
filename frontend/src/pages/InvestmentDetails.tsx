import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

type Investment = {
  id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
};

const detailsText = {
  English: {
    loading: "Loading investment...",
    back: "Back to Investments",
    notFound: "Investment not found.",
    unableToLoad: "Unable to load investment details.",
    details: "Investment Details",
    amount: "Investment Amount",
    plan: "Investment Plan",
    currency: "Currency",
    started: "Started",
    ends: "Ends",
    created: "Created",
    investmentId: "Investment ID",
    status: "Investment Status",
    statusDescription:
      "Your investment status is controlled by the Amaan Capital investment system. Any changes to this investment will be reflected automatically.",
    currentStatus: "Current status",
  },

  French: {
    loading: "Chargement de l'investissement...",
    back: "Retour aux investissements",
    notFound: "Investissement introuvable.",
    unableToLoad:
      "Impossible de charger les détails de l'investissement.",
    details: "Détails de l'investissement",
    amount: "Montant de l'investissement",
    plan: "Plan d'investissement",
    currency: "Devise",
    started: "Début",
    ends: "Fin",
    created: "Créé",
    investmentId: "ID de l'investissement",
    status: "Statut de l'investissement",
    statusDescription:
      "Le statut de votre investissement est contrôlé par le système d'investissement d'Amaan Capital. Toute modification de cet investissement sera automatiquement reflétée.",
    currentStatus: "Statut actuel",
  },

  German: {
    loading: "Investition wird geladen...",
    back: "Zurück zu den Investitionen",
    notFound: "Investition nicht gefunden.",
    unableToLoad:
      "Die Investitionsdetails konnten nicht geladen werden.",
    details: "Investitionsdetails",
    amount: "Investitionsbetrag",
    plan: "Investitionsplan",
    currency: "Währung",
    started: "Gestartet",
    ends: "Endet",
    created: "Erstellt",
    investmentId: "Investitions-ID",
    status: "Investitionsstatus",
    statusDescription:
      "Der Status Ihrer Investition wird vom Amaan Capital Investitionssystem gesteuert. Änderungen an dieser Investition werden automatisch angezeigt.",
    currentStatus: "Aktueller Status",
  },

  Italian: {
    loading: "Caricamento dell'investimento...",
    back: "Torna agli investimenti",
    notFound: "Investimento non trovato.",
    unableToLoad:
      "Impossibile caricare i dettagli dell'investimento.",
    details: "Dettagli dell'investimento",
    amount: "Importo dell'investimento",
    plan: "Piano di investimento",
    currency: "Valuta",
    started: "Iniziato",
    ends: "Termina",
    created: "Creato",
    investmentId: "ID investimento",
    status: "Stato dell'investimento",
    statusDescription:
      "Lo stato del tuo investimento è controllato dal sistema di investimento Amaan Capital. Eventuali modifiche a questo investimento verranno visualizzate automaticamente.",
    currentStatus: "Stato attuale",
  },

  Spanish: {
    loading: "Cargando inversión...",
    back: "Volver a inversiones",
    notFound: "Inversión no encontrada.",
    unableToLoad:
      "No se pudieron cargar los detalles de la inversión.",
    details: "Detalles de la inversión",
    amount: "Importe de la inversión",
    plan: "Plan de inversión",
    currency: "Moneda",
    started: "Iniciada",
    ends: "Finaliza",
    created: "Creada",
    investmentId: "ID de inversión",
    status: "Estado de la inversión",
    statusDescription:
      "El estado de tu inversión está controlado por el sistema de inversión de Amaan Capital. Cualquier cambio en esta inversión se reflejará automáticamente.",
    currentStatus: "Estado actual",
  },

  Filipino: {
    loading: "Nilo-load ang investment...",
    back: "Bumalik sa Investments",
    notFound: "Hindi nahanap ang investment.",
    unableToLoad:
      "Hindi ma-load ang mga detalye ng investment.",
    details: "Mga Detalye ng Investment",
    amount: "Halaga ng Investment",
    plan: "Investment Plan",
    currency: "Currency",
    started: "Nagsimula",
    ends: "Nagtatapos",
    created: "Nagawa",
    investmentId: "Investment ID",
    status: "Status ng Investment",
    statusDescription:
      "Ang status ng iyong investment ay kinokontrol ng Amaan Capital investment system. Awtomatikong makikita ang anumang pagbabago sa investment na ito.",
    currentStatus: "Kasalukuyang status",
  },
} as const;

function InvestmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const text =
    detailsText[language] ?? detailsText.English;

  const [investment, setInvestment] =
    useState<Investment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvestment = useCallback(async () => {
    try {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      if (!id) {
        throw new Error(text.notFound);
      }

      const { data, error: investmentError } =
        await supabase
          .from("investments")
          .select(
            "id,plan_name,amount,currency,status,started_at,ends_at,created_at"
          )
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

      if (investmentError) {
        throw investmentError;
      }

      setInvestment(data);
    } catch (err) {
      console.error(
        "Investment details error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : text.unableToLoad
      );
    } finally {
      setLoading(false);
    }
  }, [
    id,
    navigate,
    text.notFound,
    text.unableToLoad,
  ]);

  useEffect(() => {
    loadInvestment();

    const interval = setInterval(() => {
      loadInvestment();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadInvestment]);

  function formatMoney(
    amount: number,
    currency: string
  ) {
    return `${Number(amount || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )} ${currency}`;
  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  function formatStatus(status: string) {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  function statusClass(status: string) {
    const value = status.toLowerCase();

    if (
      value === "active" ||
      value === "approved" ||
      value === "completed" ||
      value === "successful"
    ) {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (
      value === "rejected" ||
      value === "failed"
    ) {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-semibold text-yellow-400">
          {text.loading}
        </p>
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-4xl px-5 py-10 md:px-8">
          <Link
            to="/investments"
            className="text-sm font-semibold text-gray-400 transition hover:text-yellow-400"
          >
            ← {text.back}
          </Link>

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-red-300">
              {error || text.notFound}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <Link
          to="/investments"
          className="text-sm font-semibold text-gray-400 transition hover:text-yellow-400"
        >
          ← {text.back}
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            {text.details}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
            {investment.plan_name}
          </h1>
        </div>

        <section className="mt-8 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {text.amount}
              </p>

              <p className="mt-2 text-3xl font-extrabold text-yellow-400 md:text-4xl">
                {formatMoney(
                  investment.amount,
                  investment.currency
                )}
              </p>
            </div>

            <span
              className={`w-fit rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${statusClass(
                investment.status
              )}`}
            >
              {formatStatus(investment.status)}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 border-t border-gray-800 pt-7 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                {text.plan}
              </p>
              <p className="mt-1 font-semibold text-gray-200">
                {investment.plan_name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                {text.currency}
              </p>
              <p className="mt-1 font-semibold text-gray-200">
                {investment.currency}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                {text.started}
              </p>
              <p className="mt-1 font-semibold text-gray-200">
                {formatDate(investment.started_at)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                {text.ends}
              </p>
              <p className="mt-1 font-semibold text-gray-200">
                {formatDate(investment.ends_at)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                {text.created}
              </p>
              <p className="mt-1 font-semibold text-gray-200">
                {formatDate(investment.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                {text.investmentId}
              </p>
              <p className="mt-1 break-all font-mono text-xs text-gray-400">
                {investment.id}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
          <h2 className="text-lg font-bold">
            {text.status}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {text.statusDescription}
          </p>

          <div className="mt-5 rounded-2xl border border-yellow-500/10 bg-black p-4">
            <p className="text-xs text-gray-600">
              {text.currentStatus}
            </p>

            <p className="mt-1 font-bold text-yellow-400">
              {formatStatus(investment.status)}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default InvestmentDetails;
