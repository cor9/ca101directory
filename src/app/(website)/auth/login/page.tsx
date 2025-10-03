"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useSearchParams } from "next/navigation";

const LoginPageClient = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as "parent" | "vendor" | null;
  
  return <LoginForm className="border-none" defaultRole={role || undefined} />;
};

export default LoginPageClient;