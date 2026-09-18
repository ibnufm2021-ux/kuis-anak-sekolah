"use client";

import React, { useState } from "react";
import { X, Smartphone, Tablet, Monitor, RotateCcw } from "lucide-react";

interface LivePreviewModalProps {
  htmlContent: string;
  onClose: () => void;
}

type DeviceMode = "mobile" | "tablet" | "desktop";

export default function LivePreviewModal({
  htmlContent,
  onClose,
}: LivePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("mobile");
  const [iframeKey, setIframeKey] = useState(0);

  const getContainerWidth = () => {
    switch (deviceMode) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[720px]";
      case "desktop":
        return "max-w-4xl";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 overflow-hidden">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between bg-slate-800 text-white px-4 py-2.5 rounded-t-2xl max-w-5xl w-full mx-auto border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Lihat Kuis Langsung (Offline)</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
            Simulasi Offline
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-700/60 p-1 rounded-lg gap-1">
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              deviceMode === "mobile"
                ? "bg-indigo-600 text-white font-medium"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tampilan HP"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HP</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              deviceMode === "tablet"
                ? "bg-indigo-600 text-white font-medium"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tampilan Tablet"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              deviceMode === "desktop"
                ? "bg-indigo-600 text-white font-medium"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tampilan Laptop"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Laptop</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
            title="Reload Frame"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
            title="Tutup Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center overflow-auto py-2">
        <div
          className={`w-full ${getContainerWidth()} h-full max-h-[820px] transition-all duration-300 bg-white rounded-b-2xl shadow-2xl overflow-hidden border border-slate-700`}
        >
          <iframe
            key={iframeKey}
            srcDoc={htmlContent}
            title="Preview Kuis"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
