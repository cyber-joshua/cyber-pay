import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full h-20 flex items-center justify-center">
      <Image className="" src="/assets/cyberpay-title.png" height={48} width={208} alt="CyberPay" />
    </div>
  )
}