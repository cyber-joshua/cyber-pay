import { qrcodePrefix, qrcodeSeparator } from "@/lib/constants";
import CyberButton from "./CyberButton";
import { useState } from "react";
import { Address, Hash, encodeFunctionData, erc20Abi, parseUnits, zeroAddress } from "viem";
import usePasskey from "@/hooks/usePasskeyTx";

export default function PayDialog({
  payInfo,
  aa,
  open,
}: {
  payInfo: string;
  aa?: Address;
  open: boolean;
}) {

  const infoArr = payInfo.slice(qrcodePrefix.length).split(qrcodeSeparator);
  const vendorName = infoArr[0];
  const vendorAddress = infoArr[1];
  const amount = infoArr[2];
  const tokenSymbol = infoArr[3];
  const tokenAddress = infoArr[4];
  const tokenDecimal = parseInt(infoArr[5]);

  const { sendUserOp, estimateUserOp, authInfo, balance } = usePasskey();
  const [loading, setLoading] = useState(false);

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
    <div className={"flex flex-col gap-6 transition-all duration-700 " + (open ? 'h-0' : 'h-full')}>
      <div>WILL TRANSFER</div>
      <div>{amount} {tokenSymbol}</div>
      <div>TO</div>
      <div>{vendorName}</div>

      <CyberButton 
        title="Confirm"
        loading={loading}
        onClick={send}
      />
    </div>
  )
}