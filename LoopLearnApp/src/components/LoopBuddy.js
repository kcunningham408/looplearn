import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { getGradeTheme } from '../config/gradeThemes';
import { useGameStore } from '../store/useGameStore';

/**
 * Loop Buddy — a friendly glowing orb mascot.
 * Reacts to different states: idle (gentle pulse), celebrating (bounce + glow),
 * encouraging (wobble), thinking (slow pulse).
 *
 * Props:
 *  - mood: 'idle' | 'celebrate' | 'encourage' | 'think' | 'wave'
 *  - message: optional speech bubble text
 *  - size: 'sm' (40) | 'md' (64) | 'lg' (90)
 */
const SIZES = { sm: 40, md: 64, lg: 90 };
const FACE_SIZES = { sm: 16, md: 24, lg: 36 };

export const LoopBuddy = ({ mood = 'idle', message, size = 'md' }) => {
  const grade = useGameStore(s => s.grade);
  const theme = getGradeTheme(grade);
  const dim = SIZES[size] || SIZES.md;
  const faceSize = FACE_SIZES[size] || FACE_SIZES.md;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    let anim;
    if (mood === 'celebrate') {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -12, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 300, easing: Easing.bounce, useNativeDriver: true }),
          Animated.delay(100),
        ])
      );
      Animated.timing(glowAnim, { toValue: 0.7, duration: 400, useNativeDriver: true }).start();
    } else if (mood === 'encourage') {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.95, duration: 400, useNativeDriver: true }),
        ])
      );
    } else if (mood === 'think') {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        ])
      );
    } else if (mood === 'wave') {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 6, duration: 600, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
    } else {
      // Idle: gentle breathing pulse
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.98, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
    }
    anim?.start();
    return () => anim?.stop();
  }, [mood]);

  const face = mood === 'celebrate' ? '😄'
    : mood === 'encourage' ? '💪'
    : mood === 'think' ? '🤔'
    : mood === 'wave' ? '👋'
    : '😊';

  return (
    <View style={st.wrapper}>
      <Animated.View style={[
        st.orbContainer,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          transform: [{ scale: pulseAnim }, { translateY: bounceAnim }],
        },
      ]}>
        {/* Outer glow */}
        <Animated.View style={[
          st.glow,
          {
            width: dim + 20,
            height: dim + 20,
            borderRadius: (dim + 20) / 2,
            backgroundColor: theme.accent,
            opacity: glowAnim,
          },
        ]} />
        {/* Orb body */}
        <View style={[
          st.orb,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor: theme.accent,
          },
        ]}>
          {/* Shine highlight */}
          <View style={[st.shine, { width: dim * 0.35, height: dim * 0.35, borderRadius: dim * 0.175 }]} />
          {/* Face */}
          <Text style={[st.face, { fontSize: faceSize }]}>{face}</Text>
        </View>
      </Animated.View>

      {/* Speech bubble */}
      {message ? (
        <View style={st.bubble}>
          <View style={st.bubbleArrow} />
          <Text style={st.bubbleText}>{message}</Text>
        </View>
      ) : null}
    </View>
  );
};

const st = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  shine: {
    position: 'absolute',
    top: '12%',
    left: '15%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  face: {
    textAlign: 'center',
  },
  bubble: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: 220,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bubbleArrow: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
});
