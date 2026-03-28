import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { AppLogo, VibeCMDBadge } from '../components/AppLogo';
import COLORS from '../config/colors';
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

const SplashScreen = () => {
  const pulseAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // Gentle pulse on logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.7, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={splashSt.container}>
      {/* Top glow */}
      <LinearGradient
        colors={['rgba(99,102,241,0.20)', 'rgba(139,92,246,0.10)', 'transparent']}
        style={splashSt.glow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {/* Bottom glow */}
      <LinearGradient
        colors={['transparent', 'rgba(236,72,153,0.08)']}
        style={splashSt.glowBottom}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <AppLogo size="xl" showText showTagline layout="vertical" />
      </Animated.View>

      <Animated.View style={{ opacity: pulseAnim, marginTop: 32 }}>
        <ActivityIndicator color={COLORS.primary} size="small" />
      </Animated.View>

      <VibeCMDBadge style={splashSt.badge} />
    </View>
  );
};

const splashSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%' },
  glowBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%' },
  badge: { position: 'absolute', bottom: 50, left: 40, right: 40 },
});

const TabIcon = ({ route, focused }) => {
  const icons = TAB_ICONS[route.name];
  const iconName = focused ? icons.focused : icons.unfocused;
  const iconColor = focused ? icons.color : 'rgba(255,255,255,0.35)';
  return (
    <View style={tabIconSt.wrapper}>
      {focused && (
        <View style={[tabIconSt.activeIndicator, { backgroundColor: `${icons.color}20` }]} />
      )}
      <Ionicons name={iconName} size={24} color={iconColor} />
    </View>
  );
};

const tabIconSt = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
  },
  activeIndicator: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
});

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => <TabIcon route={route} focused={focused} />,
      tabBarActiveTintColor: TAB_ICONS[route.name]?.color || COLORS.white,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: -2 },
      tabBarStyle: {
        backgroundColor: COLORS.bgElevated,
        borderTopColor: COLORS.divider,
        borderTopWidth: 1,
        paddingTop: 8,
        height: Platform.OS === 'web' ? 64 : Platform.OS === 'ios' ? 92 : 68,
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
        <Stack.Screen name="LoopDetail" component={LoopDetail} options={{ title: 'Loop Detail', headerBackTitle: 'Back' }} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIPractice" component={AIPracticeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboard} options={{ title: 'Parent Area', headerBackTitle: 'Back' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
