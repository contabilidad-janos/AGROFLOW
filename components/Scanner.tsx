import { Html5Qrcode } from 'html5-qrcode';
import React, { useEffect, useRef } from 'react';

interface ScannerProps {
  onScan: (decodedText: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    const html5QrCode = new Html5Qrcode("qr-reader");
    
    const qrCodeSuccessCallback = (decodedText: string) => {
      onScan(decodedText);
      html5QrCode.stop().catch((err: any) => console.error(err));
    };

    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    html5QrCode.start(
      { facingMode: "environment" }, 
      config, 
      qrCodeSuccessCallback,
      undefined
    ).catch((err: any) => {
      console.error("Unable to start scanning.", err);
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch((err: any) => console.error(err));
      }
    };
  }, [onScan]);

  return (
    <div className="relative">
      <div id="qr-reader" ref={scannerRef} className="w-full"></div>
      <div className="absolute inset-0 pointer-events-none border-[40px] border-slate-900/40 flex items-center justify-center">
         <div className="w-64 h-64 border-2 border-[#D96C4D] relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#1A3C34] -ml-1 -mt-1"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#1A3C34] -mr-1 -mt-1"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#1A3C34] -ml-1 -mb-1"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#1A3C34] -mr-1 -mb-1"></div>
         </div>
      </div>
    </div>
  );
};

export default Scanner;
