'use client'

import LoginButton from "./LoginButton";
import usePasskey from "@/hooks/usePasskeyTx";
import { Button } from "./ui/button";
import { useSetAtom } from "jotai";
import { passkeyAtom } from "@/atoms";
import { Copy, SquareCheck } from "lucide-react";
import Image from "next/image";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useState } from "react";

export default function Wallet() {

  const { authInfo, balance } = usePasskey();
  const setPasskeyAtom = useSetAtom(passkeyAtom);
  const aa = authInfo?.aa;
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative h-full flex flex-col px-3 gap-8 items-center">
      {authInfo ? (
        <>
          <Image 
            src="/assets/avatar.png" 
            alt="Account" 
            width={100} 
            height={100} 
            className="absolute -top-12"
          />
          <CopyToClipboard text={aa!}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 800)
          }}>
          <div 
            className="font-semibold text-lg mt-16 flex items-center gap-2"
          >
          <div>{ `${aa!.slice(0,6)}...${aa!.slice(aa!.length-5)}` }</div>
          {copied ? <SquareCheck className="text-green-500" size={18} /> : <Copy className="text-grey-500" size={18} />}
          </div>
          </CopyToClipboard>
          <Button
            onClick={() => {
              setPasskeyAtom(undefined)
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}