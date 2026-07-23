"use client";

import { RefObject, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { FlowerIllustration } from "@/data/flowers";
import { PlacedItem } from "@/types";

interface FlowerItemProps {
  item: PlacedItem;
  canvasRef: RefObject<HTMLDivElement>;
  onSlotChange: (id: string, clientY: number) => void;
  onNoteChange: (id: string, note: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Tek bir slotu dolduran çiçek + not satırı. Çiçek her zaman solda sabit
 * genişlikte, not textarea'sı sağda kalan tüm alanı kaplar ve dikey olarak
 * çiçekle aynı hizada ortalanır. Sürükleme yalnızca dikey eksende
 * (drag="y") çalışır; bırakılan Y konumuna göre hangi slota denk geldiği
 * page.tsx'te hesaplanır.
 */
export default function FlowerItem({
  item,
  canvasRef,
  onSlotChange,
  onNoteChange,
  onDelete,
}: FlowerItemProps) {
  // framer-motion sürükleme sırasında ayrı bir y transform'u tutar ve
  // sürükleme bitince bunu kendiliğinden sıfırlamaz. Slot değişip yeniden
  // konumlanınca eski offset üzerine binmesin diye elle sıfırlıyoruz.
  const y = useMotionValue(0);

  useEffect(() => {
    y.set(0);
  }, [item.slotIndex, y]);

  return (
    <motion.div
      drag="y"
      dragConstraints={canvasRef}
      dragMomentum={false}
      dragElastic={0.08}
      style={{ y }}
      whileDrag={{ scale: 1.02, zIndex: 30, cursor: "grabbing" }}
      onDragEnd={(_e, info) => {
        onSlotChange(item.id, info.point.y);
        y.set(0);
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, rotate: item.rotation }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative flex h-full w-full items-stretch"
    >
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Çiçeği sil"
        className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-paper/80 font-ui text-sm leading-none text-inkSoft shadow-soft transition-colors hover:bg-paper hover:text-ink sm:right-2 sm:top-2"
      >
        ×
      </button>
      <div className="relative flex w-24 shrink-0 cursor-grab touch-none items-center justify-center sm:w-28">
        <FlowerIllustration
          type={item.type}
          dried
          className="h-16 w-16 drop-shadow-[0_4px_6px_rgba(70,58,49,0.18)] pointer-events-none sm:h-20 sm:w-20"
        />
        {/* Washi bant: sapın üzerine hafif eğik yapışmış gibi durur,
            çiçeği sayfaya "tutturan" küçük bir dokunuş. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[62%] h-4 w-9 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] rounded-[1px] sm:h-[18px] sm:w-11"
          style={{
            background:
              "linear-gradient(135deg, rgba(236,226,199,0.9), rgba(212,195,157,0.75))",
            boxShadow: "0 1px 2px rgba(70,58,49,0.22)",
            border: "1px solid rgba(70,58,49,0.08)",
          }}
        />
      </div>
      <div className="flex h-full flex-1 items-center py-2 pr-4">
        <textarea
          value={item.note}
          onChange={(e) => {
            onNoteChange(item.id, e.target.value);

            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="bir not bırak..."
          rows={1}
          className="note-textarea resize-none overflow-y-auto max-h-[120px] w-full text-left font-hand text-xl leading-snug text-ink [scrollbar-width:thin] [scrollbar-color:#c2b29f_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#c2b29f] [&::-webkit-scrollbar-thumb]:rounded-full"
        />
      </div>
    </motion.div>
  );
}
