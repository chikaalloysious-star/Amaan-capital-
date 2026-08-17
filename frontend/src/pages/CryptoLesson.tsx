import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const lessons = [
  {
    number: 1,
    icon: "🌱",
    title: "What Is Cryptocurrency?",
    content: [
      {
        heading: "Understanding cryptocurrency",
        paragraphs: [
          "Cryptocurrency is a form of digital asset that uses cryptographic technology to help secure transactions and control the creation or transfer of units.",
          "Unlike traditional currencies that are generally issued and managed by central banks, many cryptocurrencies operate through decentralized computer networks."
        ],
      },
      {
        heading: "Why was cryptocurrency created?",
        paragraphs: [
          "One of the major ideas behind cryptocurrency is allowing people to transfer value digitally without relying entirely on a central intermediary.",
          "Bitcoin, launched in 2009, introduced a system where transactions could be recorded on a distributed network and verified according to predefined rules."
        ],
      },
      {
        heading: "Digital assets",
        paragraphs: [
          "The cryptocurrency ecosystem contains many different types of digital assets. Some are designed primarily as payment networks, while others support applications, smart contracts, stable-value tokens or other functions.",
          "Different assets can have very different technologies, purposes and risks."
        ],
      },
      {
        heading: "Important to remember",
        paragraphs: [
          "Cryptocurrency prices can be highly volatile. A digital asset can increase or decrease significantly in value, and there is no guarantee that an investment will make money.",
          "Understanding the technology and risks is an important first step before using any digital-asset service."
        ],
      },
    ],
  },
  {
    number: 2,
    icon: "🔗",
    title: "What Is Blockchain?",
    content: [
      {
        heading: "Coming next",
        paragraphs: [
          "This lesson will explain blockchain networks, distributed ledgers, blocks, transactions and network verification."
        ],
      },
    ],
  },
  {
    number: 3,
    icon: "👛",
    title: "How Crypto Wallets Work",
    content: [
      {
        heading: "Coming next",
        paragraphs: [
          "This lesson will explain wallet addresses, private keys, seed phrases and wallet security."
        ],
      },
    ],
  },
  {
    number: 4,
    icon: "🏦",
    title: "Exchanges & Trading",
    content: [
      {
        heading: "Coming next",
        paragraphs: [
          "This lesson will explain what cryptocurrency exchanges do and introduce basic market concepts."
        ],
      },
    ],
  },
  {
    number: 5,
    icon: "💵",
    title: "Understanding Stablecoins",
    content: [
      {
        heading: "Coming next",
        paragraphs: [
          "This lesson will explain stablecoins, their common uses and their associated risks."
        ],
      },
    ],
  },
  {
    number: 6,
    icon: "₿",
    title: "Bitcoin & Ethereum",
    content: [
      {
        heading: "Coming next",
        paragraphs: [
          "This lesson will introduce Bitcoin and Ethereum and explain some of the key differences between their networks."
        ],
      },
    ],
  },
  {
    number: 7,
    icon: "⚠️",
    title: "Crypto Risks",
    content: [
      {
        heading: "Coming next",
        paragraphs: [
          "This lesson will cover volatility, scams, transaction risks, platform risks and other important considerations."
        ],
      },
    ],
  },
  {
    number: 8,
    icon: "🛡️",
    title: "Security & Best Practices",
    content: [
      {
        heading: "Coming next",
        paragraphs: [
          "This lesson will cover account security, wallet protection, passwords, private keys and common security mistakes."
        ],
      },
    ],
  },
];

function CryptoLesson() {
  const { lessonNumber } = useParams();

  const number = Number(lessonNumber);

  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      setLoadingProgress(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !number) {
        setLoadingProgress(false);
        return;
      }

      const { data, error } = await supabase
        .from("learning_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", "crypto-fundamentals")
        .eq("lesson_number", number)
        .maybeSingle();

      if (!error && data) {
        setCompleted(true);
      }

      setLoadingProgress(false);
    }

    loadProgress();
  }, [number]);

  async function markComplete() {
    if (completed || saving || !number) return;

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("learning_progress")
      .upsert(
        {
          user_id: user.id,
          course_slug: "crypto-fundamentals",
          lesson_number: number,
        },
        {
          onConflict: "user_id,course_slug,lesson_number",
        }
      );

    if (!error) {
      setCompleted(true);
    }

    setSaving(false);
  }


  const lesson = lessons.find(
    (item) => item.number === number
  );

  if (!lesson) {
    return (
      <div className="min-h-screen bg-black px-5 py-16 text-white">
        <main className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-extrabold">
            Lesson not found
          </h1>

          <Link
            to="/learn/crypto-fundamentals"
            className="mt-6 inline-block font-bold text-yellow-400"
          >
            ← Back to course
          </Link>
        </main>
      </div>
    );
  }

  const previous = lessons.find(
    (item) => item.number === number - 1
  );

  const next = lessons.find(
    (item) => item.number === number + 1
  );

  const progress = Math.round(
    (lesson.number / lessons.length) * 100
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">

        <Link
          to="/learn/crypto-fundamentals"
          className="text-sm font-bold text-yellow-400 hover:text-yellow-300"
        >
          ← Back to Crypto Fundamentals
        </Link>

        <div className="mt-8">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500">
              LESSON {lesson.number} OF {lessons.length}
            </span>

            <span className="text-yellow-400">
              {progress}% COMPLETE
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-900">
            <div
              className="h-full rounded-full bg-yellow-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-gray-950 to-black p-7 md:p-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl ring-1 ring-gray-800">
            {lesson.icon}
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            Amaan Academy
          </p>

          <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-4 text-gray-500">
            Crypto Fundamentals
          </p>
        </section>

        <article className="mt-8 space-y-6">
          {lesson.content.map((section) => (
            <section
              key={section.heading}
              className="rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold">
                {section.heading}
              </h2>

              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-8 text-gray-400"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <section className="mt-10 rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-6 md:p-8">
          <h2 className="text-xl font-bold text-yellow-400">
            🎓 Learning Reminder
          </h2>

          <p className="mt-3 leading-7 text-gray-400">
            Amaan Academy is designed for education and general
            information. Learning about digital assets does not guarantee
            investment results.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                Lesson Progress
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {completed ? "Lesson completed ✓" : "Ready to complete this lesson?"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {completed
                  ? "Your progress has been saved to your Amaan Capital account."
                  : "Mark this lesson complete after you have finished reading it."}
              </p>
            </div>

            <button
              type="button"
              onClick={markComplete}
              disabled={completed || saving || loadingProgress}
              className={`rounded-xl px-6 py-3 text-sm font-extrabold transition ${
                completed
                  ? "cursor-default bg-green-400/10 text-green-400"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              {saving
                ? "Saving..."
                : completed
                  ? "✓ Completed"
                  : "Mark as Complete"}
            </button>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
          {previous ? (
            <Link
              to={`/learn/crypto-fundamentals/${previous.number}`}
              className="rounded-xl border border-gray-700 px-5 py-3 text-center text-sm font-bold text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
            >
              ← Previous Lesson
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              to={`/learn/crypto-fundamentals/${next.number}`}
              className="rounded-xl bg-yellow-400 px-5 py-3 text-center text-sm font-extrabold text-black hover:bg-yellow-300"
            >
              Next Lesson →
            </Link>
          ) : (
            <Link
              to="/learn/crypto-fundamentals"
              className="rounded-xl bg-yellow-400 px-5 py-3 text-center text-sm font-extrabold text-black hover:bg-yellow-300"
            >
              Finish Course ✓
            </Link>
          )}
        </div>

      </main>
    </div>
  );
}

export default CryptoLesson;
