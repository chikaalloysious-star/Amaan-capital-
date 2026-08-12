import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const investmentText = {
  English: {
    portfolio: "Portfolio",
    my: "My",
    investments: "Investments",
    description:
      "View your active and completed investments, including their amounts, plans and investment periods.",
    loading: "Loading investments...",
    noInvestments: "No investments yet",
    noInvestmentsDescription:
      "Your investments will appear here once you start an investment plan.",
    explorePlans: "Explore Plans",
    investmentPlan: "Investment Plan",
    started: "Started",
    ends: "Ends",
    created: "Created",
    viewDetails: "View Investment Details",
    unableToLoad: "Unable to load your investments.",
  },

  French: {
    portfolio: "Portefeuille",
    my: "Mes",
    investments: "Investissements",
    description:
      "Consultez vos investissements actifs et terminés, avec leurs montants, plans et périodes d'investissement.",
    loading: "Chargement des investissements...",
    noInvestments: "Aucun investissement",
    noInvestmentsDescription:
      "Vos investissements apparaîtront ici lorsque vous commencerez un plan d'investissement.",
    explorePlans: "Explorer les plans",
    investmentPlan: "Plan d'investissement",
    started: "Début",
    ends: "Fin",
    created: "Créé",
    viewDetails: "Voir les détails de l'investissement",
    unableToLoad: "Impossible de charger vos investissements.",
  },

  German: {
    portfolio: "Portfolio",
    my: "Meine",
    investments: "Investitionen",
    description:
      "Sehen Sie Ihre aktiven und abgeschlossenen Investitionen einschließlich Beträgen, Plänen und Anlagezeiträumen.",
    loading: "Investitionen werden geladen...",
    noInvestments: "Noch keine Investitionen",
    noInvestmentsDescription:
      "Ihre Investitionen werden hier angezeigt, sobald Sie einen Investitionsplan starten.",
    explorePlans: "Pläne erkunden",
    investmentPlan: "Investitionsplan",
    started: "Gestartet",
    ends: "Endet",
    created: "Erstellt",
    viewDetails: "Investitionsdetails anzeigen",
    unableToLoad: "Ihre Investitionen konnten nicht geladen werden.",
  },

  Italian: {
    portfolio: "Portafoglio",
    my: "I miei",
    investments: "Investimenti",
    description:
      "Visualizza i tuoi investimenti attivi e completati, inclusi importi, piani e periodi di investimento.",
    loading: "Caricamento degli investimenti...",
    noInvestments: "Nessun investimento",
    noInvestmentsDescription:
      "I tuoi investimenti appariranno qui dopo aver iniziato un piano di investimento.",
    explorePlans: "Esplora i piani",
    investmentPlan: "Piano di investimento",
    started: "Iniziato",
    ends: "Termina",
    created: "Creato",
    viewDetails: "Visualizza dettagli investimento",
    unableToLoad: "Impossibile caricare i tuoi investimenti.",
  },

  Spanish: {
    portfolio: "Cartera",
    my: "Mis",
    investments: "Inversiones",
    description:
      "Consulta tus inversiones activas y completadas, incluidos sus importes, planes y períodos de inversión.",
    loading: "Cargando inversiones...",
    noInvestments: "Aún no hay inversiones",
    noInvestmentsDescription:
      "Tus inversiones aparecerán aquí cuando comiences un plan de inversión.",
    explorePlans: "Explorar planes",
    investmentPlan: "Plan de inversión",
    started: "Iniciada",
    ends: "Finaliza",
    created: "Creada",
    viewDetails: "Ver detalles de la inversión",
    unableToLoad: "No se pudieron cargar tus inversiones.",
  },

  Filipino: {
    portfolio: "Portfolio",
    my: "Aking",
    investments: "Mga Investment",
    description:
      "Tingnan ang iyong aktibo at nakumpletong mga investment, kabilang ang halaga, mga plano at panahon ng investment.",
    loading: "Ikinakarga ang mga investment...",
    noInvestments: "Wala pang investment",
    noInvestmentsDescription:
      "Lalabas dito ang iyong mga investment kapag nagsimula ka ng investment plan.",
    explorePlans: "Tingnan ang Mga Plano",
    investmentPlan: "Investment Plan",
    started: "Nagsimula",
    ends: "Nagtatapos",
    created: "Nagawa",
    viewDetails: "Tingnan ang Detalye ng Investment",
    unableToLoad: "Hindi ma-load ang iyong mga investment.",
  },
} as const;

function Investments() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = investmentText[language] ?? investmentText.English;

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvestments = useCallback(async () => {
    try {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error: investmentError } = await supabase
        .from("investments")
        .select(
          "id,plan_name,amount,currency,status,started_at,ends_at,created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (investmentError) {
        throw investmentError;
      }

      setInvestments(data || []);
    } catch (err) {
      console.error("Investment loading error:", err);

      setError(
        err instanceof Error ? err.message : text.unableToLoad
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, text.unableToLoad]);

  useEffect(() => {
    loadInvestments();

    const interval = setInterval(() => {
      loadInvestments();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadInvestments]);

  function formatMoney(amount: number, currency: string) {
    return `${Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

    if (value === "rejected" || value === "failed") {
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

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            {text.portfolio}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
            {text.my}{" "}
            <span className="text-yellow-400">
              {text.investments}
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            {text.description}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {investments.length === 0 ? (
          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-800 bg-black text-2xl">
              ◆
            </div>

            <h2 className="mt-5 text-xl font-bold">
              {text.noInvestments}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {text.noInvestmentsDescription}
            </p>

            <Link
              to="/plans"
              className="mt-6 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
            >
              {text.explorePlans}
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="rounded-3xl border border-gray-800 bg-gray-950 p-5 md:p-7"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      {text.investmentPlan}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {investment.plan_name}
                    </h2>

                    <p className="mt-2 text-2xl font-extrabold text-yellow-400">
                      {formatMoney(
                        investment.amount,
                        investment.currency
                      )}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${statusClass(
                      investment.status
                    )}`}
                  >
                    {investment.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-800 pt-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-600">
                      {text.started}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-300">
                      {formatDate(investment.started_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">
                      {text.ends}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-300">
                      {formatDate(investment.ends_at)}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs text-gray-600">
                      {text.created}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-300">
                      {formatDate(investment.created_at)}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/investments/${investment.id}`}
                  className="mt-6 block rounded-xl border border-gray-800 bg-black px-4 py-3 text-center text-sm font-semibold text-gray-300 transition hover:border-yellow-500/30 hover:text-yellow-400"
                >
                  {text.viewDetails} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Investments;
