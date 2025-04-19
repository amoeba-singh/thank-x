"use client";
import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/ui/dist/index.css";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-space',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} bg-[#0a0e17] text-gray-100`}>
        <AbstraxionProvider
          config={{
            treasury:process.env.NEXT_PUBLIC_TRESURY_CONTRACT_ADDRESS,
            gasPrice: "0.01uxion",
            rpcUrl: "https://rpc.xion-testnet-2.burnt.com:443",
            restUrl: "https://api.xion-testnet-2.burnt.com:443",
          }}
        >
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <footer className="py-6 border-t border-[#1d293e] mt-12">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className=" text-white p-2 rounded-xl rotate-3 transform mr-3">
                      <img src="/logo.png" alt="Logo" className="h-8 w-8" />

                      </div>
                      <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">ThankX</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      © {new Date().getFullYear()} ThankX
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </Providers>
        </AbstraxionProvider>
      </body>
    </html>
  );
}
