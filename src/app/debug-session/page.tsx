"use client";

import { useSession } from "next-auth/react";
import { getRole, hasAnyRole } from "@/lib/auth/roles";
import { useEffect, useState } from "react";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const userRole = session?.user ? getRole(session.user as any) : "none";
  const hasAdminAccess = session?.user ? hasAnyRole(session.user as any, ["admin"]) : false;
  const hasVendorAccess = session?.user ? hasAnyRole(session.user as any, ["vendor"]) : false;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug Information</h1>
        
        <div className="grid gap-6">
          {/* Session Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Session Status</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Has Session:</strong> {session ? "Yes" : "No"}</p>
              <p><strong>User ID:</strong> {session?.user?.id || "None"}</p>
              <p><strong>User Email:</strong> {session?.user?.email || "None"}</p>
            </div>
          </div>

          {/* Role Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Role Information</h2>
            <div className="space-y-2">
              <p><strong>Detected Role:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userRole}</span></p>
              <p><strong>Has Admin Access:</strong> <span className={hasAdminAccess ? "text-green-600" : "text-red-600"}>{hasAdminAccess ? "Yes" : "No"}</span></p>
              <p><strong>Has Vendor Access:</strong> <span className={hasVendorAccess ? "text-green-600" : "text-red-600"}>{hasVendorAccess ? "Yes" : "No"}</span></p>
            </div>
          </div>

          {/* Raw Session Data */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Session Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/dashboard"
                className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Go to Dashboard
              </a>
              <a
                href="/dashboard/admin"
                className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Go to Admin Dashboard
              </a>
              <a
                href="/dashboard/vendor"
                className="block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Go to Vendor Dashboard
              </a>
              <button
                onClick={() => window.location.reload()}
                className="block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
