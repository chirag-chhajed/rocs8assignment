import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import { ReduxProvider } from "@/store/StoreProvider";
import { Toaster } from "sonner";
import { CSPostHogProvider } from "@/provider/Providers";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ECOMMERECE",
  description:
    "A simple sign-up and login flow for an e-commerce site where users are able to mark the categories they are interested in.",
};

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CSPostHogProvider>
      <ReduxProvider>
        <AuthProvider>
          <html lang="en">
            <body className={inter.className}>
              {children}
              <Toaster richColors duration={3000} />
              <PostHogPageView />
            </body>
          </html>
        </AuthProvider>
      </ReduxProvider>
    </CSPostHogProvider>
  );
}
