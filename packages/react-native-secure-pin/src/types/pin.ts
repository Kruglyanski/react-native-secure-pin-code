import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface Meta {
  failedAttempts: number;
  lockUntil: number | null;
}

export interface PinServiceOptions {
  maxAttempts: number;
  lockDurationSec: number;
}
export interface SecurePinScreenProps {
  pinLength?: 4 | 5 | 6 | 7 | 8;
  onSuccess?: () => void;
  onPressForgetPin: () => void;
  
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  lockTextStyle?: StyleProp<TextStyle>;
  keyPadStyle?: StyleProp<ViewStyle>;
  keyStyle?: StyleProp<ViewStyle>;
  keyTextStyle?: StyleProp<TextStyle>;
  eraseComponent?: React.ReactNode;
  
  titleSet?: string;
  titleEnter?: string;
  
  enterMessage?: string;
  createMessage?: string;
  confirmMessage?: string;
  doNotMatchMessage?: string;
  
  lockedMessage?: string;
  wrongPinMessage?: (attemptsLeft: number) => string;
  
  textSubDescriptionLockedPage?: string;
  textDescriptionLockedPage?: string;
  exitButtonText?: string;

  allowFontScaling?: boolean;
}

