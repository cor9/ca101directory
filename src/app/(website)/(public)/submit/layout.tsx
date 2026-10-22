export default function SubmitLayout({
  children,
}: { children: React.ReactNode }) {
  // Each submit page owns its own hero and surfaces.
  return <>{children}</>;
}
