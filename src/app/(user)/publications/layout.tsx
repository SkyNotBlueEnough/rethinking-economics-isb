export default function PublicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen w-full bg-background">{children}</div>;
}
