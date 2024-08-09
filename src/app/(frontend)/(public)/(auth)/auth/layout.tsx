import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const AuthLayout = ({ 
    children
  }: { 
    children: React.ReactNode
  }) => {
    
    return ( 
      <MaxWidthWrapper className="min-h-screen flex items-center justify-center">
        {children}
      </MaxWidthWrapper>
     );
  }
   
  export default AuthLayout;