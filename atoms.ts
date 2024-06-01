import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils'

export interface PasskeyInfo {
  credentialId: string;
  publicKey: string;
  accessToken: string;
  aa: `0x${string}`;
}

export const passkeyAtom = atomWithStorage<PasskeyInfo|undefined>('passkeyInfo', undefined)


export const qrAtom = atom<string>('');