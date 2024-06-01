'use client'

import HomeBgdDot from "@/components/TopAnimation";
import Wallet from "@/components/Wallet";
import { useAtomValue } from "jotai";
import { passkeyAtom } from "@/atoms";

export default function Home() {

  const authInfo = useAtomValue(passkeyAtom)
  const isLoggedIn = Boolean(authInfo);

  return (
    <main className="w-full h-screen relative overflow-hidden">
      <div 
        className={
          "absolute left-0 right-0 top-0 overflow-hidden transition-all duration-700 flex justify-center items-center " + 
          (isLoggedIn ? "scale-100 h-72" : "scale-125 h-[calc(100vh-300px)]")
        }
      >
        <HomeBgdDot />
      </div>
      <div className={
        "absolute left-0 bottom-0 right-0 transition-all duration-700 bg-white rounded-t-[48px] z-[9999] " + 
        (isLoggedIn ? "h-[calc(100vh-288px)]" : "h-80")
      }>
        <Wallet />
      </div>
    </main>
  );
}
