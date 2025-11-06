"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { resendConfirmationEmail } from "@/actions/resend-confirmation";

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your email";
  
  const [countdown, setCountdown] = useState(30);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/auth/login");
    }
  }, [countdown, router]);

  const handleResend = async () => {
    setResending(true);
    setResendMessage("");
    
    try {
      const result = await resendConfirmationEmail(email);
      
      if (result.success) {
        setResendMessage("✅ Magic link email sent! Check your inbox.");
      } else {
        setResendMessage("❌ " + result.error);
      }
    } catch (error) {
      setResendMessage("❌ Failed to resend. Please contact support.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-charcoal to-navy-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* GIANT eye-catching box with animated gradient border */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-1 rounded-2xl animate-pulse">
          <div className="bg-white p-8 md:p-12 rounded-2xl">
            
            {/* Header with giant checkmark */}
            <div className="text-center mb-8">
              <div className="text-7xl mb-4 animate-bounce">✅</div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
                Account Created!
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-orange-600 mb-2">
                ⚡ CHECK YOUR EMAIL RIGHT NOW! ⚡
              </h2>
              <p className="text-paper">
                Click the magic link to sign in
              </p>
            </div>

            {/* Email confirmation box */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400 p-6 md:p-8 rounded-xl mb-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-3">📧</span>
                <p className="text-lg md:text-xl font-semibold text-paper">
                  Magic link email sent to:
                </p>
              </div>
              
              <p className="text-xl md:text-2xl font-bold text-center mb-6 text-orange-600 break-all">
                {email}
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow-inner mb-4">
                <p className="font-bold text-paper mb-3 text-lg">
                  📝 What to do next:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-paper">
                  <li className="font-medium">Open your email inbox RIGHT NOW</li>
                  <li className="font-medium">Look for email from "Child Actor 101 Directory"</li>
                  <li className="font-medium">Click the magic link button to sign in instantly</li>
                  <li className="font-medium">You'll be logged in automatically!</li>
                </ol>
              </div>

              <div className="bg-orange-100 border-2 border-orange-300 p-4 rounded-lg">
                <p className="font-bold text-orange-900 text-center">
                  ⏱️ The magic link expires in 7 days
                </p>
              </div>
            </div>

            {/* Troubleshooting section */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 border-2 border-gray-300 p-5 rounded-lg">
                <p className="font-bold text-paper mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔍</span>
                  Can't find the email?
                </p>
                <ul className="space-y-2 text-paper ml-8">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Check SPAM/JUNK folder</strong> - Sometimes it ends up there</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Wait 2-3 minutes</strong> - Email delivery can be delayed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Check promotions tab</strong> (Gmail) - It might be filtered</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Verify email address</strong> - Make sure you entered it correctly</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Resend message */}
            {resendMessage && (
              <div className={`p-4 rounded-lg mb-4 text-center font-semibold ${
                resendMessage.includes("✅") 
                  ? "bg-green-100 text-green-800 border-2 border-green-400" 
                  : "bg-red-100 text-red-800 border-2 border-red-400"
              }`}>
                {resendMessage}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button 
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>📧 Resend Magic Link Email</>
                )}
              </button>
              
              <button 
                className="flex-1 bg-gray-200 text-paper px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition-all shadow-lg"
                onClick={() => router.push("/auth/login")}
              >
                Go to Login →
              </button>
            </div>

            {/* Help section */}
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="text-center">
                <p className="text-paper mb-2">
                  <strong>Still having trouble?</strong>
                </p>
                <p className="text-sm text-paper">
                  Email us at{" "}
                  <a 
                    href="mailto:support@childactor101.com" 
                    className="text-orange-600 font-bold hover:text-orange-700 underline"
                  >
                    support@childactor101.com
                  </a>
                </p>
                <p className="text-xs text-paper mt-2">
                  Include your email address and we'll help you get set up
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-redirect notice */}
        <div className="mt-6 text-center">
          <p className="text-white text-sm bg-navy-900/80 px-6 py-3 rounded-full inline-block shadow-lg">
            This page will redirect to login in{" "}
            <span className="font-bold text-orange-400 text-lg">{countdown}</span>{" "}
            seconds...
          </p>
        </div>

        {/* Additional help cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
            <p className="font-bold mb-2">🎬 What happens after?</p>
            <p className="text-sm">
              Click the magic link in your email to sign in instantly. Then you can access your dashboard, claim listings, and manage your profile.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
            <p className="font-bold mb-2">⚡ Already clicked the link?</p>
            <p className="text-sm">
              If you already clicked your magic link, you should be signed in! If not, click "Go to Login" and request a new magic link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

