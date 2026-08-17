import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    min: 100,
    max: 999,
    roi: "0.25%",
    duration: "60 days",
  },
  {
    name: "Silver",
    min: 1000,
    max: 9999,
    roi: "0.35%",
    duration: "90 days",
  },
  {
    name: "Gold",
    min: 10000,
    max: 49999,
    roi: "0.50%",
    duration: "120 days",
    featured: true,
  },
  {
    name: "Platinum",
    min: 50000,
    max: 99999,
    roi: "0.65%",
    duration: "150 days",
  },
  {
    name: "Diamond",
    min: 100000,
    max: 599999,
    roi: "0.80%",
    duration: "180 days",
  },
  {
    name: "Elite",
    min: 600000,
    max: 600000,
    roi: "1.00%",
    duration: "365 days",
  },
];

function formatUSDT(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function LearnMore() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-yellow-500/20 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <Link
            to="/login"
            className="rounded-xl bg-yellow-400 px-5 py-2 font-bold text-black transition hover:bg-yellow-300"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            About Amaan Capital
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            Building a smarter future for
            <span className="text-yellow-400"> digital wealth</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
            Amaan Capital is a modern digital asset platform designed to give
            users access to structured cryptocurrency investment opportunities,
            portfolio tools, market information and digital financial services.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-500">
            Our platform brings different investment levels together in one
            place, allowing users to choose an opportunity according to their
            available capital and preferred investment duration.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
            >
              Start Investing
            </Link>

            <Link
              to="/"
              className="rounded-full border border-gray-700 px-8 py-4 font-semibold text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Back Home
            </Link>
          </div>
        </section>

        <section className="mt-20">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Investment Levels
            </p>

            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              Choose your investment level
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Amaan Capital offers multiple levels designed for different
              investment sizes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-7 transition hover:-translate-y-1 ${
                  plan.featured
                    ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10"
                    : "border-gray-800 bg-gray-900/70 hover:border-yellow-500/50"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-black">
                    Most Popular
                  </span>
                )}

                <h3 className="text-2xl font-extrabold">
                  {plan.name}
                </h3>

                <p className="mt-6 text-sm text-gray-500">
                  Investment range
                </p>

                <p className="mt-1 text-2xl font-extrabold text-yellow-400">
                  {formatUSDT(plan.min)} USDT
                </p>

                <p className="text-sm text-gray-500">
                  to {formatUSDT(plan.max)} USDT
                </p>

                <div className="my-6 border-t border-gray-800" />

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Daily ROI</span>
                  <span className="font-bold text-yellow-400">
                    {plan.roi}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-semibold">
                    {plan.duration}
                  </span>
                </div>

                <Link
                  to="/login"
                  className={`mt-8 block w-full rounded-xl py-4 text-center font-bold transition ${
                    plan.featured
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "border border-yellow-500 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  }`}
                >
                  Start with {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-4xl rounded-3xl border border-gray-800 bg-gray-950 p-8 text-center md:p-10">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to explore Amaan Capital?
          </h2>

          <p className="mt-4 text-gray-400">
            Create an account or log in to explore the full platform,
            available investment plans and your personal dashboard.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-block rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
          >
            Start Investing
          </Link>
        </section>
      </main>
    </div>
  );
}

export default LearnMore;
