import React, { createContext, useMemo } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import WalletContextProvider from "./WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MemeTree Demo",
  description: "MemeTree Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          <Toaster position="top-right" />
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
