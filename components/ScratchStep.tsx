import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScratchCard } from "@/components/ScratchCard";

export default function ScratchStep({
  isWinner,
}: {
  isWinner: boolean | null;
}) {
  const [isScratched, setIsScratched] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(82,255,0,0.15),transparent_50%)]" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <h2 className="text-3xl font-bold text-[#52FF00] uppercase tracking-tight">
          ¡Raspa para descubrir!
        </h2>
        <p className="text-white/90">Arrastra tu dedo sobre la tarjeta</p>

        <ScratchCard
          isWinner={isWinner}
          onComplete={() => setIsScratched(true)}
        />

        {isScratched && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {isWinner ? (
              <div className="bg-black border-2 border-[#52FF00] rounded-2xl p-6 space-y-4 shadow-2xl shadow-[#52FF00]/50">
                <div className="text-6xl">🏆</div>
                <h3 className="text-2xl font-bold text-[#52FF00] uppercase">
                  ¡Felicitaciones!
                </h3>
                <p className="text-white">
                  Has ganado un premio. Nos contactaremos contigo pronto.
                  <br />
                  <span className="text-[#52FF00] text-sm font-thin">
                    *Verificaremos tu boleta y tus datos personales, te
                    contactaremos en breve.
                  </span>
                </p>
              </div>
            ) : (
              <div className="bg-black border-2 border-[#52FF00]/50 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="text-6xl">⚡</div>
                <h3 className="text-2xl font-bold text-white uppercase">
                  ¡Sigue participando!
                </h3>
                <p className="text-gray-400">
                  No ganaste esta vez, pero cada compra es una nueva
                  oportunidad.
                </p>
              </div>
            )}

            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="w-full bg-[#52FF00] text-black hover:bg-[#45DD00] font-black uppercase tracking-wide cursor-pointer font-teko text-2xl"
            >
              Volver al inicio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
