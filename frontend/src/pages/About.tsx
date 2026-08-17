import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-6 py-14 md:px-10">

        <section className="relative overflow-hidden rounded-[2rem] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-black to-gray-950 p-8 md:p-14">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            Amaan Capital
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Building a smarter way to discover, manage and grow with digital
            finance.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
            Amaan Capital is a digital financial platform designed to bring
            investment tools, live crypto markets, financial information and
            opportunities together in one modern ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/plans"
              className="rounded-xl bg-yellow-400 px-6 py-3 font-extrabold text-black transition hover:bg-yellow-300"
            >
              Explore Investment Plans
            </Link>

            <Link
              to="/markets"
              className="rounded-xl border border-gray-700 px-6 py-3 font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Explore Markets
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
            Our Vision
          </p>

          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            More than an investment platform.
          </h2>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-400">
            We believe the future of finance should be easier to understand,
            easier to access and more connected. Amaan Capital is being built
            as an ecosystem where users can discover financial opportunities,
            follow markets, learn about digital assets and manage their
            activities from one place.
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">💼</div>
            <h3 className="mt-5 text-xl font-bold">Investment</h3>
            <p className="mt-3 leading-7 text-gray-500">
              Access structured investment plans and keep track of your
              investment activity through a dedicated account dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">📈</div>
            <h3 className="mt-5 text-xl font-bold">Live Markets</h3>
            <p className="mt-3 leading-7 text-gray-500">
              Follow live cryptocurrency prices and market movements from
              major digital assets in one convenient place.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">📰</div>
            <h3 className="mt-5 text-xl font-bold">Crypto Intelligence</h3>
            <p className="mt-3 leading-7 text-gray-500">
              Stay informed with crypto news and market information designed
              to help users better understand what is happening in the
              digital-asset world.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">🎓</div>
            <h3 className="mt-5 text-xl font-bold">Learn & Grow</h3>
            <p className="mt-3 leading-7 text-gray-500">
              Our long-term vision includes educational resources that help
              users build stronger financial and digital-asset knowledge.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">🎁</div>
            <h3 className="mt-5 text-xl font-bold">Rewards & Referrals</h3>
            <p className="mt-3 leading-7 text-gray-500">
              Amaan Capital is developing ways for users to participate in
              referral and reward programs as the ecosystem expands.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">🌍</div>
            <h3 className="mt-5 text-xl font-bold">Global Direction</h3>
            <p className="mt-3 leading-7 text-gray-500">
              We're building with a global audience in mind, supported by
              multilingual experiences and a growing international vision.
            </p>
          </div>

        </section>

        <section className="mt-12 rounded-3xl border border-gray-800 bg-gray-950 p-8 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
            Built for the future
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            One ecosystem. Many possibilities.
          </h2>

          <p className="mt-5 max-w-4xl leading-8 text-gray-400">
            The Amaan Capital vision extends beyond today's core platform.
            Over time, the ecosystem is designed to expand into education,
            market intelligence, watchlists, smart alerts, rewards,
            communities, growth partnerships and AI-powered financial
            assistance.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Markets",
              "Investments",
              "News",
              "Learn",
              "Rewards",
              "Community",
              "Growth Partners",
              "AI Assistance",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-800 bg-black px-4 py-4 text-center font-semibold text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-8 text-center md:p-12">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Your journey starts here.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
            Explore the platform, learn about the markets and discover what
            Amaan Capital is building for the future of digital finance.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-yellow-400 px-7 py-3 font-extrabold text-black hover:bg-yellow-300"
            >
              Create Your Account
            </Link>

            <Link
              to="/about"
              className="rounded-xl border border-gray-700 px-7 py-3 font-bold hover:border-yellow-400 hover:text-yellow-400"
            >
              Learn More
            </Link>
          </div>
        </section>

        <p className="mt-8 text-center text-xs leading-6 text-gray-600">
          Digital assets and investment activities involve risk. Users should
          understand applicable risks, terms and requirements before using
          financial services.
        </p>

      </main>
    </div>
  );
}

export default About;
