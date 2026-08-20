import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuditLog = {
  id: string;
  admin_user_id: string;
  action: string;
  target_user_id: string | null;
  description: string | null;
  created_at: string;
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs() {
    setError("");

    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_super_admin");

    if (adminError) {
      setError(adminError.message);
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      setError("Administrator access required.");
      setLoading(false);
      return;
    }

    const { data, error: logsError } = await supabase
      .from("admin_audit_logs")
      .select(
        "id,admin_user_id,action,target_user_id,description,created_at"
      )
      .order("created_at", { ascending: false });

    if (logsError) {
      setError(logsError.message);
    } else {
      setLogs(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading audit logs...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Admin Audit Logs
          </h1>

          <p className="mt-2 text-gray-400">
            Complete history of important administrative actions.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {logs.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 text-center">
            <p className="text-gray-400">
              No audit logs found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-gray-800 bg-gray-950 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase text-yellow-400">
                        {log.action}
                      </span>

                      <span className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-200">
                      {log.description || "No description provided."}
                    </p>
                  </div>

                  <div className="min-w-0 text-xs text-gray-500 md:w-72 md:text-right">
                    <p>Admin</p>

                    <p className="mt-1 break-all text-gray-400">
                      {log.admin_user_id}
                    </p>

                    <p className="mt-3">Target User</p>

                    <p className="mt-1 break-all text-gray-400">
                      {log.target_user_id || "Not recorded"}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
