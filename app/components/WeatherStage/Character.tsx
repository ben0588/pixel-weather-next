"use client";

interface CharacterProps {
  weatherPrompt?: string;
}

export default function Character({ weatherPrompt }: CharacterProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center">
      {/* 氣象指示 */}
      <div className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-black/50 px-4 py-2">
        <p className="font-pixel flex items-center justify-center text-center text-xs leading-relaxed text-yellow-300">
          {weatherPrompt}
        </p>
      </div>
    </div>
  );
}
