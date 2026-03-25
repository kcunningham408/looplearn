import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

/**
 * Sparkle burst — tiny animated particles that pop around a component.
 * Use for micro-rewards: correct answers, badge unlocks, level ups.
 */
const PARTICLE_COUNT = 8;
const SPARKLE_EMOJIS = ['✨', '⭐', '💫', '🌟', '💛'];

export const Sparkle = ({ active = false, color = '#FCD34D', size = 120 }) => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!active) return;
    const anims = particles.map((p, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const dist = size * 0.4 + Math.random() * size * 0.2;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const delay = i * 40;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(p.opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(p.scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
          Animated.timing(p.translateX, { toValue: dx, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(p.translateY, { toValue: dy, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(p.rotate, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
        Animated.timing(p.opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]);
    });

    Animated.parallel(anims).start(() => {
      // Reset
      particles.forEach(p => {
        p.opacity.setValue(0);
        p.scale.setValue(0);
        p.translateX.setValue(0);
        p.translateY.setValue(0);
        p.rotate.setValue(0);
      });
    });
  }, [active]);

  if (!active) return null;

  return (
    <View style={[st.container, { width: size, height: size }]} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.Text
          key={i}
          style={[
            st.particle,
            {
              opacity: p.opacity,
              transform: [
                { translateX: p.translateX },
                { translateY: p.translateY },
                { scale: p.scale },
                {
                  rotate: p.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${120 + Math.random() * 240}deg`],
                  }),
                },
              ],
            },
          ]}
        >
          {SPARKLE_EMOJIS[i % SPARKLE_EMOJIS.length]}
        </Animated.Text>
      ))}
    </View>
  );
};

const st = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    fontSize: 16,
  },
});
