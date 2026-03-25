import { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

/**
 * Big, bouncy, touchable button for kids.
 * Minimum 56px touch target. Scales down on press with spring-back.
 */
export const BounceButton = ({ onPress, children, style, disabled, hitSlop = 8 }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={hitSlop}
    >
      <Animated.View style={[st.base, { transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const st = StyleSheet.create({
  base: {
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
