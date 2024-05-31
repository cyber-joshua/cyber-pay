import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
} from '@simplewebauthn/server';
import { useRef, useState } from "react";
import Image from "next/image"
import { useAtom } from "jotai";
import { passkeyAtom } from "@/atoms";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import usePasskeyAuth from "@/hooks/usePasskeyAuth";
import { Button } from './ui/button';
import { Input } from './ui/input';


export default function LoginButton() {

  const [username, setUsername] = useState('rntest333');
  const [isCreating, setIsCreating] = useState(false);
  const credentialIdRef = useRef('');
  const inputRef = useRef(null);
  
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

  const handleCreate = () => {
    setIsCreating(true);
  };

  const createPasskey = async () => {
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
  }


  return (
    <div className='relative h-full w-full overflow-hidden'>
      <div className={'absolute top-0 flex flex-col w-full items-center gap-8 transition-all duration-700 ' + (isCreating ? '-translate-y-96' : 'translate-y-0')}>

        <Image 
          src="/assets/connect-passkey-black.png" 
          alt="Connect" 
          className='mb-10'
          height={48} 
          width={320} 
        />
        <div className='px-8 w-full flex flex-col gap-8'>
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
        >Create a passkey</Button>
        </div>
      </div>

      <div className={'absolute top-0 flex flex-col w-full items-center gap-8 transition-all duration-700 ' + (isCreating ? 'translate-y-0' : 'translate-y-96')}>

        <Image 
          src="/assets/enter-username.png" 
          alt="Connect" 
          className='mb-4'
          height={48} 
          width={320} 
        />

        <div className='px-6 flex flex-col gap-8'>
          <input 
            ref={inputRef}
            placeholder='Your username'
            value={username}
            className='border-b border-b-gray-300 outline-none shadow-none p-2 text-3xl w-full text-center'
            onChange={(e) => { setUsername(e.target.value) }}
          />
          <Button
        variant="cyber"
        size="xl"
        className='w-full'
          onClick={createPasskey}
          disabled={registerLoading}
        >Confirm</Button>
        </div>

        <div className='underline text-[#07DC10]' onClick={() => { setIsCreating(false) }}>
          Cancel
        </div>
        
      </div>
    </div>
  )
}