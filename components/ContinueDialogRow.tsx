import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../theme';
import LinkCard from './LinkCard';
import { PRODUCT_IMAGES } from '../data/productImages';

// "Fortsätt din dialog" — ingen rubrik ovanför (matchar mockupen exakt,
// kroona_hem_forslag_v3.html visar bara ett bart LinkCard direkt under
// sökfältet).
//
// VIKTIGT: Hitta sparar inga konversationer — varje session är flyktig
// (docs/kroona_status_roadmap.md, avsnitt 7 och 12). Den här raden är
// statisk dummy-data. Riktig villkorad logik (visa raden bara om
// användaren faktiskt har en pågående/nyligen avslutad dialog att
// återuppta, dölj den helt annars — mockupens egen "villkorad"-anteckning)
// kräver riktig chatthistorik och byggs i Fas 1.
export default function ContinueDialogRow() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <LinkCard
        variant="horizontal"
        title="Vinterjacka, hållbar, runt 2000 kr"
        subtitle="Fortsätt i Hitta"
        imageUrl={PRODUCT_IMAGES.ponchoKnit}
        style={styles.card}
        onPress={() => router.push('/find')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.screenMargin,
  },
  card: {
    width: '100%',
  },
});
