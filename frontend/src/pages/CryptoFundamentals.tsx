import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const lessons = [
  {
    number: 1,
    icon: "🌱",
    title: "What Is Cryptocurrency?",
    description:
      "Learn what cryptocurrency is, why it was created, and how digital assets differ from traditional money.",
  },
  {
    number: 2,
    icon: "🔗",
    title: "What Is Blockchain?",
    description:
      "Understand blockchain technology, distributed ledgers, blocks, transactions and network verification.",
  },
  {
    number: 3,
    icon: "👛",
    title: "How Crypto Wallets Work",
    description:
      "Learn about public addresses, private keys, seed phrases and the importance of wallet security.",
  },
  {
    number: 4,
    icon: "🏦",
    title: "Exchanges & Trading",
    description:
      "Understand what crypto exchanges do and the basic concepts behind buying and selling digital assets.",
  },
  {
    number: 5,
    icon: "💵",
    title: "Understanding Stablecoins",
    description:
      "Learn what stablecoins are, why they are used and the risks users should understand.",
  },
  {
    number: 6,
    icon: "₿",
    title: "Bitcoin & Ethereum",
    description:
      "Explore two of the most important crypto networks and how their purposes differ.",
  },
  {
    number: 7,
    icon: "⚠️",
    title: "Crypto Risks",
    description:
      "Understand volatility, scams, platform risks, transaction errors and other important considerations.",
  },
  {
    number: 8,
    icon: "🛡️",
    title: "Security & Best Practices",
    description:
      "Learn practical principles for protecting accounts, wallets, credentials and digital assets.",
  },
];

function CryptoFundamentals() {
  const location = useLocation();
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("learning_progress")
        .select("lesson_number")
        .eq("user_id", user.id)
        .eq("course_slug", "crypto-fundamentals")
        .order("lesson_number", { ascending: true });

      if (!error && data) {
        setCompletedLessons(
          data.map((item) => item.lesson_number)
        );
      }

      setLoading(false);
    }

    loadProgress();
  }, [location.key]);

  const completedCount = completedLessons.length;
  const totalLessons = lessons.length;
  const progress = Math.round(
    (completedCount / totalLessons) * 100
  );

  const nextLesson =
    lessons.find(
      (lesson) => !completedLessons.includes(lesson.number)
    ) ?? lessons[lessons.length - 1];

  const courseCompleted = completedCount === totalLessons;

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">

        <Link
          to="/learn"
          className="text-sm font-bold text-yellow-400 hover:text-yellow-300"
        >
          ← Back to Amaan Learn
        </Link>

        <section className="mt-6 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-gray-950 to-black p-7 md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
            Amaan Academy
          </p>

          <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">
            Crypto Fundamentals
          </h1>

          <p className="mt-5 max-w-3xl text-gray-400 md:text-lg md:leading-8">
            A beginner-friendly introduction to cryptocurrency, blockchain,
            wallets, exchanges, stablecoins, market risks and digital-asset
            security.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-extrabold text-black">
              BEGINNER
            </span>

            <span className="rounded-full border border-gray-700 px-4 py-2 text-xs font-bold text-gray-400">
              8 LESSONS
            </span>

            <span className="rounded-full border border-gray-700 px-4 py-2 text-xs font-bold text-gray-400">
              SELF-PACED
            </span>
          </div>
        </section>

        {/* PROGRESS */}
        <section className="mt-8 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                Your Progress
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                {loading
                  ? "Loading progress..."
                  : courseCompleted
                    ? "Course completed 🎓"
                    : `${completedCount} of ${totalLessons} lessons completed`}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {courseCompleted
                  ? "Congratulations! You have completed Crypto Fundamentals."
                  : "Your learning progress is saved to your Amaan Capital account."}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-3xl font-extrabold text-yellow-400">
                {progress}%
              </p>
              <p className="text-xs font-bold text-gray-600">
                COMPLETE
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-black">
            <div
              className="h-full rounded-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!loading && (
            <Link
              to={`/learn/crypto-fundamentals/${nextLesson.number}`}
              className="mt-6 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-black transition hover:bg-yellow-300"
            >
              {courseCompleted
                ? "Review Final Lesson →"
                : completedCount === 0
                  ? "Start Course →"
                  : "Continue Learning →"}
            </Link>
          )}
        </section>

        {/* CURRICULUM */}
        <section className="mt-12">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
              Course Curriculum
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Start Learning
            </h2>

            <p className="mt-2 text-gray-500">
              Complete the lessons in order to build a strong foundation.
            </p>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson) => {
              const completed = completedLessons.includes(
                lesson.number
              );

              return (
                <Link
                  key={lesson.number}
                  to={`/learn/crypto-fundamentals/${lesson.number}`}
                  className={`group flex items-center gap-5 rounded-3xl border p-5 transition md:p-6 ${
                    completed
                      ? "border-green-400/20 bg-green-400/5 hover:border-green-400/40"
                      : "border-gray-800 bg-gray-950 hover:border-yellow-400/50 hover:bg-gray-900"
                  }`}
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ring-1 ${
                      completed
                        ? "bg-green-400/10 ring-green-400/20"
                        : "bg-black ring-gray-800"
                    }`}
                  >
                    {completed ? "✓" : lesson.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                        Lesson {lesson.number}
                      </p>

                      {completed && (
                        <span className="rounded-full bg-green-400/10 px-2 py-1 text-[9px] font-extrabold text-green-400">
                          COMPLETED
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 text-lg font-bold">
                      {lesson.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="hidden text-xl text-gray-600 transition group-hover:text-yellow-400 sm:block">
                    →
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}

export default CryptoFundamentals;
