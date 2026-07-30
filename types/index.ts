export type FlowerType =
  | "gul"
  | "beyaz-gul"
  | "lale"
  | "yasemin"
  | "yasemin-mavi"
  | "yasemin-kirmizi"
  | "orkide"
  | "menekse"
  | "lilyum"
  | "zambak"
  | "sakayik"
  | "husnuyusuf";

export interface FlowerMeta {
  type: FlowerType;
  label: string;
  freshColor: string;
  driedColor: string;
}

/** Kağıt 5 eşit yatay sıraya (slota) bölünür; her slotta en fazla bir çiçek olabilir. */
export const MAX_SLOTS = 5;

/**
 * Bir çiçeğin sağdaki A4 kağıdına yerleştirilmiş halini temsil eder.
 * Kağıda sürüklenen çiçekler her zaman kurutulmuş haldedir ve sabit bir
 * slotIndex'e (0 - MAX_SLOTS-1) yerleşir; çakışma bu şekilde engellenir.
 */
export interface PlacedItem {
  id: string;
  type: FlowerType;
  slotIndex: number;
  note: string;
  rotation: number;
}