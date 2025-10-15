"use client";

import { useSession } from "next-auth/react";
import { getRole } from "@/lib/auth/roles";
import { useEffect, useState } from "react";

export default function DebugRolePage() {
  const { data: session, status } = useSession();
  const [dbRole, setDbRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRoleFromDB = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/debug-user-role?userId=${session.user.id}`);
      const data = await response.json();
      setDbRole(data.role || "not found");
    } catch (error) {
      console.error("Error fetching role from DB:", error);
      setDbRole("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchRoleFromDB();
    }
  }, [session?.user?.id]);

  const userRole = session?.user ? getRole(session.user as any) : "none";

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Role Debug Information</h1>
        
        <div className="grid gap-6">
          {/* Session Role vs DB Role */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Role Comparison</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold text-blue-800">Session Role</h3>
                  <p className="text-2xl font-mono text-blue-600">{userRole}</p>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <h3 className="font-semibold text-green-800">Database Role</h3>
                  <p className="text-2xl font-mono text-green-600">
                    {loading ? "Loading..." : dbRole || "Not fetched"}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded">
                <h3 className="font-semibold text-yellow-800">Match Status</h3>
                <p className={`text-lg ${userRole === dbRole ? "text-green-600" : "text-red-600"}`}>
                  {loading ? "Checking..." : userRole === dbRole ? "✅ Match" : "❌ Mismatch"}
                </p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{session?.user?.id || "None"}</code></p>
              <p><strong>Email:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{session?.user?.email || "None"}</code></p>
              <p><strong>Session Status:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{status}</code></p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={fetchRoleFromDB}
                disabled={loading || !session?.user?.id}
                className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh DB Role"}
              </button>
              <a
                href="/dashboard"
                className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Try Dashboard Redirect
              </a>
              <a
                href="/dashboard/admin"
                className="block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
              >
                Go Directly to Admin Dashboard
              </a>
            </div>
          </div>

          {/* Raw Session Data */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Session Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
