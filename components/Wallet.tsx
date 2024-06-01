'use client'

import LoginButton from "./LoginButton";
import usePasskey from "@/hooks/usePasskeyTx";
import { Button } from "./ui/button";
import { useSetAtom } from "jotai";
import { passkeyAtom } from "@/atoms";

export default function Wallet() {

  const { authInfo } = usePasskey();
  const setPasskeyAtom = useSetAtom(passkeyAtom);

  return (
    <div className="h-full flex flex-col px-3 gap-8 items-center">
      {authInfo ? (
        <div>
          { authInfo.aa }
          <Button
            onClick={() => {
              setPasskeyAtom(undefined)
            }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}