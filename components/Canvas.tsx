"use client";

import { forwardRef } from "react";
import FlowerItem from "./FlowerItem";
import { MAX_SLOTS, PlacedItem } from "@/types";

interface CanvasProps {
  items: PlacedItem[];
  onSlotChange: (id: string, clientY: number) => void;
  onNoteChange: (id: string, note: string) => void;
  onDeleteItem: (id: string) => void;
  dragStatus: "inside" | "outside" | null;
  hoveredSlot: number | null;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(function Canvas(
  { items, onSlotChange, onNoteChange, onDeleteItem, dragStatus, hoveredSlot },
  ref,
) {
  const itemBySlot = new Map(items.map((item) => [item.slotIndex, item]));
  const occupiedSlots = itemBySlot.size;

  return (
    <main className="desk-texture relative flex h-full w-full flex-1 items-center justify-center overflow-auto p-6 md:p-14">
      {/* Kağıdın dışına, sürükleme sırasında geri bildirim için kırmızı ton.
          Kağıt bu katmanın üzerinde (sonraki DOM sırasında) render edildiği
          için kağıt alanını kapatmaz, sadece etrafındaki masayı boyar. */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
          dragStatus === "outside" ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "rgba(200, 60, 55, 0.16)" }}
      />

      <div
        ref={ref}
        className="paper-texture paper-vignette relative flex aspect-[210/297] h-full max-h-[860px] w-auto max-w-full flex-col rounded-[2px] shadow-paper transition-shadow duration-150"
      >
        {occupiedSlots === 0 && (
          <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-10 text-center font-hand text-2xl text-inkSoft/60">
            kurutulmuş çiçeğini buraya sürükle...
          </p>
        )}

        {Array.from({ length: MAX_SLOTS }).map((_, slotIndex) => {
          const item = itemBySlot.get(slotIndex);
          const isHovered =
            dragStatus === "inside" && hoveredSlot === slotIndex;
          // Boş slot: yeşil (buraya bırakabilirsin).
          // Dolu slot: kehribar (buradaki çiçekle yer değiştirir).
          const isAvailable = isHovered && !item;
          const isSwap = isHovered && !!item;

          return (
            <div
              key={slotIndex}
              className={`relative flex-1 ${
                slotIndex < MAX_SLOTS - 1
                  ? "border-b border-dashed border-ink/10"
                  : ""
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
                  isAvailable || isSwap ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundColor: isSwap
                    ? "rgba(196, 142, 60, 0.16)"
                    : "rgba(88, 152, 88, 0.14)",
                }}
              />

              {item && (
                <FlowerItem
                  item={item}
                  canvasRef={ref as React.RefObject<HTMLDivElement>}
                  onSlotChange={onSlotChange}
                  onNoteChange={onNoteChange}
                  onDelete={onDeleteItem}
                />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
});

export default Canvas;
