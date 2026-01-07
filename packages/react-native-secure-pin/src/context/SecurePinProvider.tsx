import { useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

import {
  SecurePinContext,
  type SecurePinContextValue,
} from './SecurePinContext';

import {
  DEFAULT_PIN_LENGTH,
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_LOCK_TIMEOUT_MS,
} from '../constants';

import {
  getPin,
  savePin,
  resetPin as resetPinStorage,
  getMeta,
  saveMeta,
} from '../helpers/storage';

interface SecurePinProviderProps {
  pinLength?: number;
  maxAttempts?: number;
  lockTimeoutMs?: number;
}

export const SecurePinProvider: FC<
  PropsWithChildren<SecurePinProviderProps>
> = ({
  children,
  pinLength = DEFAULT_PIN_LENGTH,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  lockTimeoutMs = DEFAULT_LOCK_TIMEOUT_MS,
}) => {
  const biometrics = useMemo(
    () => new ReactNativeBiometrics(),
    [],
  );

  const isLocked = async (): Promise<boolean> => {
    const meta = await getMeta();
    if (!meta.lockedUntil) return false;
    return Date.now() < meta.lockedUntil;
  };

  const getAttemptsLeft = async (): Promise<number> => {
    const meta = await getMeta();
    return Math.max(0, maxAttempts - meta.attempts);
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    const locked = await isLocked();
    if (locked) return false;

    const storedPin = await getPin();
    const meta = await getMeta();

    if (!storedPin || storedPin !== pin) {
      const attempts = meta.attempts + 1;

      if (attempts >= maxAttempts) {
        await saveMeta({
          attempts,
          lockedUntil: Date.now() + lockTimeoutMs,
        });
      } else {
        await saveMeta({
          attempts,
          lockedUntil: null,
        });
      }

      return false;
    }

    // success
    await saveMeta({ attempts: 0, lockedUntil: null });
    return true;
  };

  const setPinFn = async (pin: string) => {
    if (pin.length !== pinLength) {
      throw new Error(`PIN must be ${pinLength} digits long`);
    }

    await savePin(pin);
    await saveMeta({ attempts: 0, lockedUntil: null });
  };

  const resetPin = async () => {
    await resetPinStorage();
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    const { available } = await biometrics.isSensorAvailable();
    if (!available) return false;

    const result = await biometrics.simplePrompt({
      promptMessage: 'Authenticate',
    });

    return result.success === true;
  };

  const value: SecurePinContextValue = {
    pinLength,
    maxAttempts,
    lockTimeoutMs,

    verifyPin,
    setPin: setPinFn,
    resetPin,
    authenticateWithBiometrics,

    isLocked,
    getAttemptsLeft,
  };

  return (
    <SecurePinContext.Provider value={value}>
      {children}
    </SecurePinContext.Provider>
  );
};
