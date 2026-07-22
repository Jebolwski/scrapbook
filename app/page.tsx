"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";
import { FlowerType, MAX_SLOTS, PlacedItem } from "@/types";

/** Bir Y ekran koordinatını, kağıdın 5 eşit slotundan hangisine denk geldiğine çevirir. */
function slotFromClientY(canvasEl: HTMLDivElement, clientY: number): number {
  const rect = canvasEl.getBoundingClientRect();
  const relativeY = clientY - rect.top;
  const raw = Math.floor((relativeY / rect.height) * MAX_SLOTS);
  return Math.min(MAX_SLOTS - 1, Math.max(0, raw));
}

/** Hedef slot doluysa, en yakın boş slotu (varsa) bulur. */
function findNearestFreeSlot(target: number, occupied: Set<number>): number | null {
  if (!occupied.has(target)) return target;
  for (let d = 1; d < MAX_SLOTS; d++) {
    if (target - d >= 0 && !occupied.has(target - d)) return target - d;
    if (target + d < MAX_SLOTS && !occupied.has(target + d)) return target + d;
  }
  return null;
}

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<PlacedItem[]>([]);
  // Kurutulmuş çiçek sürüklenirken imlecin A4 kağıdına göre konumunu
  // izler: "inside" (kağıdın üzerinde) / "outside" (kağıdın dışında) / null (sürükleme yok)
  const [dragStatus, setDragStatus] = useState<"inside" | "outside" | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  // Telefonda sol panel yerine alttan açılan bir çekmece kullanılır.
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  function handleDragStatusChange(
    status: "inside" | "outside" | null,
    point: { x: number; y: number } | null
  ) {
    setDragStatus(status);
    const canvasEl = canvasRef.current;
    if (status === "inside" && point && canvasEl) {
      setHoveredSlot(slotFromClientY(canvasEl, point.y));
    } else {
      setHoveredSlot(null);
    }
  }

  function handleAddFlower(type: FlowerType, _clientX: number, clientY: number) {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const occupied = new Set(items.map((i) => i.slotIndex));
    if (occupied.size >= MAX_SLOTS) return; // kağıt dolu, yer yok

    const targetSlot = slotFromClientY(canvasEl, clientY);
    const slot = findNearestFreeSlot(targetSlot, occupied);
    if (slot === null) return;

    const newItem: PlacedItem = {
      id: `${type}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      type,
      slotIndex: slot,
      note: "",
      rotation: Math.random() * 4 - 2,
    };

    setItems((prev) => [...prev, newItem]);
  }

  function handleSlotChange(id: string, clientY: number) {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const targetSlot = slotFromClientY(canvasEl, clientY);

    setItems((prev) => {
      const current = prev.find((i) => i.id === id);
      if (!current || current.slotIndex === targetSlot) return prev;

      const occupant = prev.find((i) => i.slotIndex === targetSlot && i.id !== id);
      if (occupant) {
        // Hedef slot dolu: iki çiçeğin yerini birbirleriyle değiştir (sıralama).
        return prev.map((i) => {
          if (i.id === id) return { ...i, slotIndex: targetSlot };
          if (i.id === occupant.id) return { ...i, slotIndex: current.slotIndex };
          return i;
        });
      }

      return prev.map((i) => (i.id === id ? { ...i, slotIndex: targetSlot } : i));
    });
  }

  function handleDeleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleNoteChange(id: string, note: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  }

  function handleClearFlowers() {
    setItems([]);
  }

  function handleClearNotes() {
    setItems((prev) => prev.map((item) => ({ ...item, note: "" })));
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden md:flex-row">
      {/* Masaüstü: sabit sol panel */}
      <div className="hidden md:block md:h-full">
        <Sidebar
          canvasRef={canvasRef}
          onAddFlower={handleAddFlower}
          onDragStatusChange={handleDragStatusChange}
          onClearFlowers={handleClearFlowers}
          onClearNotes={handleClearNotes}
          hasItems={items.length > 0}
          hasNotes={items.some((item) => item.note.trim().length > 0)}
        />
      </div>

      <Canvas
        ref={canvasRef}
        items={items}
        onSlotChange={handleSlotChange}
        onNoteChange={handleNoteChange}
        onDeleteItem={handleDeleteItem}
        dragStatus={dragStatus}
        hoveredSlot={hoveredSlot}
      />

      {/* Mobil: alttan açılan çekmece + yüzen buton */}
      <div className="md:hidden">
        <button
          onClick={() => setMobilePanelOpen((prev) => !prev)}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-ui text-sm font-semibold text-paper shadow-paper"
        >
          {mobilePanelOpen ? "Kapat ✕" : "Çiçek Ekle 🌸"}
        </button>

        <AnimatePresence>
          {mobilePanelOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[58vh] overflow-y-auto rounded-t-3xl shadow-paper"
            >
              <div className="sticky top-0 z-10 flex justify-center bg-desk pb-1 pt-2">
                <span className="h-1 w-10 rounded-full bg-ink/15" />
              </div>
              <Sidebar
                canvasRef={canvasRef}
                onAddFlower={handleAddFlower}
                onDragStatusChange={handleDragStatusChange}
                onClearFlowers={handleClearFlowers}
                onClearNotes={handleClearNotes}
                hasItems={items.length > 0}
                hasNotes={items.some((item) => item.note.trim().length > 0)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
