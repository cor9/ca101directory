import { RegisterForm } from "@/components/auth/register-form";
import { Suspense } from "react";

const RegisterPage = () => {
  // return ( 
  //   <RegisterForm />
  // );
  return (
    // <div>Loading...</div>
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
 
export default RegisterPage;