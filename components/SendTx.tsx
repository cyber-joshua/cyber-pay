import usePasskey from "@/hooks/usePasskeyTx";
import { useState } from "react";
import { formatEther } from "viem";
import { Button } from "./ui/button";

const rawCallData = {
  "to": "0x0414DDBf69294B1eE580eEf88862dEa94B726A07",
  "callData": "0x",
  "value": "1000000000000000"
}

export default function SendTx() {

  const [loading, setLoading] = useState(false);
  const [extra, setExtra] = useState('');
  const { sendUserOp, estimateUserOp, authInfo, balance } = usePasskey();

  const sendTx = async () => {

    if (!authInfo) return;

    try {
      setLoading(true);

      const callData = {
        ...rawCallData,
        sender: authInfo.aa,
      }

      const estimateResult: any = await estimateUserOp(callData);
      console.log('AAAA Estimate', estimateResult);

      if (!estimateResult) return;

      const result = await sendUserOp(
        estimateResult.userOperation,
        estimateResult.userOperationHash as `0x${string}`,
      );

      console.log('AAAA Send result', result);

      setExtra(JSON.stringify(result));
    } catch(e: any) {
      setExtra(e.toString());
    } finally {
      setLoading(false);
    }

  }

  return (
    <div>
      <Button
        onClick={sendTx}
        disabled={loading}
      >
        {loading ? 'Sending...' : `Send 0.001 ETH Balance: ${formatEther(balance)}`}
      </Button>
    </div>
  )
}