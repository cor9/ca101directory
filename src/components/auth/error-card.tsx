import { AuthCard } from "@/components/auth/auth-card";
import { TriangleAlert } from "lucide-react";

export const ErrorCard = () => {
  return (
    <AuthCard
      headerLabel="Oops! Something went wrong!"
      bottomButtonHref="/auth/login"
      bottomButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
      <TriangleAlert className="text-destructive" />
      </div>
    </AuthCard>
  );
};