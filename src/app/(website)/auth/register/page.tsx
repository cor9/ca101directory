import { RegisterForm } from "@/components/auth/register-form";

const RegisterPage = () => {
  if (1===1) {
    throw new Error("Test error to trigger error page.");
  }

  return (
      <RegisterForm />
  );
}
 
export default RegisterPage;