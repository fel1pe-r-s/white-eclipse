import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Image as ImageIcon, RotateCw } from "lucide-react";

interface CameraViewProps {
  onCapture: (imageBase64: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative h-full w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-xl shadow-2xl">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: facingMode,
          width: 720,
          height: 1280,
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      
      {/* Overlay controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center z-10">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all"
        >
          <ImageIcon size={24} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <button
          onClick={capture}
          className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 hover:bg-white/30 transition-all active:scale-95"
          aria-label="Take photo"
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </button>

        <button
          onClick={toggleCamera}
          className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all"
        >
          <RotateCw size={24} />
        </button>
      </div>

      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <h2 className="text-white text-center font-medium drop-shadow-md">
          Take a photo of your meal
        </h2>
      </div>
    </div>
  );
};
