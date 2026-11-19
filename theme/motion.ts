// Rörelse (docs/design.md §0 och §8). Reduce motion ska alltid respekteras.
export const motion = {
  duration: { fast: 150, base: 250, slow: 400 },
  easing: [0.2, 0, 0, 1] as const,
  spring: { damping: 20, stiffness: 220, mass: 1 },
  /** Nedtryckt: djupare yta (colors.pressed) plus nedskalning. */
  pressedScale: 0.96,
  /** Nedtryckt i navigationen. */
  navPressedScale: 0.92,
  /** Lyft kort i kontextmenyn: alltid större än originalet (S och M). */
  liftScale: 1.04,
  /** Lyft för det största kortet (L): minst, men fortfarande märkbart. */
  liftScaleLarge: 1.02,
  /** Tryck på kort i pixlar (brief 07): total krympning i bredd, så att stora
   *  kort inte tappar fler pixlar än små. Skalan kläms mellan min och max. */
  pressInsetPx: 4,
  pressScaleMin: 0.975,
  pressScaleMax: 0.99,
  /** Inaktiv. */
  disabledOpacity: 0.35,
  /** Nedtryckt text-flik (text utan yta). */
  pressedTextOpacity: 0.55,
  /** Tryck in: snabb, mjuk övergång till nedtryckt (ms). */
  pressIn: 90,
  /** Släpp: lätt fjäder tillbaka. */
  pressOutSpring: { damping: 14, stiffness: 320, mass: 0.6 },
  /** Text-flikar: tonar text och understrykning vid flikbyte (ms). */
  tabFade: 160,
  /** Understrykningen växer från mitten från denna bredd. */
  tabUnderlineFrom: 0.6,
  /** IconButton vald: ikonen "poppar" 1 → popScale → 1 (bara vid markering). */
  popScale: 1.15,
  popIn: 90,
  popSpring: { damping: 10, stiffness: 300, mass: 0.6 },
  /** Toast: hur länge den syns (ms) och hur långt den glider in (px). */
  toastDuration: 2200,
  toastSlide: 24,
  /** Produktdetalj: informationen tonas in under övergångens sista del (progress 0,75 → 1). */
  detailRevealFrom: 0.75,
  /** Hierarkirörelsen (spik brief 18): zoomens fjädrar, bibliotekets
   *  Specs.Zoom-värden (öppna lugnt, stäng med kort efterfjädring). */
  zoomSpec: {
    open: { stiffness: 1000, damping: 500, mass: 3, overshootClamping: false },
    close: { stiffness: 1100, damping: 98, mass: 3, overshootClamping: false },
  },
  /** Stängning vid släpp (Produktdetalj): biblioteket stänger om
   *  förflyttning/skärmhöjd + hastighet/skärmhöjd × detta > 0,5 (fast tröskel i
   *  react-native-screen-transitions). 1,0 gör att ett lugnt drag på ca 20–25 %
   *  stänger, ett kort (< 10 %) fjädrar tillbaka och flick följer riktningen.
   *  Bibliotekets standard är 0,3. */
  dismissVelocityImpact: 1.0,
  /** Distansbaserad stängning (kräver patchen av react-native-screen-transitions,
   *  se CLAUDE.md): ett drag nedåt på minst så här många px stänger vid släpp,
   *  som Pinterest (ca 50 px), om man inte flickar tillbaka uppåt snabbare än
   *  dismissCancelVelocity (px/s). Kortare drag avgörs av regeln ovan. */
  dismissMinDistance: 45,
  dismissCancelVelocity: 300,
  /** Aktivering av stängning nedåt (patchat bibliotek): ingenting avgörs förrän
   *  fingret rört sig så här många px; sedan aktiveras gesten om rörelsen är
   *  mer nedåt än i sidled (|dy| > |dx|, ca 45°), annars avvisas den.
   *  Biblioteket: 10 px nedåt och avvisning vid 20 px sidled (1 px sidled först
   *  avvisade direkt). */
  dismissActivationDistance: 7,
  /** Skärmen bakom Produktdetalj ligger lätt INZOOMAD (1 → 1,05 vid öppning,
   *  tillbaka mot 1 när man drar/stänger). Dämpningen är mörkare än
   *  bibliotekets standard (0,9375 utzoomad, svart 0,45), närmare Pinterest. */
  zoomBackgroundScale: 1.05,
  zoomBackdropOpacity: 0.65,
  /** Remsa vid vänsterkanten där kantswipe stänger Produktdetalj. */
  dismissEdgeWidth: 24,
  /** Lightbox (brief 19): nypzoom 1–4x, dubbeltryck växlar 1x ↔ 2,5x,
   *  bilden fjädrar tillbaka till 1x under 1x. Bakgrunden (detaljvyn) dämpas
   *  hårdare än vid kort → detalj, eftersom lightboxen är mörk. */
  lightboxMaxZoom: 4,
  lightboxDoubleTapZoom: 2.5,
  lightboxBackdropOpacity: 0.85,
  /** Äldre tryck-feedback för komponenter som inte gjorts om än. */
  pressedOpacity: 0.8,
  /** Långt tryck öppnar kontextmenyn. */
  longPressMs: 450,
  /** Kontextmenyn: lyft kort och meny fjädrar in, stängning samma väg tillbaka. */
  menuSpring: { damping: 18, stiffness: 260, mass: 1 },
  /** Menyn växer från kortet: startskala och glidavstånd (px) mot kortet. */
  menuEnterScale: 0.6,
  menuOffset: 12,
  /** Stängning utan fjäder (reduce motion, och bakgrundens toning). */
  menuFadeDuration: 180,
} as const;
