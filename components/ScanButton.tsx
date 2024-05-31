'use client'

import {Html5Qrcode, Html5QrcodeScanner} from "html5-qrcode";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function ScanButton() {

  const [info, setInfo] = useState('')

  const scan = () => {
    const html5QrCode = new Html5Qrcode(/* element id */ "reader");
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        var cameraId = devices[devices.length == 2 ? 1 : 0].id;
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
    }).catch(err => {
      // handle err
      console.log('AAAEEERRR', err)
    });
  }

  return (
    <Button 
        variant="cyber"
        onClick={scan}
      >
        Scan qrcode to pay
      </Button>
  )
}