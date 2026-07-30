/**
 * Ses dosyaları /public/sounds içine konur:
 *   - dry.mp3,   dry-2.mp3,   dry-3.mp3   → "Çiçeği Kurut" butonuna basılınca
 *   - place.mp3, place-2.mp3, place-3.mp3 → çiçek kağıda başarıyla bırakılınca
 *
 * Çeşitlilik için her tetiklemede sıradaki dosya çalınır (round-robin):
 * dry → dry-2 → dry-3 → dry → ... Dosyalardan biri eksikse audio.play()
 * reddedilir; bunu sessizce yutuyoruz, uygulama hatasız çalışmaya devam eder.
 */
const DRY_SOUND_SRCS = ["/sounds/dry.mp3", "/sounds/dry-2.mp3", "/sounds/dry-3.mp3"];
const PLACE_SOUND_SRCS = [
    "/sounds/place.mp3",
    "/sounds/place-2.mp3",
    "/sounds/place-3.mp3",
];

let dryIndex = 0;
let placeIndex = 0;

function play(src: string, enabled: boolean) {
    if (!enabled || typeof window === "undefined") return;
    try {
        const audio = new Audio(src);
        audio.volume = 0.55;
        void audio.play().catch(() => {
            // dosya henüz yok / tarayıcı otomatik oynatmayı engellemiş olabilir
        });
    } catch {
        // sessizce geç
    }
}

export function playDrySound(enabled: boolean) {
    const src = DRY_SOUND_SRCS[dryIndex % DRY_SOUND_SRCS.length];
    dryIndex++;
    play(src, enabled);
}

export function playPlaceSound(enabled: boolean) {
    const src = PLACE_SOUND_SRCS[placeIndex % PLACE_SOUND_SRCS.length];
    placeIndex++;
    play(src, enabled);
}