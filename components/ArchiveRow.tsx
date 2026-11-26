// Rad för en arkivpost (brief 66): Hittas hylla "Tidigare" och Arkiv. Ikon
// i en rund ruta (`stars` = dialog, `search` = sökning), titel/sökord och
// kort tid ("Idag", "Igår", "12 nov"). Tryck öppnar dialogen (återupptas)
// eller sökresultatet. Med `onRemove`: långt tryck ger menyn Öppna / Ta bort.
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, useTheme, radius, listRow, iconSize } from '../theme';
import { archiveTimeLabel, type ArchiveEntry } from '../lib/archive';
import ListRow from './ListRow';
import Icon from './Icon';

export function useOpenArchiveEntry() {
  const router = useRouter();
  return (entry: ArchiveEntry) =>
    entry.kind === 'dialog'
      ? router.push({ pathname: '/dialog', params: { id: entry.id } })
      : router.push({ pathname: '/results', params: { q: entry.query } });
}

export default function ArchiveRow({ entry, onRemove }: { entry: ArchiveEntry; onRemove?: () => void }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const open = useOpenArchiveEntry();
  const isDialog = entry.kind === 'dialog';
  const title = isDialog ? entry.title : entry.query;
  const time = archiveTimeLabel(entry.at);
  return (
    <ListRow
      compact
      title={title}
      subtitle={`${isDialog ? 'Dialog' : 'Sökning'} · ${time}`}
      thumb={
        <View style={styles.thumb}>
          <Icon name={isDialog ? 'stars' : 'search'} color={colors.textPrimary} size={iconSize.md} />
        </View>
      }
      thumbRadius={radius.full}
      onPress={() => open(entry)}
      menuItems={
        onRemove
          ? [
              { label: 'Öppna', icon: 'chevron-right', navigation: true, onPress: () => open(entry) },
              { label: 'Ta bort', icon: 'trash', onPress: onRemove },
            ]
          : undefined
      }
      accessibilityLabel={`${isDialog ? 'Dialog' : 'Sökning'}: ${title}, ${time}`}
    />
  );
}

const useStyles = makeStyles((t) => ({
  thumb: {
    width: listRow.compactThumb,
    height: listRow.compactThumb,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surfaceRaised,
  },
}));
