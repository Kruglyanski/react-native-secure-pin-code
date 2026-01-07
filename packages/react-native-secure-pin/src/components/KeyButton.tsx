import { memo, useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { styles } from './styles';

interface KeyButtonProps {
  label: string;
  onPress: (value: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const KeyButton = memo(
  ({ label, onPress, disabled, style }: KeyButtonProps) => {
    const handlePress = useCallback(() => {
      if (!disabled) onPress(label);
    }, [label, onPress, disabled]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.key, style, disabled && styles.disabled]}
        disabled={disabled}
      >
        <Text style={styles.keyText} allowFontScaling={false}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
);
