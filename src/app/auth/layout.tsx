import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication Guard",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
