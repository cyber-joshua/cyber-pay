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
import CyberButton from './CyberButton';


export default function LoginButton() {

  const [username, setUsername] = useState('');
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
      <div className={'absolute top-12 flex flex-col w-full items-center gap-8 transition-all duration-700 ' + (isCreating ? '-translate-y-96' : 'translate-y-0')}>

        <Image 
          src="/assets/connect-passkey-black.png" 
          alt="Connect" 
          className='mb-6'
          height={48} 
          width={320} 
        />
        <div className='px-8 w-full flex flex-col gap-8'>
        <CyberButton
          className='w-full'
          onClick={handleGet}
          loading={loginLoading}
          disabled={registerLoading}
          title={loginLoading ? 'Logging in...' : 'Login with passkey'}
        />
        <CyberButton
        className='w-full'
          onClick={handleCreate}
          disabled={loginLoading}
          title='Create a passkey'
        />
        </div>
      </div>

      <div className={'absolute top-12 flex flex-col w-full items-center gap-6 transition-all duration-700 ' + (isCreating ? 'translate-y-0' : 'translate-y-[600px]')}>

        <Image 
          src="/assets/enter-username.png" 
          alt="Connect" 
          className='mb-0'
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
          <CyberButton
        className='w-full'
          onClick={createPasskey}
          loading={registerLoading}
          disabled={loginLoading}
          title={registerLoading ? 'Registering...' : 'Register'}
        />
        </div>

        <div className='underline text-[#07DC10]' onClick={() => { setIsCreating(false) }}>
          Cancel
        </div>
        
      </div>
    </div>
  )
}