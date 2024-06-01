'use client'

import { qrAtom } from "@/atoms";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useSetAtom } from "jotai";
import { ArrowLeftCircle, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ScanPage() {

  const [info, setInfo] = useState('')
  const setQRAtom = useSetAtom(qrAtom);
  const router = useRouter();
  const [cameraIds, setCameraIds] = useState<string[]>([]);
  const qrcodeRef = useRef<Html5Qrcode|undefined>();
  const cameraIdRef = useRef('');

  const isScanning = qrcodeRef.current?.getState() == Html5QrcodeScannerState.SCANNING;

  const switchCamera = async () => {

    if (!qrcodeRef.current || !cameraIds.length) return;

    if (isScanning) {
      await clear();
    }

    if (!cameraIdRef.current) {
      cameraIdRef.current = cameraIds[0];
    } else if (cameraIds.length > 1) {
      const index = cameraIds.indexOf(cameraIdRef.current);
      cameraIdRef.current = index == 0 ? cameraIds[1] : cameraIds[0];
    }

    qrcodeRef.current.start(
      cameraIdRef.current, 
      {
        fps: 10,    // Optional, frame per seconds for qr code scanning
        qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
      },
      (decodedText, decodedResult) => {
        // do something when code is read
        setInfo(`Code scan result = ${decodedText}`);
        setQRAtom(decodedText);
        router.back();
      },
      (errorMessage) => {
        // parse error, ignore it.
        setInfo(`Code scan error = ${errorMessage}`)
      })
    .catch((err) => {
      // Start failed, handle it.
      setInfo(`Code scan catch error = ${err}`)
    });

  }

  const clear = async () => {
    if (isScanning) {
      await qrcodeRef.current!.stop();
      qrcodeRef.current!.clear();
    }
  }

  useEffect(() => {
    qrcodeRef.current = new Html5Qrcode(/* element id */ "reader");
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const cameraIds = devices.map((d) => d.id);
        setCameraIds(cameraIds);
      }
    }).catch(err => {
      console.log('AAAEEERRR', err)
    });

    return () => {
        clear();
    }
  }, [])

  return (
    <div className="h-screen w-full flex items-center justify-cente bg-black">
      <div id="reader" className="w-full" />
      <div className="fixed bottom-0 left-0 right-0 h-32 text-white">
        {info}
      </div>
      <div className="fixed top-8 left-4" onClick={() => { router.back() }}>
        <ArrowLeftCircle className="text-white" size={32} />
      </div>
      <div className="fixed top-8 right-4" onClick={switchCamera}>
        <RefreshCcw className="text-white" size={32} />
      </div>
    </div>
  )
}