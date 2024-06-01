/* eslint-disable @next/next/no-img-element */
'use client'

import LoginButton from "./LoginButton";
import usePasskey from "@/hooks/usePasskeyTx";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { passkeyAtom, qrAtom } from "@/atoms";
import { Copy, Gift, Send, SquareCheck } from "lucide-react";
import Image from "next/image";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";
import useAssets from "@/hooks/useAssets";
import { Address, Hash, formatUnits, zeroAddress } from "viem";
import CyberButton from "./CyberButton";
import useTransactions from "@/hooks/useTransactions";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { qrcodePrefix } from "@/lib/constants";
import { useToast } from "./ui/use-toast";
import PayDialog from "./PayDialog";

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

interface Tx {
  txHash: Hash;
  chainId: number;
  name: string;
  status: string;
  timestamp: number;
  asset?: [{
    amount: string;
    changeType: string;
    assetType: string;
    toAddress: Address;
    asset: {
      symbol: string;
      imageUrl: string;
    }
  }]
  interactParty?: {
    action: string;
    icon: string;
    address: Address;
  }
}

export default function Wallet() {

  const { authInfo, balance } = usePasskey();
  const [payInfo, setPayInfo] = useAtom(qrAtom);
  const setPasskeyAtom = useSetAtom(passkeyAtom);
  const aa = authInfo?.aa;
  const [copied, setCopied] = useState(false);

  const { data: assetsData } = useAssets();
  const assets = assetsData?.me?.tokens as Asset[];
  const totalUsd = assets?.reduce((partialSum, a) => partialSum + parseFloat(a.usdPrice), 0);

  const { data: txData } = useTransactions();
  const { toast } = useToast();
  const txs = txData?.me?.transactions.list.filter((t: Tx) => Boolean(t.asset?.length)) as Tx[];

  const router = useRouter();

  // useEffect(() => {
  //   setTimeout(() => {
  //     setPayInfo(`cyberpay:卖咖啡的---0x0414DDBf69294B1eE580eEf88862dEa94B726A07---0.01---ETH---${zeroAddress}---${18}`)
  //   }, 3000)
  // }, [])

  return (
    <div className="h-full flex flex-col px-3 gap-12 items-center overflow-y-scroll pb-10">
      {authInfo ? (
        <>
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

          <CyberButton 
            title="Scan qrcode to pay" 
            onClick={() => {
              router.push('/scan');
            }}
          />

          <div className="w-full">
            <div className="font-semibold text-lg text-stroke pl-2 mb-4">
              My Tokens
            </div>
            {assets?.length ? <>
              {assets.map((asset) => <AssetRow key={asset.symbol} token={asset} />)}
            </> : (
              <div className="text-gray-500 w-full text-center">
                No tokens yet
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="font-semibold text-lg text-stroke pl-2 mb-4">
              My Transactions
            </div>
            {txs?.length ? <>
              {txs.map((tx) => <TxRow key={tx.txHash} tx={tx} />)}
            </> : (
              <div className="text-gray-500 w-full text-center">
                No transactions yet
              </div>
            )}
          </div>
          
          <Button variant="outline" onClick={() => { setPasskeyAtom(undefined) }}>
            Logout
          </Button>
        </>
      ) : (
        <LoginButton />
      )}
      <PayDialog />
    </div>
  )
}

function AssetRow({
  token
} : {
  token: Asset
}) {
  return (
    <div className="w-full flex gap-2 items-center px-4 border-b border-b-gray-200 pb-4 mb-4">
      <Image className="flex-none" src={token.imageUrl} alt={token.symbol} width={32} height={32} />
      <div className="flex-auto font-semibold flex flex-col">
        <div>
          {token.symbol}
        </div>
        <div className="text-sm text-gray-400  -mt-1">
          {token.name}
        </div>
      </div>
      <div className="flex-none font-semibold flex flex-col gap-0 text-right">
        <div className="w-24 truncate">
          {parseFloat(formatUnits(BigInt(token.balance), token.decimals)).toFixed(4)}
        </div>
        <div className="w-24 text-sm text-gray-600 overflow-ellipsis text-stroke-thin -mt-1">
          ${parseFloat(token.usdPrice).toFixed(2)}
        </div>
      </div>
    </div>
  )
}


function TxRow({
  tx
} : {
  tx: Tx
}) {

  const index = Math.floor(Math.random() * 5);
  const vendors = ["卖蛋糕的", "卖咖啡的", "卖白菜的", "卖西瓜的", "卖炒面的", "币圈乞讨者"]
  const isReceive = tx.name === 'receive';

  return (
    <div className="w-full flex gap-2 items-center px-4 border-b border-b-gray-200 pb-4 mb-4">
      <div className="flex-none">
        {isReceive ? <Gift className="text-green-500" /> : <Send className="text-red-500" />}
      </div>
      <div className="flex-auto font-semibold flex flex-col">
        <div className="text-sm text-gray-400">
          {isReceive ? 'From' : 'To'}
        </div>
        <div className="max-w-[150px] truncate">
          {isReceive ? '好心人.cyber' : `${vendors[index]}.cyber`}
        </div>
      </div>
      <div className="flex-none font-semibold flex items-center gap-1.5">
        <div className={"max-w-[100px] truncate " + (isReceive ? "text-green-500" : "text-red-500")}>
          {`${isReceive ? '+' : '-'}${parseFloat(tx.asset![0].amount).toFixed(4)}`}
        </div>
        <img src={tx.asset![0].asset.imageUrl} alt={tx.asset![0].asset.symbol} width={16} height={16} />
        <div>
          {tx.asset![0].asset.symbol}
        </div>
      </div>
    </div>
  )
}