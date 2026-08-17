import { Link } from "react-router-dom";

const faqs = [
  {
    q: "What is Amaan Capital?",
    a: "Amaan Capital is an investment platform where registered users can review available investment plans, fund their accounts, invest, and monitor their activity from their dashboard.",
  },
  {
    q: "How do I get started?",
    a: "Create an account, complete any required account verification, fund your account, and choose an investment plan that suits your available balance and goals.",
  },
  {
    q: "How do deposits work?",
    a: "Choose Deposit from your dashboard, follow the displayed instructions, and submit your deposit request. Deposits may require administrative approval before the funds become available.",
  },
  {
    q: "How do withdrawals work?",
    a: "You can submit a withdrawal request from the Withdraw section of your account. Withdrawal requests may be reviewed before they are processed.",
  },
  {
    q: "Do referred users have to complete KYC for referral rewards?",
    a: "No. Under the current referral program rules, KYC verification is not required for a referred user to count toward a referral milestone. The referred user must, however, meet the applicable investment requirement.",
  },
  {
    q: "How does the referral program work?",
    a: "You receive a personal referral link and code. When eligible users join through your referral and meet the applicable investment requirement, they can count toward your referral milestones.",
  },
  {
    q: "What is the 10-referral reward?",
    a: "When 10 eligible referred users have each invested at least 100 USDT, the referrer qualifies for a free Beginner investment plan, subject to the platform's reward rules.",
  },
  {
    q: "What is the 20-referral reward?",
    a: "When 20 eligible referred users have each invested at least 1,000 USDT, the referrer qualifies for a free investment plan worth 1,000 USDT, subject to the platform's reward rules.",
  },
  {
    q: "Can I refer myself?",
    a: "No. Self-referrals are not permitted. Referral activity is designed for genuine referrals of other users.",
  },
  {
    q: "Where can I see my referral information?",
    a: "Open Referral Program from your dashboard. Your referral code, referral link, progress, and eligible referral information are displayed there.",
  },
  {
    q: "How can I contact support?",
    a: "Visit the Contact page to reach Amaan Capital customer support.",
  },
];

function FAQ() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-yellow-500/20 bg-black">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-yellow-400">
            Amaan Capital
          </Link>

          <Link
            to="/contact"
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            Contact Support
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Help Center
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">
            Frequently Asked Questions
          </h1>

          <p className="mt-4 text-gray-400 max-w-2xl">
            Find answers about accounts, investments, deposits, withdrawals,
            referrals, rewards, and support.
          </p>
        </section>

        <section className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-gray-800 bg-gray-950 p-6"
            >
              <summary className="cursor-pointer list-none font-bold text-lg flex items-center justify-between gap-4">
                <span>{faq.q}</span>
                <span className="text-yellow-400 group-open:rotate-45 transition">
                  +
                </span>
              </summary>

              <p className="mt-4 text-gray-400 leading-7">
                {faq.a}
              </p>
            </details>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8">
          <h2 className="text-2xl font-bold">
            Still need help?
          </h2>

          <p className="mt-2 text-gray-400">
            Our support team can help with account, deposit, withdrawal,
            investment, and referral questions.
          </p>

          <Link
            to="/contact"
            className="inline-block mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300 transition"
          >
            Contact Customer Care
          </Link>
        </section>
      </main>
    </div>
  );
}

export default FAQ;
