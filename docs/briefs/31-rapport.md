# Rapport brief 31: Samma tryckrespons på alla kort

- **En implementation:** `hooks/useCardPress` (pixelkrympning via `pressInsetPx`, `pressScaleMin`/`pressScaleMax`, in snabbt och ut med fjäder via `usePressAnimation`, ingen skala med Minska rörelse). Den har `liftForMenu`/`menuClosed`, så att tryckfjädern inte kämpar med menyns lyft. Används av ProductCard (logiken flyttad dit, inte kopierad) och av korten nedan.
- **Ändrade kort (TouchableOpacity med opacitet → Pressable med krympning):** `PartnerCard` (Du följer, Samlingar-hyllan), `ProfileCard` (Fler varumärken, öppnar Partnerdetalj) och `CollectionCard` (Populära samlingar, öppnar inget än). Kontextmenyn och zoomen är oförändrade. PartnerCard nollställer skalan när menyn lyfts.
- **Inte ändrade:** `ClusterCard` och `MixCard` öppnar inget, och `LinkCard` öppnar en dialog i Hitta, ingen detaljvy. De har fortfarande opacitetsfeedback (flaggas).
- **Verifierat i simulatorn:** korten renderar som förut. Tryck krymper kortet utan opacitetsändring och öppnar Partnerdetalj. tsc och iOS-export är gröna, och ingen debug-rest finns kvar. Känslan i tryck och långtryck kräver enhet.
- `docs/design.md`: raden "Nedtryckt" gäller nu alla kort med en implementation, och de inaktuella värdena (7 px, 0,96–0,985) är rättade till tokens (4 px, 0,975–0,99).
