import { Link } from "react-router-dom";

type Opportunity = {
  icon: string;
  title: string;
  description: string;
  path?: string;
  status?: string;
  featured?: boolean;
};

const opportunities: Opportunity[] = [
  {
    icon: "📈",
    title: "Markets",
    description:
      "Track live crypto prices, market movements, market caps and trading volume.",
    path: "/markets",
    status: "LIVE",
    featured: true,
  },
  {
    icon: "💼",
    title: "Investments",
    description:
      "Explore available investment plans and manage your active investments.",
    path: "/plans",
    status: "LIVE",
    featured: true,
  },
  {
    icon: "📰",
    title: "Crypto News",
    description:
      "Stay informed with live crypto news and important market developments.",
    path: "/crypto-news",
    status: "LIVE",
    featured: true,
  },
  {
    icon: "🎓",
    title: "Amaan Learn",
    description:
      "Build your understanding of crypto, digital assets and financial markets through structured courses and lessons.",
    path: "/learn",
    status: "LIVE",
    featured: true,
  },
  {
    icon: "🎁",
    title: "Amaan Rewards",
    description:
      "Discover future rewards, milestones and opportunities available across the ecosystem.",
    status: "COMING SOON",
  },
  {
    icon: "👥",
    title: "Referral Program",
    description:
      "Invite others to Amaan Capital and track your referral activity.",
    path: "/referral",
    status: "LIVE",
  },
  {
    icon: "📣",
    title: "Local Growth Partners",
    description:
      "Explore opportunities to become a local growth partner and help expand Amaan Capital.",
    path: "/growth-partners",
    status: "LIVE",
  },
  {
    icon: "🔮",
    title: "Amaan Predictions",
    description:
      "A future prediction platform covering selected markets and events.",
    status: "FUTURE",
  },
  {
    icon: "🎮",
    title: "Amaan Gaming",
    description:
      "A future gaming ecosystem designed as a separate platform and ledger.",
    status: "FUTURE",
  },
];

function Opportunities() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">

        <section className="relative overflow-hidden rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-gray-950 to-black p-7 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
              Amaan Capital
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              Discover Your Next
              <span className="text-yellow-400"> Opportunity</span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
              Explore the growing Amaan Capital ecosystem — from live
              markets and investments to education, rewards, referrals and
              future opportunities.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Amaan Opportunities
            </h2>

            <p className="mt-2 max-w-2xl text-gray-500">
              One place to discover what you can use today and what is being
              developed for the future.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((item) => {
              const content = (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-3xl ring-1 ring-gray-800">
                      {item.icon}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wider ${
                        item.status === "LIVE"
                          ? "bg-green-400/10 text-green-400"
                          : item.status === "COMING SOON"
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  {item.path && (
                    <div className="mt-6 font-bold text-yellow-400">
                      Explore →
                    </div>
                  )}
                </>
              );

              if (item.path) {
                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="rounded-3xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-gray-900"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-gray-900 bg-gray-950/70 p-6 opacity-80"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-gray-800 bg-gray-950 p-7 md:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
            The bigger vision
          </p>

          <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">
            More than an investment platform
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-gray-500">
            Amaan Capital is being developed as a broader digital ecosystem
            connecting investment, markets, information, education,
            community and future opportunities in one platform.
          </p>
        </section>

      </main>
    </div>
  );
}

export default Opportunities;
