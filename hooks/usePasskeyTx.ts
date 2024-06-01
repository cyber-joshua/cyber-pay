import { p256 } from '@noble/curves/p256';
import {
  type Hex,
  bytesToBigInt,
  hexToBytes,
  encodeAbiParameters,
  Hash,
  toBytes,
  Address,
  createPublicClient,
  http,
  fromBytes,
  createClient,
} from 'viem';
import { useEffect, useState } from 'react';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { startAuthentication } from '@simplewebauthn/browser';
import { type PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/types"
import { useAtomValue } from 'jotai';
import { PasskeyInfo, passkeyAtom } from '@/atoms';
import { cyberTestnet } from '@/lib/constants';

const paymasterEndpoint = 'https://api.stg.cyberconnect.dev/paymaster/';
const appId = 'a0972e8d-b704-4715-8992-8bda43cb7977';
const paymasterUrl = `${paymasterEndpoint.replace('/paymaster/', '/cyberaccount/paymaster')}/v2/rpc?appId=${appId}&chainId=${cyberTestnet.id}`;
const bundlerUrl = `${paymasterEndpoint.replace('/paymaster/', '/cyberaccount/bundler')}/v1/rpc?appId=${appId}&chainId=${cyberTestnet.id}`;
const entryPoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

const publicClient = createPublicClient({
  chain: cyberTestnet,
  transport: http(),
});

const uint8ArrayToHexString = (array: Uint8Array): `0x${string}` => {
  return `0x${Array.from(array, (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')}` as `0x${string}`;
};

const b64ToBytes = (base64: string): Uint8Array => {
  const paddedBase64 = base64
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binString = atob(paddedBase64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
};

const findQuoteIndices = (
  input: string,
): { beforeType: bigint; beforeChallenge: bigint } => {
  const beforeTypeIndex = BigInt(input.lastIndexOf('"type":"webauthn.get"'));
  const beforeChallengeIndex = BigInt(input.indexOf('"challenge'));
  return {
    beforeType: beforeTypeIndex,
    beforeChallenge: beforeChallengeIndex,
  };
};

// Parse DER-encoded P256-SHA256 signature to contract-friendly signature
// and normalize it so the signature is not malleable.
function parseAndNormalizeSig(derSig: Hex): { r: bigint; s: bigint } {
  const parsedSignature = p256.Signature.fromDER(derSig.slice(2));
  const bSig = hexToBytes(`0x${parsedSignature.toCompactHex()}`);
  // assert(bSig.length === 64, "signature is not 64 bytes");
  const bR = bSig.slice(0, 32);
  const bS = bSig.slice(32);

  // Avoid malleability. Ensure low S (<= N/2 where N is the curve order)
  const r = bytesToBigInt(bR);
  let s = bytesToBigInt(bS);
  const n = BigInt(
    '0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551',
  );
  if (s > n / 2n) {
    s = n - s;
  }
  return { r, s };
}

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join('');
  return window.btoa(binString);
}

const signMessage = async (userOpHash: Hash, credentialId: string) => {
  try {
    const challenge = bytesToBase64(toBytes(userOpHash)).replace(/=/g, '');
    const options: PublicKeyCredentialRequestOptionsJSON =
      await generateAuthenticationOptions({
        rpID: window.location.hostname,
        allowCredentials: [
          {
            id: credentialId,
          },
        ],
      });
    const verifyResult = await startAuthentication({
      ...options,
      challenge,
    });
    // get authenticator data
    const authenticatorData = verifyResult.response.authenticatorData;
    const authenticatorDataHex = uint8ArrayToHexString(
      b64ToBytes(authenticatorData),
    );

    // get client data JSON
    const clientDataJSON = window.atob(verifyResult.response.clientDataJSON);

    // get challenge and response type location
    const { beforeType } = findQuoteIndices(clientDataJSON);

    // get signature r,s
    const signature = verifyResult.response.signature;
    const signatureHex = uint8ArrayToHexString(b64ToBytes(signature));
    const { r, s } = parseAndNormalizeSig(signatureHex);

    const signatureComponents = [
      { name: 'authenticatorData', type: 'bytes' },
      { name: 'clientDataJSON', type: 'string' },
      { name: 'responseTypeLocation', type: 'uint256' },
      { name: 'r', type: 'uint256' },
      { name: 's', type: 'uint256' },
      { name: 'usePrecompiled', type: 'bool' },
    ];

    return encodeAbiParameters(signatureComponents, [
      authenticatorDataHex,
      clientDataJSON,
      beforeType,
      BigInt(r),
      BigInt(s),
      false,
    ]);
  } catch (e) {
    return undefined;
  }
};

async function sendUserOperation(userOperation: any) {
  return await clientBundler.request({
    method: 'eth_sendUserOperation' as any,
    params: [userOperation, '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'],
  });
}

async function estimateUserOperation(
  contractCall: any,
  ctx: any,
) {
  return await clientPaymaster.request({
    method: "cc_estimateUserOperation" as any,
    params: [
      {
        ...contractCall,
        value: contractCall.value || '0',
        nonce: null,
        maxFeePerGas: null,
        maxPriorityFeePerGas: null,
        ep: entryPoint,
      },
      ctx,
    ],
  });
}

const clientBundler = createClient({
  chain: cyberTestnet,
  transport: http(bundlerUrl, {
    retryCount: 0,
  }),
}).extend(() => ({
  sendUserOperation,
}));

const clientPaymaster = createClient({
  chain: cyberTestnet,
  transport: http(paymasterUrl, {
    retryCount: 0,
  }),
}).extend(() => ({
  estimateUserOperation,
}));



export default function usePasskey() {
  const [balance, setBalance] = useState(BigInt(0));
  const authInfo: PasskeyInfo | undefined = useAtomValue(passkeyAtom)
  useEffect(() => {
    if (authInfo?.aa) {
      fetchBalance(authInfo.aa);
    }
  }, [authInfo]);

  const fetchBalance = async (address: Address) => {
    try {
      const bal = await publicClient.getBalance({
        address,
      });
      setBalance(bal);
    } catch (e) {
      setBalance(BigInt(0));
    }
  };

  const signUserOpHash = async (
    userOpHash: Hash,
  ): Promise<Hash | undefined> => {
    if (!authInfo?.credentialId) return;

    const signature = await signMessage(userOpHash, authInfo.credentialId);
    if (!signature) return;

    const sigBytes = toBytes(signature);
    const zeroBytes: Uint8Array = new Uint8Array(4);
    const newSignatureBytes: Uint8Array = new Uint8Array([
      ...zeroBytes,
      ...sigBytes,
    ]);
    return fromBytes(newSignatureBytes, 'hex');
  };

  const sendUserOp = async (userOp: any, userOpHash: Hash) => {
    if (!userOpHash || !userOp) return;
    const signature = await signUserOpHash(userOpHash);
    const result = await clientBundler.sendUserOperation({
      ...userOp,
      signature,
    });
    return result;
  };

  const estimateGas = async (callData: any) => {
    if (!authInfo) return;

    const ctx = {
      chainId: cyberTestnet.id,
      validator: 'PASSKEY',
      passkey_pubkey: authInfo.publicKey,
      passkey_authenticator_id: authInfo.credentialId,
    };
    const result = await estimateUserOperation(callData, ctx as any);

    return result;
  };

  return {
    balance,
    authInfo,
    estimateUserOp: estimateGas,
    sendUserOp,
    fetchBalance,
  };
}
