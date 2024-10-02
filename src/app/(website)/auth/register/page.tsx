import { RegisterForm } from "@/components/auth/register-form";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Register",
  description: "Create an account to get started",
});

const RegisterPage = () => {
  return (
      <RegisterForm />
  );
}
 
export default RegisterPage;