import { NewPasswordForm } from "@/components/auth/new-password-form";
import { Suspense } from "react";

const NewPasswordPage = () => {
  // return ( 
  //   <NewPasswordForm />
  //  );
  return (
    // <div>Loading...</div>
    <Suspense fallback={null}>
      <NewPasswordForm />
    </Suspense>
  );
}

export default NewPasswordPage;