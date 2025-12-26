"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles } from "lucide-react";
import Image from "next/image";
import { FormStep } from "@/components/FormStep";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <FormStep onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(82,255,0,0.1),transparent_50%)]" />

      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-700 relative z-10">
        {/* Monster Logo */}
        <div className="relative w-96 max-w-[80vw] h-48 mx-auto">
          <Image
            src="/brand-logo.webp"
            alt="Logo Monster Energy"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[#52FF00] drop-shadow-[0_0_30px_rgba(82,255,0,0.5)] text-balance uppercase tracking-tight">
            ¡Unleash the Beast!
          </h1>
          <p className="text-xl text-white/90 text-pretty font-medium">
            Sube tu boleta de compra y participa por premios extremos
          </p>
        </div>

        {/* Features */}
        <div className="bg-[#52FF00]/10 backdrop-blur-sm border-2 border-[#52FF00]/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3 text-white">
            <Sparkles className="w-5 h-5 shrink-0 text-[#52FF00]" />
            <span className="text-left font-medium">
              Sube foto de tu boleta
            </span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Sparkles className="w-5 h-5 shrink-0 text-[#52FF00]" />
            <span className="text-left font-medium">Completa tus datos</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Sparkles className="w-5 h-5 shrink-0 text-[#52FF00]" />
            <span className="text-left font-medium">
              Raspa y descubre tu premio
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => setShowForm(true)}
          size="lg"
          className="cursor-pointer w-full h-16 text-3xl font-black font-teko bg-[#52FF00] text-black hover:bg-[#45DD00] shadow-2xl shadow-[#52FF00]/50 hover:shadow-[#52FF00]/70 hover:scale-105 transition-all uppercase tracking-wide"
        >
          Comenzar Ahora
        </Button>

        <p className="text-xs text-white/50 uppercase tracking-widest">
          Unleash The Beast
        </p>
      </div>
    </div>
  );
}
