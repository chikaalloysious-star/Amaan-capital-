import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    try {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error: notificationError } = await supabase
        .from("notifications")
        .select(
          "id,type,title,message,is_read,created_at"
        )
        .order("created_at", { ascending: false });

      if (notificationError) {
        throw notificationError;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error("Notifications loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function markAsRead(id: string) {
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );
  }

  async function markAllAsRead() {
    const unread = notifications.filter(
      (notification) => !notification.is_read
    );

    if (unread.length === 0) return;

    try {
      setWorking(true);
      setError("");

      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (updateError) {
        throw updateError;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark notifications as read."
      );
    } finally {
      setWorking(false);
    }
  }

  function notificationIcon(type: string) {
    const value = type.toLowerCase();

    if (value.includes("deposit")) return "↓";
    if (value.includes("withdraw")) return "↑";
    if (value.includes("investment")) return "◆";
    if (value.includes("security")) return "🔐";

    return "🔔";
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
              Amaan Capital
            </p>

            <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
              Notifications
            </h1>

            <p className="mt-3 text-gray-400">
              Stay updated about your account and transactions.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={working}
              className="rounded-xl border border-yellow-400/30 px-4 py-3 text-sm font-semibold text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-50"
            >
              {working
                ? "Updating..."
                : `Mark all as read (${unreadCount})`}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-gray-800 bg-gray-950 p-10 text-center">
            <div className="text-5xl">🔔</div>

            <h2 className="mt-5 text-xl font-bold">
              No notifications yet
            </h2>

            <p className="mt-2 text-gray-500">
              Important account and transaction updates will appear here.
            </p>
          </section>
        ) : (
          <section className="mt-8 space-y-3">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-2xl border p-5 transition ${
                  notification.is_read
                    ? "border-gray-800 bg-gray-950"
                    : "border-yellow-400/30 bg-yellow-400/5"
                }`}
              >
                <div className="flex gap-4">

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                      notification.is_read
                        ? "bg-gray-900 text-gray-400"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {notificationIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-bold">
                          {notification.title}
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.is_read && (
                        <span className="inline-flex w-fit rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                          New
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">

                      <p className="text-xs text-gray-600">
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </p>

                      {!notification.is_read && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="text-xs font-semibold text-yellow-400 hover:text-yellow-300"
                        >
                          Mark as read
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        <div className="mt-8">
          <Link
            to="/settings"
            className="text-sm font-semibold text-gray-500 hover:text-white"
          >
            ← Back to Settings
          </Link>
        </div>

      </main>
    </div>
  );
}

export default Notifications;
