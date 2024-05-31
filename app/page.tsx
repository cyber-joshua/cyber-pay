'use client'

import Image from "next/image";
import HomeBgdDot from "@/components/TopAnimation";
import Wallet from "@/components/Wallet";
import { useAtomValue } from "jotai";
import { passkeyAtom } from "@/atoms";

export default function Home() {

  const authInfo = useAtomValue(passkeyAtom)
  const isLoggedIn = Boolean(authInfo);

  return (
    <main className="w-full h-screen flex flex-col">
      <div className={"relative overflow-x-hidden w-full transition-all duration-500 flex-none " + (isLoggedIn ? "h-48" : "h-[calc(100vh-360px)]")}>
        <div className={
          "absolute w-full transition-all top-0 h-96 z-10 " + 
          (isLoggedIn ? '-translate-y-24': 'translate-y-16')
        }>
          <HomeBgdDot />
        </div>
        <div 
          className={
            "absolute z-20 top-0 w-full flex justify-center " +
            (isLoggedIn ? 'translate-y-[72px] scale-100' : 'translate-y-[233px] scale-150')
        }>
          <Image src="/assets/cyberpay-title.png" height={48} width={208} alt="CyberPay" />
        </div>
      </div>
      <div className="relative w-full flex-auto bg-white rounded-t-[48px] pt-12 z-50">
        <Wallet />
      </div>
    </main>
  );
}
