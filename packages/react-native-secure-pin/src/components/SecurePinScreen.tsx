import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useSecurePin } from "../context/SecurePinContext";
import { styles } from "./styles";
import { PinKeypad } from "./PinKeypad";
import { PinDots } from "./PinDots";
import { PinFlow } from "../types";

interface SecurePinScreenProps {
  pinLength?: number;
  onSuccess?: () => void;
  onPressForgetPin: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  keyStyle?: StyleProp<ViewStyle>;
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
}

export const SecurePinScreen: React.FC<SecurePinScreenProps> = ({
  pinLength = 4,
  onSuccess,
  onPressForgetPin,
  titleStyle,
  subtitleStyle,
  containerStyle,
  keyStyle,
  titleSet = "Set PIN",
  titleEnter = "Enter PIN",
  enterMessage = "Enter PIN",
  createMessage = "Create PIN",
  confirmMessage = "Confirm PIN",
  doNotMatchMessage = "PINs do not match",
  lockedMessage = "Maximum attempts reached",
  wrongPinMessage,
  textSubDescriptionLockedPage = "Try again later:",
  textDescriptionLockedPage = "You have reached the maximum number of attempts",
  exitButtonText = "Forget PIN?",
}) => {
  const {
    hasPin,
    setPin,
    isLocked,
    attemptsLeft,
    loginWithBiometrics,
    verifyPin,
  } = useSecurePin();

  const [digits, setDigits] = useState<string[]>([]);
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [flow, setFlow] = useState<PinFlow | null>(null);
  const [message, setMessage] = useState<string>(enterMessage);
  const [showErrorDots, setShowErrorDots] = useState(false);

  //determine the flow
  useEffect(() => {
    if (isLocked) {
      setMessage(textSubDescriptionLockedPage);
      return;
    }

    if (hasPin === null) return;

    if (hasPin) {
      setFlow("enter");
      setMessage(enterMessage);
    } else {
      setFlow("set");
      setMessage(createMessage);
    }
  }, [
    hasPin,
    isLocked,
    createMessage,
    enterMessage,
    textSubDescriptionLockedPage,
  ]);

  //biometrics
  useEffect(() => {
    if (flow === "enter" && hasPin) {
      (async () => {
        const ok = await loginWithBiometrics();
        if (ok) onSuccess?.();
      })();
    }
  }, [flow, hasPin, loginWithBiometrics, onSuccess]);

  const handleComplete = useCallback(
    async (pin: string) => {
      if (flow === "set") {
        setFirstPin(pin);
        setFlow("confirm");
        setDigits([]);
        setMessage(confirmMessage);
        return;
      }

      if (flow === "confirm") {
        if (firstPin === pin) {
          await setPin(pin);
          setDigits([]);
          setFirstPin(null);
          setMessage("");
          onSuccess?.();
        } else {
          setMessage(doNotMatchMessage);
          setDigits([]);
          setFirstPin(null);
          setFlow("set");
        }
        return;
      }

      if (flow === "enter") {
        if (isLocked) {
          setMessage(lockedMessage);
          setDigits([]);
          return;
        }

        const ok = await verifyPin(pin);
        if (ok) {
          setDigits([]);
          setMessage("");
          onSuccess?.();
        } else {
          setMessage(
            attemptsLeft === 0
              ? textSubDescriptionLockedPage
              : wrongPinMessage?.(attemptsLeft) ||
                  `Wrong PIN. ${attemptsLeft} attempts left`
          );
          setShowErrorDots(true);
          setDigits([]);
          setTimeout(() => setShowErrorDots(false), 1000);
        }
      }
    },
    [
      flow,
      firstPin,
      setPin,
      verifyPin,
      onSuccess,
      confirmMessage,
      doNotMatchMessage,
      isLocked,
      lockedMessage,
      attemptsLeft,
      textSubDescriptionLockedPage,
      wrongPinMessage,
    ]
  );

  useEffect(() => {
    if (digits.length === pinLength) {
      handleComplete(digits.join(""));
    }
  }, [digits, pinLength, handleComplete]);

  const push = useCallback(
    (d: string) => {
      setDigits((prev) =>
        !isLocked && prev.length < pinLength ? [...prev, d] : prev
      );
    },
    [isLocked, pinLength]
  );

  const pop = useCallback(() => setDigits((prev) => prev.slice(0, -1)), []);

  const getTitle = useCallback(() => {
    if (isLocked) return lockedMessage;
    if (flow === "set" || flow === "confirm") return titleSet;
    return titleEnter;
  }, [isLocked, flow, titleSet, titleEnter, lockedMessage]);

  const showLockedUI = isLocked;

  return (
    <ScrollView contentContainerStyle={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]} allowFontScaling={false}>
        {getTitle()}
      </Text>

      {showLockedUI && (
        <Text style={styles.lock} allowFontScaling={false}>
          {textDescriptionLockedPage}
        </Text>
      )}

      <Text style={[styles.subtitle, subtitleStyle]} allowFontScaling={false}>
        {message}
      </Text>

      {!showLockedUI && (
        <>
          <PinDots
            pinLength={pinLength}
            digits={digits.join("")}
            showErrorDots={showErrorDots}
          />
          <PinKeypad onKeyPress={push} onDelete={pop} keyStyle={keyStyle} />
        </>
      )}

      {showLockedUI && (
        <TouchableOpacity onPress={onPressForgetPin}>
          <Text style={styles.forgetPin} allowFontScaling={false}>
            {exitButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
