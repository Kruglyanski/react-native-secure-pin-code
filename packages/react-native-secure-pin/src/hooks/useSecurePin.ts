import { useCallback } from 'react';
import { useSecurePinContext } from '../context/SecurePinContext';
import type {
  UseSecurePin,
  VerifyPinResult,
} from '../types';

export const useSecurePin = (): UseSecurePin => {
  const ctx = useSecurePinContext();

  const verifyPin = useCallback(
    async (pin: string): Promise<VerifyPinResult> => {
      const locked = await ctx.isLocked();
      if (locked) {
        return {
          success: false,
          attemptsLeft: 0,
          locked: true,
        };
      }

      const success = await ctx.verifyPin(pin);
      const attemptsLeft = await ctx.getAttemptsLeft();
      const nowLocked = await ctx.isLocked();

      return {
        success,
        attemptsLeft,
        locked: nowLocked,
      };
    },
    [ctx],
  );

  const setPin = useCallback(
    async (pin: string) => {
      await ctx.setPin(pin);
    },
    [ctx],
  );

  const resetPin = useCallback(
    async () => {
      await ctx.resetPin();
    },
    [ctx],
  );

  const authenticateWithBiometrics = useCallback(
    async () => {
      return ctx.authenticateWithBiometrics();
    },
    [ctx],
  );

  const isLocked = useCallback(() => {
    return ctx.isLocked();
  }, [ctx]);

  const getAttemptsLeft = useCallback(() => {
    return ctx.getAttemptsLeft();
  }, [ctx]);

  return {
    verifyPin,
    setPin,
    resetPin,
    authenticateWithBiometrics,
    isLocked,
    getAttemptsLeft,
  };
};
