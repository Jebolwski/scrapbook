"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";
import { FlowerType, MAX_SLOTS, PlacedItem } from "@/types";

const STORAGE_KEY = "ani-panosu-state-v1";

/** Bir Y ekran koordinatını, kağıdın 5 eşit slotundan hangisine denk geldiğine çevirir. */
function slotFromClientY(canvasEl: HTMLDivElement, clientY: number): number {
  const rect = canvasEl.getBoundingClientRect();
  const relativeY = clientY - rect.top;
  const raw = Math.floor((relativeY / rect.height) * MAX_SLOTS);
  return Math.min(MAX_SLOTS - 1, Math.max(0, raw));
}

/** Hedef slot doluysa, en yakın boş slotu (varsa) bulur. */
function findNearestFreeSlot(
  target: number,
  occupied: Set<number>,
): number | null {
  if (!occupied.has(target)) return target;
  for (let d = 1; d < MAX_SLOTS; d++) {
    if (target - d >= 0 && !occupied.has(target - d)) return target - d;
    if (target + d < MAX_SLOTS && !occupied.has(target + d)) return target + d;
  }
  return null;
}

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Her biri kendi çiçek/not koleksiyonuna sahip sayfalar. F5'te kaybolmasın
  // diye localStorage'a yazılır; ilk render'da SSR ile uyuşmazlık yaşamamak
  // için varsayılan olarak tek boş sayfayla başlar, gerçek veri mount
  // sonrası bir efektle yüklenir.
  const [pages, setPages] = useState<PlacedItem[][]>([[]]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const items = pages[currentPage] ?? [];

  // Kurutulmuş çiçek sürüklenirken imlecin A4 kağıdına göre konumunu
  // izler: "inside" (kağıdın üzerinde) / "outside" (kağıdın dışında) / null (sürükleme yok)
  const [dragStatus, setDragStatus] = useState<"inside" | "outside" | null>(
    null,
  );
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  // Telefonda sol panel yerine alttan açılan bir çekmece kullanılır.
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  // Panonun köşesindeki küçük ipucu notu; kullanıcı kapatana kadar durur.
  const [showTip, setShowTip] = useState(true);

  // Kayıtlı sayfaları yükle (yalnızca istemcide).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          pages?: PlacedItem[][];
          currentPage?: number;
        };
        if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          setPages(parsed.pages);
          setCurrentPage(
            Math.min(
              Math.max(parsed.currentPage ?? 0, 0),
              parsed.pages.length - 1,
            ),
          );
        }
      }
    } catch {
      // bozuk/okunamayan veri varsa sessizce varsayılana devam et
    }
    setHydrated(true);
  }, []);

  // Değişiklikleri kaydet (yükleme tamamlanmadan üzerine yazmayalım).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ pages, currentPage }),
      );
    } catch {
      // localStorage dolu ya da devre dışı olabilir, sessizce yut
    }
  }, [pages, currentPage, hydrated]);

  function updateCurrentPageItems(
    updater: (items: PlacedItem[]) => PlacedItem[],
  ) {
    setPages((prev) =>
      prev.map((pageItems, idx) =>
        idx === currentPage ? updater(pageItems) : pageItems,
      ),
    );
  }

  function handleDragStatusChange(
    status: "inside" | "outside" | null,
    point: { x: number; y: number } | null,
  ) {
    setDragStatus(status);
    const canvasEl = canvasRef.current;
    if (status === "inside" && point && canvasEl) {
      setHoveredSlot(slotFromClientY(canvasEl, point.y));
    } else {
      setHoveredSlot(null);
    }
  }

  function handleAddFlower(
    type: FlowerType,
    _clientX: number,
    clientY: number,
  ) {
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

    updateCurrentPageItems((prevItems) => [...prevItems, newItem]);
  }

  function handleSlotChange(id: string, clientY: number) {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const targetSlot = slotFromClientY(canvasEl, clientY);

    updateCurrentPageItems((prevItems) => {
      const current = prevItems.find((i) => i.id === id);
      if (!current || current.slotIndex === targetSlot) return prevItems;

      const occupant = prevItems.find(
        (i) => i.slotIndex === targetSlot && i.id !== id,
      );
      if (occupant) {
        // Hedef slot dolu: iki çiçeğin yerini birbiriyle değiştir (sıralama).
        return prevItems.map((i) => {
          if (i.id === id) return { ...i, slotIndex: targetSlot };
          if (i.id === occupant.id)
            return { ...i, slotIndex: current.slotIndex };
          return i;
        });
      }

      return prevItems.map((i) =>
        i.id === id ? { ...i, slotIndex: targetSlot } : i,
      );
    });
  }

  function handleNoteChange(id: string, note: string) {
    updateCurrentPageItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, note } : item)),
    );
  }

  function handleClearFlowers() {
    updateCurrentPageItems(() => []);
  }

  function handleClearNotes() {
    updateCurrentPageItems((prevItems) =>
      prevItems.map((item) => ({ ...item, note: "" })),
    );
  }

  function handleDeleteItem(id: string) {
    updateCurrentPageItems((prevItems) =>
      prevItems.filter((item) => item.id !== id),
    );
  }

  function handleFlowerPlaced() {
    // Çiçek başarıyla kağıda konduğunda mobil çekmece tekrar açılmasın,
    // kapalı kalsın; kullanıcı isterse butona basıp yeniden açar.
    setDragActive(false);
    setMobilePanelOpen(false);
  }

  function goToPrevPage() {
    setCurrentPage((p) => Math.max(0, p - 1));
  }

  function goToNextPage() {
    setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
  }

  function addPage() {
    setPages((prev) => [...prev, []]);
    setCurrentPage(pages.length);
  }

  function deleteCurrentPage() {
    if (pages.length <= 1) return; // en az bir sayfa kalmalı
    const confirmed = window.confirm(
      "Bu sayfayı silmek istediğine emin misin? İçindeki çiçekler ve notlar da silinecek.",
    );
    if (!confirmed) return;

    const newLength = pages.length - 1;
    setPages((prev) => prev.filter((_, idx) => idx !== currentPage));
    setCurrentPage((p) => Math.min(p, newLength - 1));
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden md:flex-row">
      {/* Masaüstü: sabit sol panel */}
      <motion.div
        initial={{ x: -32, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:block md:h-full"
      >
        <Sidebar
          canvasRef={canvasRef}
          onAddFlower={handleAddFlower}
          onDragStatusChange={handleDragStatusChange}
          onDragActiveChange={setDragActive}
          onFlowerPlaced={handleFlowerPlaced}
          onClearFlowers={handleClearFlowers}
          onClearNotes={handleClearNotes}
          hasItems={items.length > 0}
          hasNotes={items.some((item) => item.note.trim().length > 0)}
        />
      </motion.div>

      {/* Canvas ve sayfa kontrollerini kapsayan sağ alan */}
      <div className="relative h-full min-w-0 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="h-full w-full"
        >
          <Canvas
            ref={canvasRef}
            items={items}
            onSlotChange={handleSlotChange}
            onNoteChange={handleNoteChange}
            onDeleteItem={handleDeleteItem}
            dragStatus={dragStatus}
            hoveredSlot={hoveredSlot}
            showTip={showTip}
            onDismissTip={() => setShowTip(false)}
          />
        </motion.div>

        {/* Sayfa gezinme: sağ çalışma alanının (Canvas) üst ortasında durur */}
        <div className="pointer-events-none absolute inset-x-0 top-2 z-40 flex justify-center md:top-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pointer-events-auto flex max-w-[92vw] items-center gap-2 rounded-full bg-ink/90 px-3 py-2 text-paper shadow-paper backdrop-blur sm:gap-3 sm:px-4"
          >
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              aria-label="Önceki sayfa"
              className="px-1 font-ui text-lg leading-none disabled:opacity-30"
            >
              ‹
            </button>
            <span className="whitespace-nowrap font-ui text-xs tabular-nums">
              Sayfa {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === pages.length - 1}
              aria-label="Sonraki sayfa"
              className="px-1 font-ui text-lg leading-none disabled:opacity-30"
            >
              ›
            </button>
            <span className="mx-0.5 h-4 w-px bg-paper/25" />
            <button
              onClick={addPage}
              aria-label="Yeni sayfa ekle"
              className="whitespace-nowrap font-ui text-xs font-semibold"
            >
              + Sayfa
            </button>
            <span className="mx-0.5 h-4 w-px bg-paper/25" />
            <button
              onClick={deleteCurrentPage}
              disabled={pages.length <= 1}
              aria-label="Bu sayfayı sil"
              className="whitespace-nowrap font-ui text-xs font-semibold text-red-200 transition-colors hover:text-red-100 disabled:cursor-not-allowed disabled:text-paper/25"
            >
              Sayfayı Sil
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobil: alttan açılan çekmece + yüzen buton */}
      <div className="md:hidden">
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => setMobilePanelOpen((prev) => !prev)}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-ui text-sm font-semibold text-paper shadow-paper"
        >
          {mobilePanelOpen ? "Kapat ✕" : "Çiçek Ekle 🌸"}
        </motion.button>

        <AnimatePresence>
          {mobilePanelOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: dragActive ? "130%" : 0 }}
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
                onDragActiveChange={setDragActive}
                onFlowerPlaced={handleFlowerPlaced}
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
