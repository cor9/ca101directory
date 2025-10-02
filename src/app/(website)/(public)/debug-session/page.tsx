"use client";

import { useSession } from "next-auth/react";
import { getRole } from "@/lib/auth/roles";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>No session found</div>;
  }

  const userRole = getRole(session.user as any);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session Status:</h2>
          <p>{status}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">User Object:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session.user, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">User Role:</h2>
          <p className="font-mono">{userRole}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Role Check:</h2>
          <p>Has role: {session.user?.role || "undefined"}</p>
          <p>Role type: {typeof session.user?.role}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Full Session:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
