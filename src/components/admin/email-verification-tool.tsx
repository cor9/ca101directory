"use client";

import { adminVerifyEmail } from "@/actions/admin-verify-email";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons/icons";
import { useState } from "react";
import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";

export function EmailVerificationTool() {
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const handleVerify = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }

    setError(undefined);
    setSuccess(undefined);
    setIsVerifying(true);

    try {
      const result = await adminVerifyEmail(email);
      if (result.status === "success") {
        setSuccess(result.message);
        setEmail("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📧 Manual Email Verification</CardTitle>
        <CardDescription>
          Manually verify user emails when confirmation emails fail or expire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isVerifying}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleVerify();
              }
            }}
          />
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !email}
            className="btn-primary"
          >
            {isVerifying ? (
              <Icons.spinner className="w-4 h-4 animate-spin" />
            ) : (
              "Verify Email"
            )}
          </Button>
        </div>

        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p className="font-semibold mb-1">When to use this tool:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>User reports they never received confirmation email</li>
            <li>Confirmation link expired (24 hours)</li>
            <li>Email service issues blocking delivery</li>
            <li>User needs immediate access to claim their listing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

