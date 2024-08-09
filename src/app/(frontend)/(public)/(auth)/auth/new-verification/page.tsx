import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

const NewVerificationPage = () => {
  // return ( 
  //   <NewVerificationForm />
  //  );
  return (
    // <div>Loading...</div>
    <Suspense fallback={null}>
      <NewVerificationForm />
    </Suspense>
  );
}

export default NewVerificationPage;