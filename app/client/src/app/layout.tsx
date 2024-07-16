import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import { ReduxProvider } from "@/store/StoreProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Toaster richColors />
          </body>
        </html>
      </AuthProvider>
    </ReduxProvider>
  );
}
