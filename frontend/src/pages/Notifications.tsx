import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Notification = {
  id: string;
  title: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
};

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("id,title,message,is_read,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setNotifications(data || []);
      }

      setLoading(false);
    }

    loadNotifications();
  }, []);

  async function markAsRead(id: string) {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );
  }

  async function markAllAsRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
  }

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              Amaan Capital
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">
              Notifications
            </h1>
          </div>

          {notifications.some((notification) => !notification.is_read) && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-xl border border-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
            >
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 text-center text-yellow-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-10 text-center">
            <div className="text-4xl">🔔</div>
            <h2 className="mt-4 text-xl font-bold">
              No notifications
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              You&apos;re all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  notification.is_read
                    ? "border-gray-800 bg-gray-950"
                    : "border-yellow-500/30 bg-yellow-500/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-xl">🔔</span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-bold">
                        {notification.title || "Notification"}
                      </h2>

                      {!notification.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {notification.message || ""}
                    </p>

                    <p className="mt-3 text-xs text-gray-600">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
