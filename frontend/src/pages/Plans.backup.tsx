import { Link } from "react-router-dom";

type Plan = {
  name: string;
  min: number;
  max: number;
  roi: number;
  duration: number;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    min: 100,
    max: 999,
    roi: 0.25,
    duration: 60,
  },
  {
    name: "Silver",
    min: 1000,
    max: 9999,
    roi: 0.35,
    duration: 90,
  },
  {
    name: "Gold",
    min: 10000,
    max: 49999,
    roi: 0.5,
    duration: 120,
    featured: true,
  },
  {
    name: "Platinum",
    min: 50000,
    max: 99999,
    roi: 0.65,
    duration: 150,
  },
  {
    name: "Diamond",
    min: 100000,
    max: 599999,
    roi: 0.8,
    duration: 180,
  },
  {
    name: "Elite",
    min: 600000,
    max: 600000,
    roi: 1,
    duration: 365,
  },
];

function formatUSDT(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateROI(
  principal: number,
  dailyROI: number,
  duration: number
) {
  return principal * (dailyROI / 100) * duration;
}

function Plans() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 md:px-12">

      <div className="max-w-5xl mx-auto text-center">

        <Link
          to="/"
          className="text-2xl font-extrabold text-yellow-400"
        >
          Amaan Capital
        </Link>

        <h1 className="text-4xl md:text-6xl font-bold mt-10">
          Investment <span className="text-yellow-400">Plans</span>
        </h1>

        <p className="text-gray-400 text-lg mt-5 max-w-2xl mx-auto">
          Select an investment plan based on your preferred
          portfolio size and investment duration.
        </p>

      </div>

      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">

        {plans.map((plan) => {

          const dailyROI = calculateROI(
            plan.max,
            plan.roi,
            1
          );

          const totalROI = calculateROI(
            plan.max,
            plan.roi,
            plan.duration
          );

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-7 border transition hover:-translate-y-1 ${
                plan.featured
                  ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10"
                  : "border-gray-800 bg-gray-900/70 hover:border-yellow-500/50"
              }`}
            >

              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-5 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold">
                {plan.name}
              </h2>

              <p className="text-gray-500 text-sm mt-5">
                Investment Range
              </p>

              <p className="text-2xl font-extrabold text-yellow-400 mt-1">
                {formatUSDT(plan.min)} USDT
              </p>

              <p className="text-gray-500 text-sm">
                to {formatUSDT(plan.max)} USDT
              </p>

              <div className="border-t border-gray-800 my-6" />

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">
                  Daily ROI
                </span>

                <span className="text-yellow-400 font-bold">
                  {plan.roi.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">
                  Duration
                </span>

                <span className="font-semibold">
                  {plan.duration} days
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">
                  Minimum Withdrawal
                </span>

                <span className="font-semibold">
                  25 USDT
                </span>
              </div>

              <div className="bg-black/50 rounded-2xl p-4 mt-6">

                <p className="text-gray-500 text-sm">
                  Daily ROI at maximum investment
                </p>

                <p className="text-xl font-bold text-white mt-1">
                  {formatUSDT(dailyROI)} USDT
                </p>

              </div>

              <div className="mt-4">

                <p className="text-gray-500 text-sm">
                  Total ROI over {plan.duration} days
                </p>

                <p className="text-xl font-bold text-yellow-400 mt-1">
                  {formatUSDT(totalROI)} USDT
                </p>

              </div>

              <Link
                to={`/register?plan=${plan.name.toLowerCase()}`}
                className={`block text-center mt-8 py-4 rounded-xl font-bold transition ${
                  plan.featured
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "border border-yellow-500 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                Choose {plan.name}
              </Link>

            </div>
          );
        })}

      </div>

      <div className="max-w-4xl mx-auto mt-16 text-center">

        <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-7">

          <h2 className="text-2xl font-bold">
            Withdrawal Minimum
          </h2>

          <p className="text-gray-400 mt-3">
            The minimum withdrawal amount is
          </p>

          <p className="text-4xl font-extrabold text-yellow-400 mt-2">
            25 USDT
          </p>

        </div>

      </div>

      <div className="max-w-4xl mx-auto text-center mt-14">

        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to get started?
        </h2>

        <p className="text-gray-400 mt-3">
          Create an account and select your preferred plan.
        </p>

        <Link
          to="/register"
          className="inline-block mt-7 bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
        >
          Create Account
        </Link>

      </div>

    </div>
  );
}

export default Plans;
