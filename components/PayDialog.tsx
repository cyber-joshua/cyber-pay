import { qrcodePrefix, qrcodeSeparator } from "@/lib/constants";
import CyberButton from "./CyberButton";
import { useState } from "react";
import { Address, Hash, encodeFunctionData, erc20Abi, parseUnits, zeroAddress } from "viem";
import usePasskey from "@/hooks/usePasskeyTx";
import { useAtom } from "jotai";
import { qrAtom } from "@/atoms";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import { useToast } from "./ui/use-toast";

export default function PayDialog() {

  const { sendUserOp, estimateUserOp, authInfo, balance, fetchBalance } = usePasskey();
  const [loading, setLoading] = useState(false);
  const [payInfo, setPayInfo] = useAtom(qrAtom);
  const open = authInfo && Boolean(payInfo);
  const { toast } = useToast();

  const infoArr = payInfo?.slice(qrcodePrefix.length).split(qrcodeSeparator);
  const vendorName = infoArr?.[0] ?? '';
  const vendorAddress = infoArr?.[1] ?? zeroAddress;
  const amount = infoArr?.[2] ?? '1';
  const tokenSymbol = infoArr?.[3] ?? 'ETH';
  const tokenAddress = infoArr?.[4] ?? zeroAddress;
  const tokenDecimal = parseInt(infoArr?.[5] ?? '18');

  const aa = authInfo?.aa ?? '0x';
  const amountBigInt = parseUnits(amount, tokenDecimal);


  let callData;
  if (tokenAddress === zeroAddress) {
    callData = {
      sender: aa,
      to: vendorAddress,
      callData: '0x' as Hash,
      value: amountBigInt.toString(),
    }
  } else {
    const encoded = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [vendorAddress as Address, amountBigInt],
    });
    callData = {
      sender: aa,
      callData: encoded,
      to: tokenAddress
    }
  }

  const send = async () => {

    if (amountBigInt >= balance) {
      toast({ variant: "destructive", description: "Not enough balance" });
      return;
    }

    try {
      setLoading(true);

      const estimateResult: any = await estimateUserOp(callData);
      console.log('AAAA Estimate', estimateResult);

      if (!estimateResult) return;

      const result = await sendUserOp(
        estimateResult.userOperation,
        estimateResult.userOperationHash as `0x${string}`,
      );

      fetchBalance(aa);

      console.log('AAAA Send result', result);
      setLoading(false);
      setPayInfo('');
      
    } catch(e: any) {
      toast({ variant: "destructive", description: e.toString() });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={(op) => { 
      if (!op) {
        setPayInfo('');
      }
    }}>
      <DrawerContent className="z-[10009]">
    <div className={"h-[calc(100vh-468px)] bg-white flex flex-col items-center pt-4 gap-3 transition-all duration-500 " + (open ? 'translate-y-0' : 'translate-y-[2000px]')}>
      <div className="text-stroke-thin font-bold">WILL TRANSFER</div>
      <div className="text-stroke font-extrabold text-4xl">{amount} {tokenSymbol}</div>
      <div className="font-bold text-gray-400">TO</div>
      <div className="text-stroke font-extrabold text-4xl">{vendorName}</div>

      <CyberButton 
        title={loading ? "Paying" : "Confirm"}
        className="w-4/5 mt-12"
        loading={loading}
        onClick={send}
      />

      <div className="underline cursor-pointer mt-6 text-gray-500" onClick={() => { setPayInfo('') }}>
        CANCEL
      </div>
    </div>
      </DrawerContent>
    </Drawer>
  )
}