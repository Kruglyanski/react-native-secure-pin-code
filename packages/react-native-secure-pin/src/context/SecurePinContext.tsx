import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as Keychain from "react-native-keychain";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { Meta, SecurePinAPI, SecurePinProviderProps } from "../types";

const META_KEY = "secure_pin_service_meta";
const PIN_KEY = "secure_pin_service_pin";

const SecurePinContext = createContext<SecurePinAPI | null>(null);
const biometrics = new ReactNativeBiometrics();

export const SecurePinProvider: React.FC<SecurePinProviderProps> = ({
  children,
  maxAttempts = 3,
  lockDurationSec = 20,
  biometryPromptText = "Authenticate",
  biometryPromptCancelText = "Cancel",
  showBiometrics = true,
}) => {
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [meta, setMeta] = useState<Meta>({
    failedAttempts: 0,
    lockUntil: null,
  });

  const readMeta = useCallback(async (): Promise<Meta> => {
    try {
      const creds = await Keychain.getGenericPassword({ service: META_KEY });
      if (!creds) return { failedAttempts: 0, lockUntil: null };

      const parsed: Meta = JSON.parse(creds.password);

      if (parsed.lockUntil && parsed.lockUntil <= Date.now()) {
        return { failedAttempts: 0, lockUntil: null };
      }

      return parsed;
    } catch {
      return { failedAttempts: 0, lockUntil: null };
    }
  }, []);

  const writeMeta = useCallback(async (m: Meta) => {
    await Keychain.setGenericPassword("meta", JSON.stringify(m), {
      service: META_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    setMeta(m);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const pin = await Keychain.getGenericPassword({ service: PIN_KEY });
      const m = await readMeta();

      if (!mounted) return;

      setHasPin(Boolean(pin));
      setMeta(m);
    })();

    return () => {
      mounted = false;
    };
  }, [readMeta]);

  useEffect(() => {
    if (!meta.lockUntil) return;

    const id = setInterval(() => {
      if (meta.lockUntil && meta.lockUntil <= Date.now()) {
        writeMeta({ failedAttempts: 0, lockUntil: null });
      }
    }, 1000);

    return () => clearInterval(id);
  }, [meta.lockUntil, writeMeta]);

  const isLocked = Boolean(meta.lockUntil && meta.lockUntil > Date.now());
  const attemptsLeft = Math.max(0, maxAttempts - 1 - meta.failedAttempts);

  const setPin = useCallback(
    async (pin: string) => {
      await Keychain.setGenericPassword("pin", pin, { service: PIN_KEY });
      await writeMeta({ failedAttempts: 0, lockUntil: null });
      setHasPin(true);
    },
    [writeMeta]
  );

  const checkPin = useCallback(
    async (pin: string): Promise<boolean> => {
      const m = await readMeta();

      if (m.lockUntil && m.lockUntil > Date.now()) {
        setMeta(m);
        return false;
      }

      const creds = await Keychain.getGenericPassword({ service: PIN_KEY });
      if (!creds) return false;

      const ok = creds.password === pin;

      if (ok) {
        await writeMeta({ failedAttempts: 0, lockUntil: null });
        return true;
      }

      const failed = m.failedAttempts + 1;
      const next: Meta =
        failed >= maxAttempts
          ? {
              failedAttempts: failed,
              lockUntil: Date.now() + lockDurationSec * 1000,
            }
          : { failedAttempts: failed, lockUntil: null };

      await writeMeta(next);
      return false;
    },
    [maxAttempts, lockDurationSec, readMeta, writeMeta]
  );

  const loginWithBiometrics = useCallback(async () => {
    if (isLocked || !showBiometrics || attemptsLeft < maxAttempts - 1)
      return false;

    if (Platform.OS === "ios" && (await DeviceInfo.isEmulator())) {
      return false;
    }

    const { available } = await biometrics.isSensorAvailable();
    if (!available) return false;

    const res = await biometrics.simplePrompt({
      promptMessage: biometryPromptText,
      cancelButtonText: biometryPromptCancelText,
    });

    if (!res.success) return false;

    await writeMeta({ failedAttempts: 0, lockUntil: null });
    return true;
  }, [isLocked, biometryPromptText, biometryPromptCancelText, writeMeta]);

  const deletePin = useCallback(async () => {
    await Keychain.resetGenericPassword({ service: PIN_KEY });
    await Keychain.resetGenericPassword({ service: META_KEY }).catch(() => {});
    setHasPin(false);
    setMeta({ failedAttempts: 0, lockUntil: null });
  }, []);

  const value = useMemo<SecurePinAPI>(
    () => ({
      hasPin,
      isLocked,
      lockUntil: meta.lockUntil,
      attemptsLeft,
      setPin,
      checkPin,
      loginWithBiometrics,
      deletePin,
    }),
    [
      hasPin,
      isLocked,
      meta.lockUntil,
      attemptsLeft,
      setPin,
      checkPin,
      loginWithBiometrics,
      deletePin,
      showBiometrics,
    ]
  );

  return (
    <SecurePinContext.Provider value={value}>
      {children}
    </SecurePinContext.Provider>
  );
};

export function useSecurePin(): SecurePinAPI {
  const ctx = useContext(SecurePinContext);
  if (!ctx)
    throw new Error("useSecurePin must be used within SecurePinProvider");
  return ctx;
}
