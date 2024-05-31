import Image from "next/image";
import HomeBgdDot from "@/components/TopAnimation";
import Wallet from "@/components/Wallet";

export default function Home() {
  return (
    <main className="w-full h-screen flex flex-col">
      <div className="relative w-full h-48 flex-none">
        <div className="absolute w-full h-96 -top-24 z-10">
          <HomeBgdDot />
        </div>
        <div className="absolute z-20 top-20 -translate-y-2 w-full flex justify-center">
          <Image src="/assets/cyberpay-title.png" height={48} width={208} alt="CyberPay" />
        </div>
      </div>
      <div className="relative w-full flex-auto bg-white rounded-t-[64px] pt-24 z-50">
        <Wallet />
      </div>
    </main>
  );
}
