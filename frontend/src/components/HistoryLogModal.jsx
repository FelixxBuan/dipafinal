import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";

export default function HistoryLogModal({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);

  // Format timestamp in PH timezone
  const formatPHDate = (utcDate) => {
    if (!utcDate) return "-";
    const date = new Date(utcDate);
    return date.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/history-log", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.user);
      setLogs(data.logs);
    } catch (err) {
      console.error("Failed to fetch history log:", err);
    }
  };

  const clearHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("Are you sure you want to clear your history?")) return;

    try {
      const res = await fetch("http://localhost:8000/clear-history", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to clear history");

      // Refresh logs after deletion
      setLogs([]);
      alert("History cleared successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex justify-center items-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative bg-[#0a1733]/80 backdrop-blur-2xl border border-blue-400/20 rounded-2xl w-full max-w-2xl p-6 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-red-400 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">History Log</h2>

        {user && (
          <div className="mb-4">
            <p><strong>Name:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Account Created:</strong> {formatPHDate(user.created_at)}</p>
          </div>
        )}

        <div className="flex justify-end mb-2">
          <button
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold"
            onClick={clearHistory}
          >
            <Trash2 size={16} /> Clear History
          </button>
        </div>

        <div className="overflow-y-auto max-h-80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-400/50">
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-white/70">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={index}
                    className={`border-b border-blue-400/30 ${
                      index % 2 === 0 ? "bg-blue-900/20" : "bg-blue-900/10"
                    }`}
                  >
                    <td className="py-2 px-3 capitalize">{log.action}</td>
                    <td className="py-2 px-3">{formatPHDate(log.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
