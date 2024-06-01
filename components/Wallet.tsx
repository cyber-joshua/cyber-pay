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
import useAssets from "@/hooks/useAssets";
import { formatUnits } from "viem";

interface Asset {
  balance: string;
cmcUsdPrice: string;
contract: string;
decimals: number;
imageUrl: string;
name: string;
symbol: string;
usdPrice: string;
}

export default function Wallet() {

  const { authInfo, balance } = usePasskey();
  const setPasskeyAtom = useSetAtom(passkeyAtom);
  const aa = authInfo?.aa;
  const [copied, setCopied] = useState(false);
  const { data: assetsData } = useAssets();

  const assets = assetsData?.me.tokens as Asset[];
  const totalUsd = assets?.reduce((partialSum, a) => partialSum + parseFloat(a.usdPrice), 0);

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
          <div className=" flex flex-col items-center gap-1">
            <CopyToClipboard text={aa!}
            onCopy={() => {
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 800)
            }}>
            <div 
              className="font-semibold text-lg mt-16 flex items-center gap-2 text-gray-400"
            >
            <div>{ `${aa!.slice(0,6)}...${aa!.slice(aa!.length-5)}` }</div>
            {copied ? <SquareCheck className="text-green-500" size={18} /> : <Copy size={18} />}
            </div>
            </CopyToClipboard>
            {totalUsd && (
              <div className="text-stroke text-4xl font-extrabold">
                ${ totalUsd.toFixed(2) }
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              setPasskeyAtom(undefined)
            }}
          >
            Logout
          </Button>
          {assets?.map((asset) => <AssetRow key={asset.symbol} token={asset} />)}
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}

function AssetRow({
  token
} : {
  token: Asset
}) {
  return (
    <div className="w-full flex gap-2 items-center px-4">
      <Image className="flex-none" src={token.imageUrl} alt={token.symbol} width={32} height={32} />
      <div className="flex-auto font-semibold">{token.name}</div>
      <div className="flex-none font-semibold flex flex-col gap-0 text-right">
        <div className="w-16 overflow-ellipsis">
          {formatUnits(BigInt(token.balance), token.decimals)}
        </div>
        <div className="text-sm text-gray-600 w-16 overflow-ellipsis text-stroke-thin -mt-1">
          ${parseFloat(token.usdPrice).toFixed(2)}
        </div>
      </div>
    </div>
  )
}