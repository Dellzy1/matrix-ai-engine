import { APP_NAME } from "@/lib/appConfig";
import "./globals.css";

export const metadata = {
   title: APP_NAME,
  description: "Decision Intelligence & Review Loop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}