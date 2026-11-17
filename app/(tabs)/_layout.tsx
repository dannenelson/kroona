import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hem' }} />
      <Tabs.Screen name="feed" options={{ title: 'Flöde' }} />
      <Tabs.Screen name="find" options={{ title: 'Hitta' }} />
      <Tabs.Screen name="saved" options={{ title: 'Sparat' }} />
    </Tabs>
  );
}