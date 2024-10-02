import { LoginForm } from "@/components/auth/login-form";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Login",
  description: "Login to your account",
});

const LoginPage = () => {
  return (
      <LoginForm className="border-none" />
  );
}

export default LoginPage;