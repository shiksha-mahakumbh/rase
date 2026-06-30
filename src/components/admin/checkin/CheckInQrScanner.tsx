"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  active: boolean;
  onScan: (text: string) => void;
};

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => BarcodeDetectorLike;
  }
}

export default function CheckInQrScanner({ active, onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        const Detector = window.BarcodeDetector;
        if (!Detector) {
          setError(
            "Camera is on — point at QR or use a USB scanner into the ID field. (Auto-decode needs Chrome/Edge on Android or desktop.)"
          );
          return;
        }

        const detector = new Detector({ formats: ["qr_code"] });
        let lastValue = "";
        let lastAt = 0;

        const tick = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            const value = codes[0]?.rawValue?.trim();
            if (value) {
              const now = Date.now();
              if (value !== lastValue || now - lastAt > 2000) {
                lastValue = value;
                lastAt = now;
                onScanRef.current(value);
              }
            }
          } catch {
            // skip frame
          }
          rafRef.current = requestAnimationFrame(() => void tick());
        };

        void tick();
        setError(null);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Camera unavailable — enter ID manually or use a USB barcode scanner."
        );
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="space-y-2">
      <video
        ref={videoRef}
        className="aspect-[4/3] w-full rounded-xl border border-slate-200 bg-black object-cover"
        playsInline
        muted
      />
      {error && <p className="text-xs text-amber-800">{error}</p>}
    </div>
  );
}
