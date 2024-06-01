import { qrcodePrefix, qrcodeSeparator } from "@/lib/constants";
import CyberButton from "./CyberButton";
import { useState } from "react";
import { Address, Hash, encodeFunctionData, erc20Abi, parseUnits, zeroAddress } from "viem";
import usePasskey from "@/hooks/usePasskeyTx";
import { useSetAtom } from "jotai";
import { qrAtom } from "@/atoms";

export default function PayDialog({
  payInfo,
  aa,
  open,
}: {
  payInfo?: string;
  aa?: Address;
  open: boolean;
}) {
  const { sendUserOp, estimateUserOp, authInfo, balance } = usePasskey();
  const [loading, setLoading] = useState(false);
  const setPayInfo = useSetAtom(qrAtom);

  if (!payInfo) return null;

  const infoArr = payInfo.slice(qrcodePrefix.length).split(qrcodeSeparator);
  const vendorName = infoArr[0];
  const vendorAddress = infoArr[1];
  const amount = infoArr[2];
  const tokenSymbol = infoArr[3];
  const tokenAddress = infoArr[4];
  const tokenDecimal = parseInt(infoArr[5]);


  let callData;
  if (tokenAddress === zeroAddress) {
    callData = {
      sender: aa,
      to: vendorAddress,
      callData: '0x' as Hash,
      value: parseUnits(amount, tokenDecimal).toString(),
    }
  } else {
    const encoded = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [vendorAddress as Address, parseUnits(amount, tokenDecimal)],
    });
    callData = {
      sender: aa,
      callData: encoded,
      to: tokenAddress
    }
  }

  const send = async () => {
    try {
      setLoading(true);

      const estimateResult: any = await estimateUserOp(callData);
      console.log('AAAA Estimate', estimateResult);

      if (!estimateResult) return;

      const result = await sendUserOp(
        estimateResult.userOperation,
        estimateResult.userOperationHash as `0x${string}`,
      );

      console.log('AAAA Send result', result);

      
    } catch(e: any) {
      console.log('AAAA Send Error', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={"absolute w-full h-full top-24 bg-white flex flex-col items-center pt-4 gap-3 transition-all duration-500 " + (open ? 'translate-y-0' : 'translate-y-[2000px]')}>
      <div className="text-stroke-thin font-bold">WILL TRANSFER</div>
      <div className="text-stroke font-extrabold text-4xl">{amount} {tokenSymbol}</div>
      <div className="font-bold text-gray-400">TO</div>
      <div className="text-stroke font-extrabold text-4xl">{vendorName}</div>

      <CyberButton 
        title="Confirm"
        className="w-4/5 mt-12"
        loading={loading}
        onClick={send}
      />

      <div className="underline cursor-pointer mt-6 text-gray-500" onClick={() => { setPayInfo('') }}>
        CANCEL
      </div>
    </div>
  )
}