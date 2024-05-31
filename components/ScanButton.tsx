'use client'

import {Html5Qrcode, Html5QrcodeScanner} from "html5-qrcode";
import { useEffect, useState } from "react";

export default function ScanButton() {

  const [info, setInfo] = useState('')
  const [cameraId, setCameraId] = useState('')

  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length == 2) {
        var cameraId = devices[0].id;
        // .. use this to start scanning.
        console.log('AAA', devices)
        setCameraId(devices[1].id)
      }
    }).catch(err => {
      // handle err
      console.log('AAAEEERRR', err)
    });
  })

  function onScanSuccess(decodedText: string, decodedResult: any) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }
  
  function onScanFailure(error: any) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    setInfo(`Code scan error = ${error}`)
    console.warn(`Code scan error = ${error}`);
  }

  const scan = () => {
    const html5QrCode = new Html5Qrcode(/* element id */ "reader");
html5QrCode.start(
  cameraId, 
  {
    fps: 10,    // Optional, frame per seconds for qr code scanning
    qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
  },
  (decodedText, decodedResult) => {
    // do something when code is read
    setInfo(`Code scan result = ${decodedText}`)
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

  return (
    <div className="p-8">
      <div 
        className="flex justify-center items-center bg-white text-black px-6 py-3 rounded"
        onClick={scan}
      >
        Scan QRCode
      </div>
      <div>
        {info}
      </div>
      <div id="reader" />
    </div>
  )
}