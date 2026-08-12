import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";

type DepositWallet = {
  id: string;
  asset: string;
  network: string;
  wallet_address: string;
  label: string | null;
};

const depositText = {
  English: {
    fundAccount: "Fund Account",
    deposit: "Deposit",
    description: "Send USDT using the correct network to the receiving address below.",
    dashboard: "← Dashboard",
    loading: "Loading deposit instructions...",
    asset: "Asset",
    network: "Network",
    receivingAddress: "Receiving Address",
    copyAddress: "Copy Wallet Address",
    addressCopied: "Address Copied ✓",
    submitDeposit: "Submit Deposit",
    submitDescription: "After sending the funds, enter the amount below and submit your deposit request.",
    amount: "Amount (USDT)",
    enterAmount: "Enter amount",
    submitting: "Submitting...",
    submitRequest: "Submit Deposit Request",
    important: "Important",
    importantDescription: "Only send USDT using the displayed TRC20 network. Sending assets through another network may result in permanent loss of funds.",
    unavailableTitle: "Deposit temporarily unavailable",
    unavailableDescription: "No active USDT TRC20 receiving wallet is currently configured.",
    validAmount: "Enter a valid deposit amount.",
    noWallet: "No active deposit wallet is currently configured.",
    login: "Please log in before submitting a deposit.",
    unableWallet: "Unable to load the deposit wallet.",
    unableSubmit: "Unable to submit deposit request.",
    success: "Deposit request submitted successfully. Reference:",
  },
  French: {
    fundAccount: "Approvisionner le compte",
    deposit: "Dépôt",
    description: "Envoyez des USDT en utilisant le réseau correct vers l'adresse de réception ci-dessous.",
    dashboard: "← Tableau de bord",
    loading: "Chargement des instructions de dépôt...",
    asset: "Actif",
    network: "Réseau",
    receivingAddress: "Adresse de réception",
    copyAddress: "Copier l'adresse du portefeuille",
    addressCopied: "Adresse copiée ✓",
    submitDeposit: "Soumettre le dépôt",
    submitDescription: "Après avoir envoyé les fonds, saisissez le montant ci-dessous et envoyez votre demande de dépôt.",
    amount: "Montant (USDT)",
    enterAmount: "Saisissez le montant",
    submitting: "Envoi...",
    submitRequest: "Soumettre la demande de dépôt",
    important: "Important",
    importantDescription: "Envoyez uniquement des USDT via le réseau TRC20 affiché. L'utilisation d'un autre réseau peut entraîner une perte permanente des fonds.",
    unavailableTitle: "Dépôt temporairement indisponible",
    unavailableDescription: "Aucun portefeuille de réception USDT TRC20 actif n'est actuellement configuré.",
    validAmount: "Saisissez un montant de dépôt valide.",
    noWallet: "Aucun portefeuille de dépôt actif n'est actuellement configuré.",
    login: "Veuillez vous connecter avant de soumettre un dépôt.",
    unableWallet: "Impossible de charger le portefeuille de dépôt.",
    unableSubmit: "Impossible de soumettre la demande de dépôt.",
    success: "Demande de dépôt envoyée avec succès. Référence :",
  },
  German: {
    fundAccount: "Konto aufladen",
    deposit: "Einzahlung",
    description: "Senden Sie USDT über das korrekte Netzwerk an die unten angegebene Empfangsadresse.",
    dashboard: "← Dashboard",
    loading: "Einzahlungsanweisungen werden geladen...",
    asset: "Vermögenswert",
    network: "Netzwerk",
    receivingAddress: "Empfangsadresse",
    copyAddress: "Wallet-Adresse kopieren",
    addressCopied: "Adresse kopiert ✓",
    submitDeposit: "Einzahlung einreichen",
    submitDescription: "Nachdem Sie die Gelder gesendet haben, geben Sie den Betrag unten ein und reichen Sie Ihre Einzahlungsanfrage ein.",
    amount: "Betrag (USDT)",
    enterAmount: "Betrag eingeben",
    submitting: "Wird gesendet...",
    submitRequest: "Einzahlungsanfrage senden",
    important: "Wichtig",
    importantDescription: "Senden Sie USDT ausschließlich über das angezeigte TRC20-Netzwerk. Das Senden über ein anderes Netzwerk kann zu einem dauerhaften Verlust der Gelder führen.",
    unavailableTitle: "Einzahlung vorübergehend nicht verfügbar",
    unavailableDescription: "Derzeit ist keine aktive USDT-TRC20-Empfangs-Wallet konfiguriert.",
    validAmount: "Geben Sie einen gültigen Einzahlungsbetrag ein.",
    noWallet: "Derzeit ist keine aktive Einzahlungs-Wallet konfiguriert.",
    login: "Bitte melden Sie sich an, bevor Sie eine Einzahlung einreichen.",
    unableWallet: "Die Einzahlungs-Wallet konnte nicht geladen werden.",
    unableSubmit: "Die Einzahlungsanfrage konnte nicht gesendet werden.",
    success: "Einzahlungsanfrage erfolgreich gesendet. Referenz:",
  },
  Italian: {
    fundAccount: "Finanzia il conto",
    deposit: "Deposito",
    description: "Invia USDT utilizzando la rete corretta all'indirizzo di ricezione indicato di seguito.",
    dashboard: "← Dashboard",
    loading: "Caricamento delle istruzioni di deposito...",
    asset: "Asset",
    network: "Rete",
    receivingAddress: "Indirizzo di ricezione",
    copyAddress: "Copia indirizzo wallet",
    addressCopied: "Indirizzo copiato ✓",
    submitDeposit: "Invia deposito",
    submitDescription: "Dopo aver inviato i fondi, inserisci l'importo qui sotto e invia la richiesta di deposito.",
    amount: "Importo (USDT)",
    enterAmount: "Inserisci importo",
    submitting: "Invio...",
    submitRequest: "Invia richiesta di deposito",
    important: "Importante",
    importantDescription: "Invia USDT solo utilizzando la rete TRC20 visualizzata. L'utilizzo di un'altra rete potrebbe causare la perdita permanente dei fondi.",
    unavailableTitle: "Deposito temporaneamente non disponibile",
    unavailableDescription: "Nessun wallet di ricezione USDT TRC20 attivo è attualmente configurato.",
    validAmount: "Inserisci un importo di deposito valido.",
    noWallet: "Nessun wallet di deposito attivo è attualmente configurato.",
    login: "Accedi prima di inviare un deposito.",
    unableWallet: "Impossibile caricare il wallet di deposito.",
    unableSubmit: "Impossibile inviare la richiesta di deposito.",
    success: "Richiesta di deposito inviata con successo. Riferimento:",
  },
  Spanish: {
    fundAccount: "Añadir fondos a la cuenta",
    deposit: "Depósito",
    description: "Envía USDT utilizando la red correcta a la dirección receptora que aparece a continuación.",
    dashboard: "← Panel",
    loading: "Cargando instrucciones de depósito...",
    asset: "Activo",
    network: "Red",
    receivingAddress: "Dirección receptora",
    copyAddress: "Copiar dirección de wallet",
    addressCopied: "Dirección copiada ✓",
    submitDeposit: "Enviar depósito",
    submitDescription: "Después de enviar los fondos, introduce el importe a continuación y envía tu solicitud de depósito.",
    amount: "Importe (USDT)",
    enterAmount: "Introduce el importe",
    submitting: "Enviando...",
    submitRequest: "Enviar solicitud de depósito",
    important: "Importante",
    importantDescription: "Envía USDT únicamente mediante la red TRC20 mostrada. Enviar activos mediante otra red puede provocar la pérdida permanente de los fondos.",
    unavailableTitle: "Depósito temporalmente no disponible",
    unavailableDescription: "Actualmente no hay configurada una wallet receptora USDT TRC20 activa.",
    validAmount: "Introduce un importe de depósito válido.",
    noWallet: "Actualmente no hay una wallet de depósito activa configurada.",
    login: "Inicia sesión antes de enviar un depósito.",
    unableWallet: "No se pudo cargar la wallet de depósito.",
    unableSubmit: "No se pudo enviar la solicitud de depósito.",
    success: "Solicitud de depósito enviada correctamente. Referencia:",
  },
  Filipino: {
    fundAccount: "Magdagdag ng Pondo",
    deposit: "Deposit",
    description: "Magpadala ng USDT gamit ang tamang network sa receiving address sa ibaba.",
    dashboard: "← Dashboard",
    loading: "Nilo-load ang deposit instructions...",
    asset: "Asset",
    network: "Network",
    receivingAddress: "Receiving Address",
    copyAddress: "Kopyahin ang Wallet Address",
    addressCopied: "Nakopya ang Address ✓",
    submitDeposit: "Isumite ang Deposit",
    submitDescription: "Pagkatapos ipadala ang funds, ilagay ang halaga sa ibaba at isumite ang iyong deposit request.",
    amount: "Halaga (USDT)",
    enterAmount: "Ilagay ang halaga",
    submitting: "Isinusumite...",
    submitRequest: "Isumite ang Deposit Request",
    important: "Mahalaga",
    importantDescription: "Magpadala lamang ng USDT gamit ang ipinapakitang TRC20 network. Ang pagpapadala gamit ang ibang network ay maaaring magresulta sa permanenteng pagkawala ng funds.",
    unavailableTitle: "Pansamantalang hindi available ang Deposit",
    unavailableDescription: "Walang aktibong USDT TRC20 receiving wallet na kasalukuyang naka-configure.",
    validAmount: "Maglagay ng wastong deposit amount.",
    noWallet: "Walang aktibong deposit wallet na kasalukuyang naka-configure.",
    login: "Mag-log in bago magsumite ng deposit.",
    unableWallet: "Hindi ma-load ang deposit wallet.",
    unableSubmit: "Hindi maisumite ang deposit request.",
    success: "Matagumpay na naisumite ang deposit request. Reference:",
  },
} as const;

function Deposit() {
  const { language } = useLanguage();
  const text = depositText[language] ?? depositText.English;

  const [wallet, setWallet] = useState<DepositWallet | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadWallet() {
      try {
        setError("");

        const { data, error: walletError } = await supabase
          .from("deposit_wallets")
          .select("id, asset, network, wallet_address, label")
          .eq("is_active", true)
          .eq("asset", "USDT")
          .eq("network", "TRC20")
          .limit(1)
          .maybeSingle();

        if (walletError) {
          throw walletError;
        }

        setWallet(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : text.unableWallet
        );
      } finally {
        setLoading(false);
      }
    }

    loadWallet();
  }, [text.unableWallet]);

  async function copyAddress() {
    if (!wallet) return;

    await navigator.clipboard.writeText(wallet.wallet_address);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function submitDeposit(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError(text.validAmount);
      return;
    }

    if (!wallet) {
      setError(text.noWallet);
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(text.login);
        return;
      }

      const reference = `DEP-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      const { error: depositError } = await supabase
        .from("deposits")
        .insert({
          user_id: user.id,
          amount: numericAmount,
          currency: "USDT",
          status: "pending",
          reference,
        });

      if (depositError) {
        throw depositError;
      }

      setAmount("");

      setMessage(`${text.success} ${reference}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : text.unableSubmit
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          {text.loading}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-yellow-500/20">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            {text.dashboard}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-yellow-400 uppercase tracking-widest text-sm font-semibold">
          {text.fundAccount}
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-3">
          {text.deposit}{" "}
          <span className="text-yellow-400">USDT</span>
        </h1>

        <p className="text-gray-400 mt-4">
          {text.description}
        </p>

        {error && (
          <div className="mt-8 border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-8 border border-green-500/30 bg-green-500/10 rounded-2xl p-5 text-green-300">
            {message}
          </div>
        )}

        {!wallet && !error && (
          <div className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-8">
            <h2 className="text-xl font-bold">
              {text.unavailableTitle}
            </h2>

            <p className="text-gray-400 mt-2">
              {text.unavailableDescription}
            </p>
          </div>
        )}

        {wallet && (
          <>
            <section className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    {text.asset}
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {wallet.asset}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-500 text-sm">
                    {text.network}
                  </p>

                  <p className="text-xl font-bold text-yellow-400 mt-1">
                    {wallet.network}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-gray-500 text-sm">
                  {text.receivingAddress}
                </p>

                <div className="mt-2 bg-black border border-gray-700 rounded-2xl p-4">
                  <p className="text-sm break-all text-gray-200">
                    {wallet.wallet_address}
                  </p>
                </div>

                <button
                  onClick={copyAddress}
                  className="w-full mt-4 bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
                >
                  {copied
                    ? text.addressCopied
                    : text.copyAddress}
                </button>
              </div>

              {wallet.label && (
                <p className="text-gray-500 text-sm mt-5">
                  {wallet.label}
                </p>
              )}
            </section>

            <section className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
              <h2 className="text-2xl font-bold">
                {text.submitDeposit}
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                {text.submitDescription}
              </p>

              <form
                onSubmit={submitDeposit}
                className="mt-6"
              >
                <label className="block text-sm text-gray-400 mb-2">
                  {text.amount}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder={text.enterAmount}
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-5 bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 disabled:opacity-50"
                >
                  {submitting
                    ? text.submitting
                    : text.submitRequest}
                </button>
              </form>
            </section>

            <div className="mt-6 border border-yellow-500/20 bg-yellow-500/5 rounded-2xl p-5">
              <p className="text-yellow-400 font-semibold">
                {text.important}
              </p>

              <p className="text-gray-400 text-sm mt-2">
                {text.importantDescription}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Deposit;
