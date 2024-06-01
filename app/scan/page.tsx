'use client'

import { qrAtom } from "@/atoms";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useSetAtom } from "jotai";
import { ArrowLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScanPage() {

  const [info, setInfo] = useState('')
  const setArAtom = useSetAtom(qrAtom);
  const router = useRouter();

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(/* element id */ "reader");
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        var cameraId = devices[devices.length == 2 ? 1 : 0].id;
        if (html5QrCode.getState() === Html5QrcodeScannerState.NOT_STARTED) {
          html5QrCode.start(
            cameraId, 
            {
              fps: 10,    // Optional, frame per seconds for qr code scanning
              qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
            },
            (decodedText, decodedResult) => {
              // do something when code is read
              setInfo(`Code scan result = ${decodedText}`);
              setArAtom(decodedText);
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
      }
    }).catch(err => {
      // handle err
      console.log('AAAEEERRR', err)
    });

    return () => {
      if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
        html5QrCode.stop();
        html5QrCode.clear();
      }
    }
  }, [router])

  return (
    <div className="h-screen w-full flex items-center justify-cente bg-black">
      <div id="reader" className="w-full" />
      <div className="fixed bottom-0 left-0 right-0 h-32 text-white">
        {info}
      </div>
      <div className="fixed top-8 left-4" onClick={() => { router.back() }}>
        <ArrowLeftCircle className="text-white" size={32} />
      </div>
    </div>
  )
}