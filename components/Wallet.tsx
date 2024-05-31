'use client'

import LoginButton from "./LoginButton";
import usePasskey from "@/hooks/usePasskeyTx";

export default function Wallet() {

  const { authInfo } = usePasskey();

  return (
    <div className="h-full flex flex-col pb-12 px-3 gap-8 items-center">
      {authInfo ? (
        <div>
          { authInfo.aa }
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}