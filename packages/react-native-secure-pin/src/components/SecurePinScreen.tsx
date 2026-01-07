import { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

import { useSecurePin } from '../hooks/useSecurePin';
import { styles } from './styles';
import { PinKeypad } from './PinKeypad';
import { PinDots } from './PinDots';

interface SecurePinScreenProps {
  pinLength?: number;
  onSuccess?: () => void;
  onPressForgetPin: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  keyStyle?: StyleProp<ViewStyle>;
  titleEnter?: string;
  enterMessage?: string;
  lockedMessage?: string;
  wrongPinMessage?: (attemptsLeft: number) => string;
  textDescriptionLockedPage?: string;
  exitButtonText?: string;
}

export const SecurePinScreen: React.FC<SecurePinScreenProps> = ({
  onSuccess,
  onPressForgetPin,
  titleStyle,
  subtitleStyle,
  containerStyle,
  keyStyle,
  titleEnter = 'Enter PIN',
  enterMessage = 'Enter PIN',
  lockedMessage = 'The maximum number of attempts has been reached',
  wrongPinMessage,
  textDescriptionLockedPage = 'You have reached the maximum number of attempts',
  exitButtonText = 'Forget PIN?',
  pinLength = 4,
}) => {
  const {
    verifyPin,
    authenticateWithBiometrics,
    isLocked,
    getAttemptsLeft,
  } = useSecurePin();
  const mountedRef = useRef(true);

  const [digits, setDigits] = useState<string[]>([]);
  const [message, setMessage] = useState<string>(enterMessage);
  const [showErrorDots, setShowErrorDots] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /** 🔐 биометрия */
  const runBiometrics = useCallback(async () => {
    const ok = await authenticateWithBiometrics();
    if (ok && mountedRef.current) {
      onSuccess?.();
    }
  }, [authenticateWithBiometrics, onSuccess]);

  useEffect(() => {
    runBiometrics();
  }, [runBiometrics]);

  /** 🔒 проверка lock */
  const checkLock = useCallback(async () => {
    const value = await isLocked();
    if (!mountedRef.current) return;

    setLocked(value);
    if (value) setMessage(lockedMessage);
  }, [isLocked, lockedMessage]);

  useEffect(() => {
    checkLock();
  }, [checkLock]);

  const handleComplete = useCallback(
    async (pin: string) => {
      const lockedNow = await isLocked();

      if (lockedNow) {
        if (!mountedRef.current) return;
        setLocked(true);
        setMessage(lockedMessage);
        setDigits([]);
        return;
      }

      const ok = await verifyPin(pin);

      if (ok) {
        if (!mountedRef.current) return;
        setDigits([]);
        onSuccess?.();
        return;
      }

      const attemptsLeft = await getAttemptsLeft();

      if (!mountedRef.current) return;

      setMessage(
        attemptsLeft === 0
          ? textDescriptionLockedPage
          : wrongPinMessage?.(attemptsLeft) ??
              `Wrong PIN. ${attemptsLeft} attempts left`,
      );

      setShowErrorDots(true);
      setDigits([]);

      setTimeout(() => {
        if (mountedRef.current) {
          setShowErrorDots(false);
        }
      }, 1000);
    },
    [
      verifyPin,
      isLocked,
      getAttemptsLeft,
      onSuccess,
      lockedMessage,
      wrongPinMessage,
      textDescriptionLockedPage,
    ],
  );

  useEffect(() => {
    if (digits.length === pinLength) {
      handleComplete(digits.join(''));
    }
  }, [digits, pinLength, handleComplete]);

  const push = useCallback(
    (d: string) => {
      setDigits(prev =>
        !locked && prev.length < pinLength ? [...prev, d] : prev,
      );
    },
    [locked, pinLength],
  );

  const pop = useCallback(() => {
    setDigits(prev => prev.slice(0, -1));
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]} allowFontScaling={false}>
        {locked ? lockedMessage : titleEnter}
      </Text>

      <Text style={[styles.subtitle, subtitleStyle]} allowFontScaling={false}>
        {message}
      </Text>

      {!locked && (
        <>
          <PinDots
            pinLength={pinLength}
            digits={digits.join('')}
            showErrorDots={showErrorDots}
          />
          <PinKeypad onKeyPress={push} onDelete={pop} keyStyle={keyStyle} />
        </>
      )}

      {locked && (
        <TouchableOpacity onPress={onPressForgetPin}>
          <Text style={styles.forgetPin} allowFontScaling={false}>
            {exitButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
