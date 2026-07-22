"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { FLOWERS, FlowerIllustration } from "@/data/flowers";
import { FlowerType } from "@/types";

interface SidebarProps {
  canvasRef: RefObject<HTMLDivElement>;
  onAddFlower: (type: FlowerType, clientX: number, clientY: number) => void;
  onDragStatusChange: (
    status: "inside" | "outside" | null,
    point: { x: number; y: number } | null
  ) => void;
  onClearFlowers: () => void;
  onClearNotes: () => void;
  hasItems: boolean;
  hasNotes: boolean;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function Sidebar({
  canvasRef,
  onAddFlower,
  onDragStatusChange,
  onClearFlowers,
  onClearNotes,
  hasItems,
  hasNotes,
}: SidebarProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);
  const [isDried, setIsDried] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Kurutulan çiçek bir portal ile document.body'ye taşınır; bu sayede
  // sidebar'ın overflow-y-auto'su onu kesip klip etmez ve her zaman en üstte,
  // sınırlama olmadan sağdaki kağıda kadar sürüklenebilir.
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [fixedRect, setFixedRect] = useState<Rect | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isDried) {
      setFixedRect(null);
      return;
    }

    function measure() {
      const el = placeholderRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setFixedRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isDried, selectedFlower]);

  function handleGenerateClick() {
    setPanelOpen((prev) => !prev);
  }

  function handleSelectFlower(type: FlowerType) {
    setSelectedFlower(type);
    setIsDried(false);
  }

  function handleDry() {
    setIsDried(true);
  }

  function isPointInsideCanvas(x: number, y: number) {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return false;
    const rect = canvasEl.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  // Sürükleme sırasında her hareket: imleç kağıdın üzerinde mi değil mi,
  // bunu üst bileşene bildirerek kırmızı/yeşil geri bildirimi tetikler.
  function handleDrag(_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const inside = isPointInsideCanvas(info.point.x, info.point.y);
    onDragStatusChange(inside ? "inside" : "outside", { x: info.point.x, y: info.point.y });
  }

  function handleDragEnd(_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    onDragStatusChange(null, null);

    const canvasEl = canvasRef.current;
    if (!canvasEl || !selectedFlower) return;

    const { x, y } = info.point;
    const droppedInsideCanvas = isPointInsideCanvas(x, y);

    if (droppedInsideCanvas) {
      onAddFlower(selectedFlower, x, y);
      // Panoya eklendi: paneli sıfırla, kullanıcı yeni bir çiçek üretebilir.
      setSelectedFlower(null);
      setIsDried(false);
    }
    // Kağıdın dışına bırakılırsa dragSnapToOrigin önizlemeyi yerine geri döndürür.
  }

  return (
    <aside className="desk-texture flex h-full w-full flex-col gap-6 overflow-y-auto border-r border-black/5 px-7 py-10 md:w-[320px] md:min-w-[320px]">
      <header className="mb-1">
        <p className="font-ui text-[11px] uppercase tracking-[0.25em] text-inkSoft">
          Anı Panosu
        </p>
        <h1 className="font-display text-3xl italic text-ink">Çiçek Köşesi</h1>
      </header>

      {/* Çiçek Üret */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleGenerateClick}
          className="group flex items-center justify-between rounded-full bg-ink px-5 py-3 font-ui text-sm font-semibold text-paper shadow-soft transition-colors hover:bg-ink/90"
        >
          Çiçek Üret
          <motion.span
            animate={{ rotate: panelOpen ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-lg leading-none"
          >
            +
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-3 pt-1">
                {FLOWERS.map((flower) => (
                  <button
                    key={flower.type}
                    onClick={() => handleSelectFlower(flower.type)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 transition-all ${
                      selectedFlower === flower.type
                        ? "border-ink/40 bg-paper shadow-soft"
                        : "border-black/5 bg-paper/60 hover:bg-paper"
                    }`}
                  >
                    <FlowerIllustration type={flower.type} className="h-10 w-10" />
                    <span className="font-ui text-xs text-ink">{flower.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Önizleme + Kurutma alanı */}
      <AnimatePresence mode="wait">
        {selectedFlower && (
          <motion.div
            key={selectedFlower}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-black/5 bg-paper/70 p-6 shadow-soft"
          >
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-inkSoft">
              {isDried ? "Kurutuldu — kağıda sürükle" : "Önizleme"}
            </p>

            {/* Yer tutucu: düzendeki boşluğu korur. Kurutulunca görünmez olur,
                çünkü gerçek (sürüklenebilir) çiçek artık portal içinde,
                tam bu konumun üzerinde render ediliyor. */}
            <div
              ref={placeholderRef}
              className="flex h-32 w-32 items-center justify-center rounded-xl"
              style={{ visibility: isDried ? "hidden" : "visible" }}
            >
              {!isDried && (
                <FlowerIllustration
                  type={selectedFlower}
                  dried={false}
                  className="h-28 w-28 drop-shadow-sm"
                />
              )}
            </div>

            {!isDried ? (
              <button
                onClick={handleDry}
                className="rounded-full border border-twine/50 bg-transparent px-4 py-2 font-ui text-xs font-semibold text-twine transition-colors hover:bg-twine/10"
              >
                Çiçeği Kurut
              </button>
            ) : (
              <p className="text-center font-hand text-lg text-inkSoft">
                Şimdi tutup kağıda bırak
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2 border-t border-black/5 pt-5">
        <button
          onClick={onClearFlowers}
          disabled={!hasItems}
          className="rounded-full border border-black/10 bg-transparent px-4 py-2 font-ui text-xs font-semibold text-ink transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        >
          Çiçekleri Temizle
        </button>
        <button
          onClick={onClearNotes}
          disabled={!hasNotes}
          className="rounded-full border border-black/10 bg-transparent px-4 py-2 font-ui text-xs font-semibold text-ink transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        >
          Yazıları Temizle
        </button>
      </div>

      <div className="mt-auto pt-6 text-center">
        <p className="font-hand text-xl text-inkSoft">
          küçük anları kurutup saklamak için
        </p>
      </div>

      {/* Sürüklenebilir kurutulmuş çiçek: body'ye portallanır, hiçbir
          konteynerin overflow/z-index kısıtına takılmaz. */}
      {mounted &&
        isDried &&
        selectedFlower &&
        fixedRect &&
        createPortal(
          <motion.div
            drag
            dragSnapToOrigin
            dragElastic={0.15}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.08, cursor: "grabbing" }}
            className="flex cursor-grab touch-none items-center justify-center rounded-xl"
            style={{
              position: "fixed",
              left: fixedRect.left,
              top: fixedRect.top,
              width: fixedRect.width,
              height: fixedRect.height,
              zIndex: 9999,
              touchAction: "none",
            }}
          >
            <FlowerIllustration
              type={selectedFlower}
              dried
              className="h-28 w-28 drop-shadow-sm"
            />
          </motion.div>,
          document.body
        )}
    </aside>
  );
}
