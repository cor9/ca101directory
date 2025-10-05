"use client";

import { useSession } from "next-auth/react";
import { getFeatureFlags } from "@/config/feature-flags";
import { getRole, hasAnyRole } from "@/lib/auth/roles";

/**
 * Debug Auth Page - TEMPORARY
 * This page helps diagnose authentication issues in production
 */
export default function DebugAuthPage() {
  const { data: session, status } = useSession();
  const featureFlags = getFeatureFlags();

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  const userRole = session?.user ? getRole(session.user as any) : null;
  const hasAdminRole = session?.user ? hasAnyRole(session.user as any, ["admin"]) : false;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">🔍 Authentication Debug</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold">Session Status</h2>
        <div className="grid gap-2 text-sm">
          <div><strong>Status:</strong> {status}</div>
          <div><strong>Has Session:</strong> {session ? "✅ Yes" : "❌ No"}</div>
          <div><strong>User ID:</strong> {session?.user?.id || "None"}</div>
          <div><strong>User Email:</strong> {session?.user?.email || "None"}</div>
          <div><strong>User Role:</strong> {userRole || "None"}</div>
          <div><strong>Has Admin Role:</strong> {hasAdminRole ? "✅ Yes" : "❌ No"}</div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold">Feature Flags</h2>
        <div className="grid gap-2 text-sm">
          <div><strong>Admin Auth Enabled:</strong> {featureFlags.enableAdminAuth ? "✅ Yes" : "❌ No"}</div>
          <div><strong>Admin Dashboard Enabled:</strong> {featureFlags.enableAdminDashboard ? "✅ Yes" : "❌ No"}</div>
          <div><strong>Vendor Auth Enabled:</strong> {featureFlags.enableVendorAuth ? "✅ Yes" : "❌ No"}</div>
          <div><strong>Parent Auth Enabled:</strong> {featureFlags.enableParentAuth ? "✅ Yes" : "❌ No"}</div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold">Environment Variables</h2>
        <div className="grid gap-2 text-sm">
          <div><strong>NEXT_PUBLIC_DIRECTORY_LITE:</strong> {process.env.NEXT_PUBLIC_DIRECTORY_LITE || "undefined"}</div>
          <div><strong>NEXT_PUBLIC_ENABLE_ADMIN_DASHBOARD:</strong> {process.env.NEXT_PUBLIC_ENABLE_ADMIN_DASHBOARD || "undefined"}</div>
          <div><strong>NEXT_PUBLIC_ENABLE_ADMIN_AUTH:</strong> {process.env.NEXT_PUBLIC_ENABLE_ADMIN_AUTH || "undefined"}</div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold">Raw Session Data</h2>
        <pre className="text-xs overflow-auto bg-white p-2 rounded border">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="bg-red-50 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold">Test Links</h2>
        <div className="space-y-2">
          <div><a href="/auth/login" className="text-blue-600 hover:underline">Login Page</a></div>
          <div><a href="/dashboard" className="text-blue-600 hover:underline">Dashboard (Main Router)</a></div>
          <div><a href="/dashboard/admin" className="text-blue-600 hover:underline">Admin Dashboard</a></div>
          <div><a href="/dashboard/vendor" className="text-blue-600 hover:underline">Vendor Dashboard</a></div>
        </div>
      </div>
    </div>
  );
}
