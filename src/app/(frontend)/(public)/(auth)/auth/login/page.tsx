import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

const LoginPage = () => {
  // return ( 
  //   <LoginForm />
  // );
  return (
    // <div>Loading...</div>
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
 
export default LoginPage;