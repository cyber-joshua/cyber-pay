'use client'

import {Html5Qrcode, Html5QrcodeScanner} from "html5-qrcode";
import { useEffect } from "react";

export default function ScanButton() {

  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        var cameraId = devices[0].id;
        // .. use this to start scanning.
        console.log('AAA', devices)
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
    console.warn(`Code scan error = ${error}`);
  }

  const scan = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250} },
      /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
  }

  return (
    <>
      <div 
        className="flex justify-center items-center bg-white text-black px-6 py-3 rounded"
        onClick={scan}
      >
        Scan QRCode
      </div>
      <div id="reader" />
    </>
  )
}