const AuthLayout = ({ 
    children
  }: { 
    children: React.ReactNode
  }) => {
    
    return ( 
      //  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-400 to-orange-800
      <div className="h-full flex items-center justify-center">
        {children}
      </div>
     );
  }
   
  export default AuthLayout;