"use client";

import { useRouter } from "next/navigation";
import { resendConfirmationEmail } from "@/actions/resend-confirmation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ClaimErrorProps {
  error: {
    success: false;
    error: string;
    title: string;
    message: string;
    action?: string;
    hint?: string;
    details?: string;
    redirectTo?: string;
    showLoginButton?: boolean;
    showResendButton?: boolean;
    showDashboardButton?: boolean;
    userEmail?: string;
  };
}

export function ClaimErrorDisplay({ error }: ClaimErrorProps) {
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResend = async () => {
    if (!error.userEmail) return;
    
    setResending(true);
    setResendMessage("");
    
    try {
      const result = await resendConfirmationEmail(error.userEmail);
      
      if (result.success) {
        setResendMessage("✅ Confirmation email sent! Check your inbox.");
      } else {
        setResendMessage("❌ Failed to resend. Please contact support.");
      }
    } catch (err) {
      setResendMessage("❌ Something went wrong. Please contact support.");
    } finally {
      setResending(false);
    }
  };

  // Error icon mapping
  const getErrorIcon = () => {
    switch (error.error) {
      case "AUTH_REQUIRED":
        return "🔐";
      case "EMAIL_NOT_CONFIRMED":
        return "📧";
      case "WRONG_ROLE":
        return "👤";
      case "ALREADY_CLAIMED":
      case "ALREADY_OWN":
        return "✅";
      case "LISTING_NOT_FOUND":
        return "🔍";
      case "NO_PROFILE":
      case "UPDATE_FAILED":
      case "UNEXPECTED_ERROR":
        return "⚠️";
      default:
        return "❌";
    }
  };

  // Error color mapping
  const getErrorColor = () => {
    switch (error.error) {
      case "ALREADY_OWN":
        return "blue"; // Informational
      case "AUTH_REQUIRED":
      case "EMAIL_NOT_CONFIRMED":
        return "yellow"; // Warning - action needed
      case "WRONG_ROLE":
      case "ALREADY_CLAIMED":
        return "orange"; // Important but not critical
      default:
        return "red"; // Error
    }
  };

  const color = getErrorColor();
  const colorClasses = {
    blue: "bg-blue-50 border-blue-400 text-blue-900",
    yellow: "bg-yellow-50 border-yellow-400 text-yellow-900",
    orange: "bg-orange-50 border-orange-400 text-orange-900",
    red: "bg-red-50 border-red-400 text-red-900",
  };

  const buttonClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${colorClasses[color]}`}>
      {/* Header */}
      <div className="flex items-start mb-4">
        <span className="text-4xl mr-4">{getErrorIcon()}</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{error.title}</h3>
          <p className="text-base mb-3">{error.message}</p>
          
          {error.action && (
            <p className="text-sm font-medium mb-2">{error.action}</p>
          )}
          
          {error.hint && (
            <p className="text-sm italic opacity-80">{error.hint}</p>
          )}
        </div>
      </div>

      {/* Resend confirmation message */}
      {resendMessage && (
        <div className={`mb-4 p-3 rounded ${
          resendMessage.includes("✅")
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {resendMessage}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {error.showLoginButton && (
          <>
            <Button
              onClick={() => router.push(error.redirectTo || "/auth/login")}
              className={`flex-1 ${buttonClasses[color]} text-white`}
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/auth/register")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
            >
              Create Account
            </Button>
          </>
        )}

        {error.showResendButton && (
          <Button
            onClick={handleResend}
            disabled={resending}
            className={`flex-1 ${buttonClasses[color]} text-white`}
          >
            {resending ? "Sending..." : "📧 Resend Confirmation Email"}
          </Button>
        )}

        {error.showDashboardButton && (
          <Button
            onClick={() => router.push("/dashboard/vendor/listing")}
            className={`flex-1 ${buttonClasses[color]} text-white`}
          >
            Go to Dashboard
          </Button>
        )}

        {error.redirectTo && !error.showLoginButton && !error.showDashboardButton && (
          <Button
            onClick={() => router.push(error.redirectTo!)}
            className={`flex-1 ${buttonClasses[color]} text-white`}
          >
            Continue
          </Button>
        )}
      </div>

      {/* Support contact - always show for errors */}
      {color === "red" && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-sm text-center">
            Need help?{" "}
            <a
              href="mailto:support@childactor101.com"
              className="font-bold underline hover:opacity-80"
            >
              Contact Support
            </a>
          </p>
        </div>
      )}

      {/* Debug details (only in development) */}
      {process.env.NODE_ENV === "development" && error.details && (
        <details className="mt-4 text-xs opacity-60">
          <summary className="cursor-pointer font-mono">Debug Info</summary>
          <pre className="mt-2 p-2 bg-black/10 rounded overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

// Success display component (for consistency)
interface ClaimSuccessProps {
  success: {
    success: true;
    title: string;
    message: string;
    details?: string;
    redirectTo?: string;
    listingId?: string;
  };
}

export function ClaimSuccessDisplay({ success }: ClaimSuccessProps) {
  const router = useRouter();

  return (
    <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
      <div className="flex items-start mb-4">
        <span className="text-4xl mr-4">🎉</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-green-900 mb-2">
            {success.title}
          </h3>
          <p className="text-base text-green-800 mb-3">
            {success.message}
          </p>
          {success.details && (
            <p className="text-sm text-green-700">
              {success.details}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => router.push(success.redirectTo || "/dashboard/vendor/listing")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          Go to Dashboard
        </Button>
        {success.listingId && (
          <Button
            onClick={() => router.push(`/listing/${success.listingId}`)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
          >
            View Listing
          </Button>
        )}
      </div>
    </div>
  );
}

