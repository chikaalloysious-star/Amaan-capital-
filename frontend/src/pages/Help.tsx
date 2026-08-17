import { Link } from "react-router-dom";

function Help() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-16">

        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Amaan Capital
        </p>

        <h1 className="mt-3 text-4xl md:text-6xl font-extrabold">
          Help & Support
        </h1>

        <p className="mt-4 max-w-2xl text-gray-400">
          Find answers, get customer support, learn about our referral
          program, explore opportunities, and review our policies.
        </p>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 mt-12">

          <Link
            to="/faq"
            className="rounded-3xl border border-gray-800 bg-gray-950 p-7 hover:border-yellow-500/50 transition"
          >
            <div className="text-4xl">❓</div>
            <h2 className="mt-5 text-xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Answers to common questions about accounts, investments,
              deposits, withdrawals, KYC, and referrals.
            </p>
          </Link>

          <Link
            to="/referral"
            className="rounded-3xl border border-yellow-500/30 bg-yellow-500/5 p-7 hover:border-yellow-400 transition"
          >
            <div className="text-4xl">🎁</div>
            <h2 className="mt-5 text-xl font-bold">
              Referral Program
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Invite users and qualify for free investment-plan rewards
              through our referral milestones.
            </p>
          </Link>

          <Link
            to="/contact"
            className="rounded-3xl border border-gray-800 bg-gray-950 p-7 hover:border-yellow-500/50 transition"
          >
            <div className="text-4xl">🛟</div>
            <h2 className="mt-5 text-xl font-bold">
              Customer Care
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Need assistance? Contact our customer-care team for
              account and platform support.
            </p>
          </Link>

          <Link
            to="/careers"
            className="rounded-3xl border border-yellow-500/30 bg-yellow-500/5 p-7 hover:border-yellow-400 transition"
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">📣</div>

              <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-extrabold text-black">
                HIRING
              </span>
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Local Growth Partners
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Help introduce Amaan Capital to potential users in your
              locality. Selected partners may be employed and compensated
              according to the applicable role and agreement.
            </p>
          </Link>

          <Link
            to="/privacy"
            className="rounded-3xl border border-gray-800 bg-gray-950 p-7 hover:border-yellow-500/50 transition"
          >
            <div className="text-4xl">🔒</div>
            <h2 className="mt-5 text-xl font-bold">
              Privacy Policy
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Learn how we handle information and protect user privacy.
            </p>
          </Link>

          <Link
            to="/terms"
            className="rounded-3xl border border-gray-800 bg-gray-950 p-7 hover:border-yellow-500/50 transition"
          >
            <div className="text-4xl">📄</div>
            <h2 className="mt-5 text-xl font-bold">
              Terms & Conditions
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review the rules and conditions governing use of
              Amaan Capital.
            </p>
          </Link>

        </div>

      </main>
    </div>
  );
}

export default Help;
