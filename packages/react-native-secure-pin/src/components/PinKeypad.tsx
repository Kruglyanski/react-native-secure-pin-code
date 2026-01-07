import { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { KeyButton } from './KeyButton';
import { styles } from './styles';

interface PinKeypadProps {
  onKeyPress: (value: string) => void;
  onDelete: () => void;
  disabled?: boolean;
  keyStyle?: any;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export const PinKeypad = memo(
  ({ onKeyPress, onDelete, disabled = false, keyStyle }: PinKeypadProps) => {
    return (
      <View style={styles.keypad}>
        {KEYS.map((k) => (
          <KeyButton
            key={k}
            label={k}
            onPress={onKeyPress}
            disabled={disabled}
            style={keyStyle}
          />
        ))}
        <TouchableOpacity
          onPress={onDelete}
          style={[styles.pop, disabled && styles.disabled]}
          disabled={disabled}
        >
          <Text style={styles.keyText} allowFontScaling={false}>
            ⌫
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);
