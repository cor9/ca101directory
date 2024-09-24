import BackButtonSmall from "@/components/shared/back-button-small";
import Image from "next/image";

/**
 * https://ui.shadcn.com/blocks#authentication-04
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center py-12 relative">
          <BackButtonSmall className="absolute top-6 left-6" />
          {children}
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src="/icon-512-maskable.png"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}