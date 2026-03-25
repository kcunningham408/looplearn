import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';
import { AIPracticeScreen } from '../screens/AIPracticeScreen';
import { LoopDetail } from '../screens/LoopDetail';
import { MathHome } from '../screens/MathHome';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ParentDashboard } from '../screens/ParentDashboard';
import { ProfileScreen } from '../screens/ProfileScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { ScienceHome } from '../screens/ScienceHome';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useGameStore } from '../store/useGameStore';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Math: { focused: 'calculator', unfocused: 'calculator-outline', color: COLORS.math },
  Science: { focused: 'flask', unfocused: 'flask-outline', color: COLORS.science },
  Rewards: { focused: 'trophy', unfocused: 'trophy-outline', color: COLORS.gold },
  Profile: { focused: 'person', unfocused: 'person-outline', color: COLORS.primary },
  Settings: { focused: 'settings', unfocused: 'settings-outline', color: COLORS.textSecondary },
};

const LoopLearnTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.bg,
    card: COLORS.bgElevated,
    text: COLORS.textPrimary,
    border: COLORS.divider,
    primary: COLORS.primary,
  },
};

const SplashScreen = () => (
  <View style={splashSt.container}>
    <LinearGradient
      colors={['rgba(99,102,241,0.15)', 'rgba(139,92,246,0.08)', 'transparent']}
      style={splashSt.glow}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <View style={splashSt.logoRing}>
      <LinearGradient
        colors={COLORS.brandGradient}
        style={splashSt.logoGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={splashSt.emoji}>🧠</Text>
      </LinearGradient>
    </View>
    <Text style={splashSt.title}>LoopLearn</Text>
    <Text style={splashSt.tagline}>Learning is an adventure!</Text>
    <ActivityIndicator color={COLORS.primary} size="small" style={{ marginTop: 24 }} />
  </View>
);

const splashSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%' },
  logoRing: { marginBottom: 20, borderRadius: 40, overflow: 'hidden' },
  logoGradient: { width: 100, height: 100, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 52 },
  title: { ...TYPE.hero, ...TYPE.black, color: COLORS.textPrimary, letterSpacing: -1 },
  tagline: { ...TYPE.md, color: COLORS.primaryLight, marginTop: 6 },
});

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const icons = TAB_ICONS[route.name];
        const iconName = focused ? icons.focused : icons.unfocused;
        const iconColor = focused ? icons.color : 'rgba(255,255,255,0.40)';
        return <Ionicons name={iconName} size={28} color={iconColor} />;
      },
      tabBarActiveTintColor: TAB_ICONS[route.name]?.color || COLORS.white,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.40)',
      tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      tabBarStyle: {
        backgroundColor: COLORS.bgElevated,
        borderTopColor: 'rgba(255,255,255,0.08)',
        borderTopWidth: 1,
        paddingTop: 10,
        height: Platform.OS === 'web' ? 64 : Platform.OS === 'ios' ? 96 : 72,
      },
    })}>
    <Tab.Screen name="Math" component={MathHome} />
    <Tab.Screen name="Science" component={ScienceHome} />
    <Tab.Screen name="Rewards" component={RewardsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  const hydrateStore = useGameStore(state => state.hydrateStore);
  const hydrated = useGameStore(state => state.hydrated);
  const hasOnboarded = useGameStore(state => state.hasOnboarded);

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  if (!hydrated) return <SplashScreen />;

  return (
    <NavigationContainer theme={LoopLearnTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.bgElevated },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: COLORS.bg },
        }}>
        {!hasOnboarded && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        )}
        <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="LoopDetail" component={LoopDetail} options={{ title: 'Loop Detail' }} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} options={{ title: 'Lesson', headerBackTitle: 'Back' }} />
        <Stack.Screen name="AIPractice" component={AIPracticeScreen} options={{ title: 'AI Practice', headerBackTitle: 'Back' }} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboard} options={{ title: 'Parent Area', headerBackTitle: 'Back' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
