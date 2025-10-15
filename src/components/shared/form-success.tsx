import { CircleCheckIcon } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  // Check if this is an email confirmation message
  const isEmailConfirmation = message.includes("check your email") || message.includes("📧");

  if (isEmailConfirmation) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-6 rounded-lg border-2 border-emerald-500 shadow-lg animate-pulse-slow">
        <div className="flex flex-col items-center text-center gap-4">
          <CircleCheckIcon className="h-12 w-12 text-emerald-600" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-emerald-700">
              Account Created Successfully! 🎉
            </h3>
            <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-md">
              <p className="text-base font-bold text-yellow-900 mb-2">
                📧 IMPORTANT: Check Your Email Now!
              </p>
              <p className="text-sm text-yellow-800">
                We sent a confirmation link to your email address.
                <br />
                <strong>You MUST click the link to activate your account.</strong>
              </p>
            </div>
            <p className="text-sm text-gray-900">
              ⚠️ Check your spam/junk folder if you don't see it within 2 minutes.
            </p>
            <p className="text-xs text-gray-900">
              Redirecting to login page in 8 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Regular success message
  return (
    <div className="bg-emerald-500/15 p-4 rounded-md border border-emerald-500/30">
      <div className="flex items-start gap-x-3">
        <CircleCheckIcon className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-emerald-700">
          {message.split("\n").map((line, index) => (
            <p
              key={`message-line-${index}-${line.substring(0, 10)}`}
              className={line.trim() === "" ? "mb-2" : "mb-1"}
            >
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
