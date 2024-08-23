import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

// TODO: remove Suspense???
// https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/app/auth/login/page.tsx
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