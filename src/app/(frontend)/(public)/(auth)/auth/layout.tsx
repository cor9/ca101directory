import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const AuthLayout = ({ 
    children
  }: { 
    children: React.ReactNode
  }) => {
    // min-h-screen 
    return ( 
      <MaxWidthWrapper className="flex items-center justify-center p-16">
        {children}
      </MaxWidthWrapper>
     );
  }
   
  export default AuthLayout;