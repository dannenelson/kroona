# Rapport brief 26: Genomskinlig lightbox, stilla detaljvy

- Lightboxens egen opaka bakgrund är borttagen. Bibliotekets backdrop är enda mörka lagret, med en token: `motion.lightboxBackdropOpacity` 0,88 (`overlay.lightboxBg`). I simulatorn skymtar detaljvyn ovanför och under bilden, och bilden är tydligt i fokus. Den följer fortfarande swipe-stängningens avstånd och utfart (`lightboxBackdrop`).
- Detaljvyn bakom skalas inte längre vid öppning och stängning (lightboxens non-focused-gren returnerar bara djupsynligheten). `motion.zoomBackgroundScale` är kvar, eftersom kort → detalj använder den.
- Verifierat: tsc och iOS-export. Ingen debug-rest finns kvar. `docs/design.md` §8c och §8d är uppdaterade.
- Kräver enhet: hur genomskinligheten känns mot ljust tema och under swipe-stängningen.
