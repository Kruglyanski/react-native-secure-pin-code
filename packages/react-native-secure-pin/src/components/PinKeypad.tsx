import { memo } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { KeyButton } from "./KeyButton";
import { styles } from "./styles";

interface PinKeypadProps {
  onKeyPress: (value: string) => void;
  onDelete: () => void;
  disabled?: boolean;
  keyStyle?: StyleProp<ViewStyle>;
  keyPadStyle?: StyleProp<ViewStyle>;
  keyTextStyle?: StyleProp<TextStyle>;
  eraseComponent?: React.ReactNode;
  allowFontScaling: boolean;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export const PinKeypad = memo(
  ({
    onKeyPress,
    onDelete,
    disabled = false,
    keyPadStyle,
    keyStyle,
    keyTextStyle,
    eraseComponent,
    allowFontScaling
  }: PinKeypadProps) => {
    return (
      <View style={[styles.keypad, keyPadStyle]}>
        {KEYS.map((k) => (
          <KeyButton
            key={k}
            label={k}
            onPress={onKeyPress}
            disabled={disabled}
            style={keyStyle}
            textStyle={keyTextStyle}
            allowFontScaling={allowFontScaling}
          />
        ))}
        <TouchableOpacity
          onPress={onDelete}
          style={[styles.pop, disabled && styles.disabled]}
          disabled={disabled}
        >
          {eraseComponent ? (
            eraseComponent
          ) : (
            <Text style={styles.keyText} allowFontScaling={allowFontScaling}>
              ⌫
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);
