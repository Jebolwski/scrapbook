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
  showTip: boolean;
  onDismissTip: () => void;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(function Canvas(
  {
    items,
    onSlotChange,
    onNoteChange,
    onDeleteItem,
    dragStatus,
    hoveredSlot,
    showTip,
    onDismissTip,
  },
  ref,
) {
  const itemBySlot = new Map(items.map((item) => [item.slotIndex, item]));
  const occupiedSlots = itemBySlot.size;

  return (
    <main className="desk-texture relative flex h-full w-full flex-1 items-center justify-center overflow-hidden p-6 md:p-14">
      {/* Kağıdın dışına, sürükleme sırasında geri bildirim için kırmızı ton */}
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

      {/* Sol alt köşede duran ipucu sticker'ı */}
      {showTip && (
        <div className="md:block hidden pointer-events-none absolute bottom-24 left-4 z-30 md:bottom-6 md:left-6">
          <div className="pointer-events-auto relative max-w-[180px] -rotate-3 rounded-sm bg-paper px-3.5 py-2.5 shadow-paper sm:max-w-[220px] sm:px-4 sm:py-3">
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-4 w-11 -translate-x-1/2 -translate-y-1/2 -rotate-2 rounded-[1px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(236,226,199,0.92), rgba(212,195,157,0.8))",
                boxShadow: "0 1px 2px rgba(70,58,49,0.22)",
                border: "1px solid rgba(70,58,49,0.08)",
              }}
            />
            <button
              type="button"
              onClick={onDismissTip}
              aria-label="İpucunu kapat"
              data-export-hide
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-paper text-inkSoft shadow-soft transition-colors hover:text-ink"
            >
              ×
            </button>
            <p className="font-hand text-sm leading-snug text-ink sm:text-base">
              Sol taraftan dilediğin çiçeği seçip panoya sürükleyebilir, üzerine
              kendi notlarını ekleyebilirsin ✨
            </p>
          </div>
        </div>
      )}
    </main>
  );
});

export default Canvas;
