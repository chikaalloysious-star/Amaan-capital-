function Contact() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-6 py-14 md:px-10">

        <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
          Amaan Capital
        </p>

        <h1 className="mt-3 text-4xl font-extrabold md:text-6xl">
          Contact Amaan Capital
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
          Need help with your account, have a question about the platform,
          or want to stay connected with Amaan Capital? Our official
          communication channels are available below.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <a
            href="https://t.me/+8UPvf4fPH-dmMDA0"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-gray-800 bg-gray-950 p-7 transition hover:border-yellow-400/50"
          >
            <div className="text-4xl">📢</div>

            <h2 className="mt-5 text-xl font-bold">
              Official Telegram Channel
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Follow the official Amaan Capital channel for platform
              announcements, updates, news and important information.
            </p>

            <span className="mt-5 inline-block font-bold text-yellow-400 group-hover:text-yellow-300">
              Join Official Channel →
            </span>
          </a>

          <a
            href="https://t.me/Amaan_capital_investments"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-7 transition hover:border-yellow-400"
          >
            <div className="text-4xl">🛟</div>

            <h2 className="mt-5 text-xl font-bold">
              Customer Service
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Contact our customer-service team on Telegram for assistance
              with your account and questions about the platform.
            </p>

            <p className="mt-4 font-semibold text-gray-300">
              @Amaan_capital_investments
            </p>

            <span className="mt-4 inline-block font-bold text-yellow-400 group-hover:text-yellow-300">
              Contact Customer Service →
            </span>
          </a>

          <a
            href="mailto:amaancapitalinvestments@gmail.com"
            className="group rounded-3xl border border-gray-800 bg-gray-950 p-7 transition hover:border-yellow-400/50"
          >
            <div className="text-4xl">📧</div>

            <h2 className="mt-5 text-xl font-bold">
              Support Email
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Send us an email for support enquiries, account questions or
              other platform-related matters.
            </p>

            <p className="mt-4 break-all font-semibold text-gray-300">
              amaancapitalinvestments@gmail.com
            </p>

            <span className="mt-4 inline-block font-bold text-yellow-400 group-hover:text-yellow-300">
              Send an Email →
            </span>
          </a>

        </div>

        <section className="mt-12 rounded-3xl border border-gray-800 bg-gray-950 p-8 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
            Before contacting support
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            How we can help
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-gray-800 bg-black p-5">
              <h3 className="font-bold">🔐 Account & KYC</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Questions about registration, account access or identity
                verification.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-black p-5">
              <h3 className="font-bold">💰 Deposits & Withdrawals</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Assistance with transaction procedures and account activity.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-black p-5">
              <h3 className="font-bold">📊 Investments</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Questions about investment plans and investment activity.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-black p-5">
              <h3 className="font-bold">🛡️ Platform Support</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Report technical issues or problems using the Amaan Capital
                platform.
              </p>
            </div>

          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-7">
          <h2 className="text-xl font-bold text-yellow-400">
            Security reminder
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-400">
            Never share your password, authentication codes, private keys or
            wallet recovery phrases with anyone claiming to provide support.
            Amaan Capital support will not ask you to disclose sensitive
            security credentials.
          </p>
        </section>

      </main>
    </div>
  );
}

export default Contact;
