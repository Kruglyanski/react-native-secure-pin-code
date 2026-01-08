import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import { useSecurePin } from "../context/SecurePinContext";
import { PinDots } from "../components/PinDots";
import { PinKeypad } from "../components/PinKeypad";
import { styles } from "../components/styles";
import { PinFlow, SecurePinScreenProps } from "../types";

export const SecurePinScreen: React.FC<SecurePinScreenProps> = ({
  pinLength = 4,
  onSuccess,
  onPressForgetPin,
  allowFontScaling = true,

  containerStyle,
  titleStyle,
  subtitleStyle,
  lockTextStyle,
  keyPadStyle,
  keyStyle,
  keyTextStyle,
  eraseComponent,

  titleSet = "PIN Setup",
  titleEnter = "PIN Entry",

  enterMessage = "Please enter PIN",
  createMessage = "Create PIN",
  confirmMessage = "Confirm PIN",
  doNotMatchMessage = "PINs do not match",

  lockedMessage = "Too many attempts",
  wrongPinMessage,

  textSubDescriptionLockedPage = "Please try again after:",
  textDescriptionLockedPage = "You have reached the maximum number of attempts",
  exitButtonText = "Forget PIN?",
}) => {
  const {
    hasPin,
    isLocked,
    lockUntil,
    attemptsLeft,
    setPin,
    checkPin,
    loginWithBiometrics,
  } = useSecurePin();

  // -------- LOCAL STATE --------

  const [digits, setDigits] = useState<string[]>([]);
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [flow, setFlow] = useState<PinFlow | null>(null);
  const [message, setMessage] = useState<string>("");
  const [showErrorDots, setShowErrorDots] = useState(false);
  const [remaining, setRemaining] = useState(0);

  // -------- PIN LENGTH GUARD --------

  const safePinLength = Math.min(8, Math.max(4, pinLength));

  // -------- FLOW INIT --------

  useEffect(() => {
    if (hasPin === null) return;

    if (hasPin) {
      setFlow("enter");
      setMessage(enterMessage);
    } else {
      setFlow("set");
      setMessage(createMessage);
    }
  }, [hasPin, enterMessage, createMessage]);

  // BIOMETRICS

  useEffect(() => {
    if (flow !== "enter" || !hasPin || isLocked || attemptsLeft < 3 - 1) return;

    (async () => {
      const ok = await loginWithBiometrics();
      if (ok) onSuccess?.();
    })();
  }, [flow, hasPin, isLocked, loginWithBiometrics, onSuccess]);

  //LOCK TIMER

  useEffect(() => {
    if (!isLocked || !lockUntil) {
      setRemaining(0);
      setMessage(enterMessage);

      return;
    }

    const update = () => {
      const seconds = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));
      setRemaining(seconds);
    };

    update();
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [isLocked, lockUntil]);

  const handleComplete = useCallback(
    async (pin: string) => {
      if (flow === "set") {
        setFirstPin(pin);
        setDigits([]);
        setFlow("confirm");
        setMessage(confirmMessage);

        return;
      }

      if (flow === "confirm") {
        if (pin === firstPin) {
          await setPin(pin);
          setDigits([]);
          setFirstPin(null);
          setMessage("");
          onSuccess?.();
        } else {
          setFirstPin(null);
          setDigits([]);
          setFlow("set");
          setMessage(doNotMatchMessage);
        }
        return;
      }

      if (flow === "enter") {
        if (isLocked) return;

        const ok = await checkPin(pin);

        if (ok) {
          setDigits([]);
          setMessage("");
          onSuccess?.();
        } else {
          setShowErrorDots(true);
          setDigits([]);
          setMessage(
            attemptsLeft === 0
              ? textSubDescriptionLockedPage
              : wrongPinMessage?.(attemptsLeft) ??
                  `Wrong PIN. ${attemptsLeft} attempts left`
          );

          setTimeout(() => {
            setShowErrorDots(false);
          }, 800);
        }
      }
    },
    [
      flow,
      firstPin,
      isLocked,
      attemptsLeft,
      setPin,
      checkPin,
      onSuccess,
      confirmMessage,
      doNotMatchMessage,
      textSubDescriptionLockedPage,
      wrongPinMessage,
    ]
  );

  // DIGITS WATCH

  useEffect(() => {
    if (digits.length === safePinLength) {
      handleComplete(digits.join(""));
    }
  }, [digits, safePinLength, handleComplete]);

  //KEYPAD

  const push = (d: string) => {
    if (isLocked) return;
    if (digits.length < safePinLength) setDigits([...digits, d]);
  };

  const pop = () => setDigits(digits.slice(0, -1));

  //UI HELPERS

  const title = isLocked
    ? lockedMessage
    : flow === "set" || flow === "confirm"
    ? titleSet
    : titleEnter;

  const showLockedUI = isLocked && remaining > 0;

  return (
    <ScrollView contentContainerStyle={[styles.container, containerStyle]}>
      <Text
        style={[styles.title, titleStyle]}
        allowFontScaling={allowFontScaling}
      >
        {title}
      </Text>

      {showLockedUI && (
        <Text
          style={[styles.lock, lockTextStyle]}
          allowFontScaling={allowFontScaling}
        >
          {textDescriptionLockedPage}
        </Text>
      )}

      <Text
        style={[styles.subtitle, subtitleStyle]}
        allowFontScaling={allowFontScaling}
      >
        {message}
      </Text>

      {!showLockedUI && (
        <>
          <PinDots
            pinLength={safePinLength}
            digits={digits.join("")}
            showErrorDots={showErrorDots}
          />
          <PinKeypad
            onKeyPress={push}
            onDelete={pop}
            keyStyle={keyStyle}
            disabled={showErrorDots}
            keyPadStyle={keyPadStyle}
            keyTextStyle={keyTextStyle}
            eraseComponent={eraseComponent}
            allowFontScaling={allowFontScaling}
          />
        </>
      )}

      {showLockedUI && (
        <>
          <Text style={styles.remaining} allowFontScaling={allowFontScaling}>
            {remaining}
          </Text>

          <TouchableOpacity onPress={onPressForgetPin}>
            <Text style={styles.forgetPin} allowFontScaling={allowFontScaling}>
              {exitButtonText}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};
