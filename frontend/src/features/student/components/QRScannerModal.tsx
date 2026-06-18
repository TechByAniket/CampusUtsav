import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { XCircle, Camera, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  eventTitle: string;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess, eventTitle }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;

        const config = { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: "environment" }, 
          config, 
          (decodedText) => {
            html5QrCode.stop().then(() => {
              onScanSuccess(decodedText);
            }).catch(() => {
              onScanSuccess(decodedText);
            });
          },
          () => {} // silent failure for frame-by-frame errors
        );
      } catch (err) {
        console.error("Failed to start scanner:", err);
      }
    };

    if (isOpen) {
      // Small delay to ensure the DOM element is rendered
      const timer = setTimeout(startScanner, 500);
      return () => {
        clearTimeout(timer);
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(err => console.error("Stop failed", err));
        }
      };
    }
  }, [isOpen, onScanSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all z-20"
            >
              <XCircle size={18} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6">
                 <span className="text-[10px] font-black text-sky-300 uppercase tracking-[0.4em]">Smart Verification</span>
              </div>
              
              <h3 className="text-xl font-black text-amber-200 tracking-tight uppercase mb-1 line-clamp-1 w-full">{eventTitle}</h3>
              
              <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest mb-6 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                 <Clock size={14} className="text-sky-300" />
                 <span className="text-sm tabular-nums">
                   {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                 </span>
              </div>

              <p className="text-indigo-100 text-[9px] font-bold uppercase tracking-[0.3em] mb-6 px-4">Center the QR code to scan</p>

              {/* Camera Area */}
              <div className="bg-white p-3 rounded-3xl shadow-2xl mb-8 relative w-full aspect-square overflow-hidden border-4 border-white/20">
                <div id="qr-reader" className="w-full h-full rounded-2xl overflow-hidden" />
                
                {/* Scanning Animation Overlays */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 m-6 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 m-6 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 m-6 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 m-6 rounded-br-lg" />
                    
                    <motion.div 
                        animate={{ top: ['10%', '90%', '10%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-[10%] right-[10%] h-0.5 bg-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.8)] z-20"
                    />
                </div>
              </div>

              <div className="w-full max-w-[240px] space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sky-200 text-[10px] font-black uppercase tracking-widest px-1">
                    <ShieldCheck size={14} />
                    <span>Secure Authentication</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-sky-400"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-indigo-200 text-[8px] font-bold leading-relaxed uppercase tracking-tight opacity-70">
                    Scanning for active session token...
                  </p>
              </div>
            </div>

            <style>{`
              #qr-reader { border: none !important; }
              #qr-reader__scan_region { background: transparent !important; }
              #qr-reader__scan_region video { 
                object-fit: cover !important; 
                width: 100% !important; 
                height: 100% !important;
                border-radius: 1.5rem !important;
              }
              #qr-reader__dashboard_section_csr button {
                background: #4f46e5 !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 12px !important;
                font-size: 10px !important;
                font-weight: 900 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.1em !important;
                cursor: pointer !important;
              }
              #qr-reader img { display: none !important; }
              #qr-reader__status_span { display: none !important; }
            `}</style>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRScannerModal;

