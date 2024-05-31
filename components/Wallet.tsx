'use client'

import Image from "next/image"
import LoginButton from "./LoginButton"

export default function Wallet() {
  return (
    <div className="h-full flex flex-col pb-12 px-3 gap-8 items-center">
      <Image src="/assets/connect-passkey-black.png" alt="Connect" height={48} width={320} />
      <LoginButton />
    </div>
  )
}