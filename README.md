# Anı Panosu — Scrapbook

Next.js 15 + React 18 + Tailwind CSS + Framer Motion ile geliştirilmiş, tek ekranlı
(canvas) interaktif anı panosu.

## Çalıştırma

```bash
npm install
npm run dev
```

`http://localhost:3000` adresini açın.

## Yapı

```
app/
  layout.tsx      Font tanımları (Cormorant Garamond, Caveat, Nunito)
  page.tsx         Ana ekran — state burada tutulur (items, canvasRef)
  globals.css      Kağıt/masa dokuları, scrollbar, textarea stilleri
components/
  Sidebar.tsx      Sol kontrol paneli — üret / seç / kurut / sürükle akışı
  Canvas.tsx        Sağ A4 kağıdı — drop-zone, forwardRef ile paylaşılan ref
  FlowerItem.tsx    Kağıt üzerindeki tek bir kurutulmuş çiçek + not kutusu
data/
  flowers.tsx       El çizimi SVG çiçek illüstrasyonları (taze/kuru varyantları)
types/
  index.ts          FlowerType, PlacedItem tipleri
```

## Akış

1. **Çiçek Üret** butonu → Gül / Lale / Yasemin seçenekleri açılır.
2. Bir çiçek seçilince panelde **taze** hâliyle önizleme belirir.
3. **Çiçeği Kurut** → SVG'ye sepya/doygunluk filtresi uygulanır, çiçek artık
   sürüklenebilir hâle gelir (`framer-motion` `drag`).
4. Kurutulmuş çiçek A4 kağıdının üzerine bırakılınca (`Sidebar`'daki
   `onDragEnd`, `canvasRef.getBoundingClientRect()` ile kağıdın sınırlarını
   kontrol eder) kağıda yeni bir `PlacedItem` eklenir ve panel sıfırlanır.
5. Kağıt üzerindeki her çiçeğin yanında otomatik olarak el yazısı fontlu
   (`Caveat`) şeffaf bir `textarea` belirir; kullanıcı not yazabilir.
6. Kağıttaki çiçekler de ayrıca sürüklenip yeniden konumlandırılabilir
   (`dragConstraints={canvasRef}`).

State, `app/page.tsx` içinde `PlacedItem[]` dizisi olarak tutulur:

```ts
{ id, type, x, y, note, rotation }
```

## Not

Bu ortamda (sandbox) `fonts.googleapis.com` erişimi kapalı olduğu için build
sırasında font indirme adımı başarısız olabilir — kendi makinenizde internet
erişimi olduğundan `next/font/google` sorunsuz çalışacaktır. Bu, kod
kalitesiyle ilgili bir sorun değil, yalnızca test ortamının ağ kısıtıdır.
