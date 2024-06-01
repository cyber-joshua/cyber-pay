'use client'

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Address, zeroAddress } from "viem";
import QRCode from "react-qr-code";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

interface SupportedToken {
  symbol: string;
  address: Address;
  decimals: number;
}

const supportedTokens: SupportedToken[] = [
  {
    symbol: 'ETH',
    address: zeroAddress,
    decimals: 18,
  },
  {
    symbol: 'USDC',
    address: '0x1ce0627dc04eaaccaed0b461a8c5b780e35fb218',
    decimals: 6,
  }
]

export default function VendorPage() {

  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [vendorAddress, setVendorAddress] = useState('')
  const {toast} = useToast();
  const [selectedToken, setSelectedToken] = useState<SupportedToken>(supportedTokens[0])

  const [info, setInfo] = useState('');

  const generate = () => {
    if (!vendor || !amount || !vendorAddress) {
      toast({description: 'Please fill in all fields'});
      return;
    }
    setInfo(`cyberpay:${vendor}---${vendorAddress}---${amount}---${selectedToken.symbol}---${selectedToken.address}---${selectedToken.decimals}`)
  }

  return (
    <div className="flex flex-col gap-4 px-3 py-20">
      <Input 
        placeholder="Your vendor name"
        value={vendor}
        onChange={(e) => { setVendor(e.target.value) }}
      />
      <Input 
        placeholder="Your wallet address"
        value={vendorAddress}
        onChange={(e) => { setVendorAddress(e.target.value) }}
      />
      <Input 
        placeholder="Amount"
        value={amount}
        onChange={(e) => { setAmount(e.target.value) }}
      />
      <Select 
        value={selectedToken.symbol} 
        onValueChange={(val: string) => { 
          setSelectedToken(supportedTokens.find((st) => st.symbol === val)!) 
        }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Payment Token" />
        </SelectTrigger>
        <SelectContent>
          {supportedTokens.map((st) => (
            <SelectItem key={st.symbol} value={st.symbol}>{st.symbol}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={generate}>
          Generate QRCode
      </Button>
      {info && (<>
        <QRCode value={info} />
        <a href="/" className="underline">
          Go back
        </a>
        </>
      )}
    </div>
  )
}