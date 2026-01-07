import { memo, useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import { styles } from './styles';

export const PinDots = memo(
  ({
    pinLength,
    digits,
    showErrorDots,
  }: {
    pinLength: number;
    digits: string;
    showErrorDots: boolean;
  }) => {
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Error dots animation
    useEffect(() => {
      if (showErrorDots) {
        shakeAnim.setValue(0);

        const shake = Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]);

        shake.start();
      }
    }, [shakeAnim, showErrorDots]);

    const shakeInterpolate = shakeAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -30, 30, -15, 0],
    });

    const animatedStyle = {
      transform: [{ translateX: shakeInterpolate }],
    };

    return (
      <Animated.View style={[styles.dotsContainer, animatedStyle]}>
        {Array.from({ length: pinLength }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < digits.length ? styles.dotFilled : undefined,
              showErrorDots && styles.dotError,
            ]}
          />
        ))}
      </Animated.View>
    );
  }
);
