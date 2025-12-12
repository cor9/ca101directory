"use client";

import { switchUserRole } from "@/actions/switch-role";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

/**
 * Role switch form - Fixes Bug #2
 * Allows users to switch between Parent and Vendor roles
 */
export function RoleSwitchForm() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<"parent" | "vendor">(
    (session?.user as any)?.role || "parent",
  );

  const currentRole = (session?.user as any)?.role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === currentRole) {
      toast.error("You're already using this account type");
      return;
    }

    startTransition(async () => {
      const result = await switchUserRole(selectedRole);

      if (result.success) {
        toast.success("Account Type Changed!", {
          description: result.message,
          duration: 5000,
        });

        // Update session
        await updateSession();

        // Redirect to appropriate dashboard
        setTimeout(() => {
          if (selectedRole === "vendor") {
            router.push("/dashboard/vendor");
          } else {
            router.push("/dashboard/parent");
          }
        }, 1500);
      } else {
        toast.error("Failed to Change Account Type", {
          description: result.message,
        });
      }
    });
  };

  // Don't show for admins
  if (currentRole === "admin") {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-ink mb-2">Account Type</h3>
        <p className="text-sm text-ink/70 mb-4">
          Choose whether you're a parent looking for services or a professional
          offering services. You can change this anytime.
        </p>
      </div>

      <RadioGroup
        value={selectedRole}
        onValueChange={(value) => setSelectedRole(value as "parent" | "vendor")}
        className="space-y-4"
      >
        <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-surface/50 transition-colors">
          <RadioGroupItem value="parent" id="parent" className="mt-1" />
          <Label htmlFor="parent" className="flex-1 cursor-pointer">
            <div className="font-semibold text-ink mb-1">
              Parent / Legal Guardian
            </div>
            <div className="text-sm text-ink/70">
              Browse and review services for your child actor. Save favorites,
              write reviews, and connect with professionals.
            </div>
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-surface/50 transition-colors">
          <RadioGroupItem value="vendor" id="vendor" className="mt-1" />
          <Label htmlFor="vendor" className="flex-1 cursor-pointer">
            <div className="font-semibold text-ink mb-1">
              Professional / Vendor
            </div>
            <div className="text-sm text-ink/70">
              Manage your business listing, claim existing listings, respond to
              inquiries, and showcase your services.
            </div>
          </Label>
        </div>
      </RadioGroup>

      {selectedRole !== currentRole && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Note:</strong> Changing your account type will redirect you
            to the appropriate dashboard. You'll need to log out and log back in
            for all changes to take full effect.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || selectedRole === currentRole}
        className="w-full"
      >
        {isPending
          ? "Updating..."
          : selectedRole === currentRole
            ? "Current Account Type"
            : "Change Account Type"}
      </Button>
    </form>
  );
}
