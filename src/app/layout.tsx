import "./globals.css";

export const metadata = {
  title: "MatrixAI Engine",
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