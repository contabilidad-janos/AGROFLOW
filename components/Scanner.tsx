
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
  onScan: (decodedText: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-in fade-in duration-500 h-full">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm space-y-4">
        <div className="text-center space-y-1">
           <h2 className="text-2xl font-black text-[#1A3C34]">Escáner QR</h2>
           <p className="text-xs text-slate-400 font-medium">Apunta la cámara al código QR de la Fila o Caja</p>
        </div>
        
        <div id="reader" className="overflow-hidden rounded-2xl border-4 border-[#1A3C34]/10 bg-black/5"></div>
        
        <div className="bg-[#1A3C34]/5 p-4 rounded-xl flex items-start space-x-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1A3C34] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <p className="text-[10px] text-slate-600 leading-tight">
             Asegúrate de que haya suficiente luz. Si tienes problemas, usa la opción de <span className="font-bold">Entrada Manual</span> en el menú.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
