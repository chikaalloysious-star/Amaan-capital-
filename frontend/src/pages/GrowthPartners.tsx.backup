import { useState } from "react";

function GrowthPartners() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
          Amaan Capital
        </p>

        <h1 className="mt-3 text-4xl font-extrabold md:text-6xl">
          Local Growth Partners
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
          Join the Amaan Capital growth network and help introduce our
          platform to people and communities in your locality.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">📣</div>
            <h2 className="mt-5 text-xl font-bold">Community Outreach</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Introduce Amaan Capital to interested people and help them
              understand the platform and available services.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">🤝</div>
            <h2 className="mt-5 text-xl font-bold">Partner Network</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Work with Amaan Capital as part of an approved regional network
              of partners and ambassadors.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-7">
            <div className="text-4xl">📊</div>
            <h2 className="mt-5 text-xl font-bold">Performance Tracking</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Approved partners may receive access to referral tracking,
              promotional resources, and performance information.
            </p>
          </div>
        </div>

        <section className="mt-12 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-7 md:p-10">
          <h2 className="text-3xl font-bold text-yellow-400">
            Who Can Apply?
          </h2>

          <div className="mt-6 grid gap-4 text-gray-300 md:grid-cols-2">
            <p>✓ Community representatives</p>
            <p>✓ Digital marketers</p>
            <p>✓ Content creators</p>
            <p>✓ Business owners</p>
            <p>✓ Local ambassadors</p>
            <p>✓ Individuals with strong community networks</p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-gray-800 bg-gray-950 p-7 md:p-10">
          <h2 className="text-3xl font-bold">Partner Application</h2>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
              <h3 className="text-xl font-bold text-green-400">
                Application Received
              </h3>
              <p className="mt-2 text-gray-400">
                Thank you for your interest. Our team will review your
                application.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              <input
                required
                name="name"
                placeholder="Full name"
                className="rounded-2xl border border-gray-800 bg-black px-5 py-4 text-white outline-none focus:border-yellow-400"
              />

              <input
                required
                type="email"
                name="email"
                placeholder="Email address"
                className="rounded-2xl border border-gray-800 bg-black px-5 py-4 text-white outline-none focus:border-yellow-400"
              />

              <input
                required
                name="location"
                placeholder="City / locality"
                className="rounded-2xl border border-gray-800 bg-black px-5 py-4 text-white outline-none focus:border-yellow-400"
              />

              <input
                required
                name="country"
                placeholder="Country"
                className="rounded-2xl border border-gray-800 bg-black px-5 py-4 text-white outline-none focus:border-yellow-400"
              />

              <textarea
                required
                name="experience"
                placeholder="Tell us about your experience, audience, or community network"
                rows={5}
                className="md:col-span-2 rounded-2xl border border-gray-800 bg-black px-5 py-4 text-white outline-none focus:border-yellow-400"
              />

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-yellow-400 px-6 py-4 font-extrabold text-black"
              >
                Submit Partner Application
              </button>
            </form>
          )}
        </section>

        <p className="mt-8 text-xs leading-6 text-gray-600">
          Partner approval is not automatic. Applications may be reviewed
          based on location, experience, suitability, compliance requirements,
          and current expansion needs.
        </p>
      </div>
    </div>
  );
}

export default GrowthPartners;
