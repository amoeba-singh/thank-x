"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAbstraxionAccount, useAbstraxionClient } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import { FaArrowRight, FaPlus, FaUsers, FaShareAlt, FaCoins } from "react-icons/fa";

const CONTRACT_ADDRESS = "xion1xvm6ygdt70j6sety9zfaq8yhmljp2pk9ane6jsegknrjr5pq6e8qhz568f";

export default function Home() {
  const { data: account } = useAbstraxionAccount();
  const { client: queryClient } = useAbstraxionClient();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      if (!queryClient) return;

      try {
        setIsLoading(true);
        const res = await queryClient.queryContractSmart(CONTRACT_ADDRESS, {
          list_profiles: { limit: 6 }
        });

        if (res.profiles) {
          setProfiles(res.profiles);
        }
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [queryClient]);

  return (
    <div className="min-h-screen">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 -left-12 w-60 h-60 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block mb-8 animate-pulse-glow">
            <div className=" text-white p-3 skewed-border rotate-3 transform hover:rotate-6 transition-all duration-300">
            <img src="/logo.png" alt="Logo" className="h-12 w-12" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
            Empower the Creators You Admire through {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              ThankX
            </span>
          </h1>

          <p className="text-xl mb-12 max-w-3xl mx-auto text-gray-300">
            A Web3 tipping platform for creators, powered by the XION blockchain — gasless, effortless, and decentralized.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/discover">
              <button className="group relative overflow-hidden rounded-full bg-indigo-600 px-8 py-4 text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95">
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <span className="relative z-10 flex items-center">
                  Browse Creators
                  <FaArrowRight className="ml-2" />
                </span>
              </button>
            </Link>

            {account?.bech32Address ? (
              <Link href="/profile">
                <button className="group relative overflow-hidden rounded-full bg-[#1d293e] px-8 py-4 text-white transition-all hover:bg-[#252f44] active:scale-95 border border-indigo-500/30">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                  <span className="relative z-10">My Dashboard</span>
                </button>
              </Link>
            ) : (
              <Link href="/create-profile">
                <button className="group relative overflow-hidden rounded-full bg-[#1d293e] px-8 py-4 text-white transition-all hover:bg-[#252f44] active:scale-95 border border-indigo-500/30">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-500 rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                  <span className="relative z-10 flex items-center">
                    <FaPlus className="mr-2" />
                    Launch Your Profile
                  </span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
      {/* Further sections continue similarly */}
    </div>
  );
}
