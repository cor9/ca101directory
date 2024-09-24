import { ResetForm } from "@/components/auth/reset-form";
import { Suspense } from "react";

const ResetPage = () => {
  // return ( 
  //   <ResetForm />
  // );
  return (
    // <div>Loading...</div>
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}
 
export default ResetPage;