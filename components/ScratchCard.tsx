"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";

interface ScratchCardProps {
  isWinner: boolean | null;
  onComplete: () => void;
}

export function ScratchCard({ isWinner, onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add Monster claw marks pattern
    ctx.strokeStyle = "#52FF00";
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + i * 50, 50);
      ctx.lineTo(70 + i * 50, 150);
      ctx.stroke();
    }

    ctx.fillStyle = "#52FF00";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("RASPA AQUÍ", canvas.width / 2, canvas.height / 2 + 30);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const posX = (x - rect.left) * scaleX;
    const posY = (y - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(posX, posY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && scratchPercentage <= 50) {
      onComplete();
    }
  };

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  if (isWinner !== null)
    return (
      <div className="relative inline-block">
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-2xl ${
            isWinner
              ? "bg-linear-to-br from-[#52FF00] to-[#45DD00]"
              : "bg-linear-to-br from-zinc-800 to-zinc-900"
          }`}
        >
          <div className="text-center p-6">
            <div className="text-6xl mb-3">{isWinner ? "🏆" : "⚡"}</div>
            <p className="text-2xl font-bold text-black uppercase tracking-tight">
              {isWinner ? "¡GANASTE!" : "Sigue intentando"}
            </p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative cursor-pointer rounded-2xl shadow-2xl shadow-[#52FF00]/50 touch-none border-2 border-[#52FF00]/30"
          style={{
            width: "400px",
            height: "250px",
            maxWidth: "80vw",
          }}
        />
      </div>
    );
}
