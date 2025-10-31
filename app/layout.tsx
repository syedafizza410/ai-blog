import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen transition-colors duration-300">
        <main>{children}</main>
      </body>
    </html>
  );
}
