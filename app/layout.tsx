import Header from "../components/header";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen transition-colors duration-300">
        {/* <Header /> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
