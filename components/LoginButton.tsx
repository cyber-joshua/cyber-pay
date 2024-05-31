import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
} from '@simplewebauthn/server';
import { useRef, useState } from "react";
import { useAtom } from "jotai";
import { passkeyAtom } from "@/atoms";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import usePasskeyAuth from "@/hooks/usePasskeyAuth";
import { Button } from './ui/button';


export default function LoginButton() {

  const [username, setUsername] = useState('rntest333');
  const credentialIdRef = useRef('');
  
  const [passkeyInfo, setPasskeyInfo] = useAtom(passkeyAtom);
  const { 
    loginWithPasskey, 
    registerPasskey,
    loginLoading,
    registerLoading
  } = usePasskeyAuth({
    onLoginSuccess: (data: any) => {
      const loginData = data.loginWithPasskey.data;
      setPasskeyInfo({
        credentialId: credentialIdRef.current,
        publicKey: loginData.passkeyUser.publicKey,
        aa: loginData.cyberAccount,
        accessToken: loginData.accessToken,
      });
    },
    onRegisterSuccess: (data: any) => {
      const registerData = data.registerPasskey.data;
      setPasskeyInfo({
        credentialId: credentialIdRef.current,
        publicKey: registerData.passkeyUser.publicKey,
        aa: registerData.cyberAccount,
        accessToken: registerData.accessToken,
      });
    }
  })


  const handleGet = async () => {
    const rpID = window.location.hostname;
    try {
      const options: PublicKeyCredentialRequestOptionsJSON =
        await generateAuthenticationOptions({
          rpID,
        });
      const asseResp = await startAuthentication({
        ...options,
      });
      credentialIdRef.current = asseResp.id;
      loginWithPasskey({
        input: {
          credential: {
            allowOrigins: [origin],
            rpId: rpID,
            authenticatorData: asseResp.response.authenticatorData,
            signature: asseResp.response.signature,
            userHandle: asseResp.response.userHandle ?? '',
            credentialId: asseResp.id,
            challenge: options.challenge,
            clientDataJSON: asseResp.response.clientDataJSON,
          },
        },
      });
    } catch (e) {
      console.error('AAA Passkey Login error', e);
    }
  };

  const handleCreate = async () => {

    const rpID = window.location.hostname;
    try {
      const options: PublicKeyCredentialCreationOptionsJSON =
        await generateRegistrationOptions({
          rpName: 'Cyber Wallet',
          rpID,
          userName: `${username}.wallet.cyber`,
          attestationType: 'none',
        });

      const attResp = await startRegistration(options);
      credentialIdRef.current = attResp.id;
      
      registerPasskey({
        input: {
            userName: username,
            userId: options.user.id,
            credential: {
              rpId: rpID,
              allowOrigins: [origin],
              credentialId: attResp.id,
              challenge: options.challenge,
              attestationObject: attResp.response.attestationObject,
              clientDataJSON: attResp.response.clientDataJSON,
            },
          },
      });
    } catch (e) {
      console.error('AAA Passkey register error', e);
    }
  };


  return (
    <div className='w-full px-8 mt-10'>
      {passkeyInfo ? (
        <div style={{ paddingTop: 15, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ textAlign: 'center' }}>
            { passkeyInfo.aa }
          </div>
          
          <Button
            variant="cyber"
            onClick={() => {
              setPasskeyInfo(undefined)
            }}
          >Logout</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full">
          <Button
            variant="cyber"
            className='w-full'
            size="xl"
            onClick={handleGet}
            disabled={loginLoading}
          >Login with passkey</Button>
          <Button
          variant="cyber"
          size="xl"
          className='w-full'
            onClick={handleCreate}
            disabled={registerLoading}
          >Create a passkey</Button>
        </div>
      )}
    </div>
  )
}