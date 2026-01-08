import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { SecurePinProviderProps, SecurePinAPI } from '../types/context';
import { PinService } from '../services/pinService';
import { authenticateBiometrics } from '../services/biometricsService';

const SecurePinContext = createContext<SecurePinAPI | null>(null);

export const SecurePinProvider: React.FC<SecurePinProviderProps> = ({
  children,
  biometryPrompt = 'Authenticate to unlock',
  biometryPromptCancel = 'Cancel',
  maxAttempts = 3,
  lockDurationSec = 30,
}) => {
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [meta, setMeta] = useState<{ failedAttempts: number; lockUntil: number | null }>({
    failedAttempts: 0,
    lockUntil: null,
  });

  const pinService = useMemo(() => new PinService({ maxAttempts, lockDurationSec }), [maxAttempts, lockDurationSec]);

  const refreshMeta = useCallback(async () => {
    const m = await pinService.getMeta();
    setMeta(m);
  }, [pinService]);

  const isLocked = Boolean(meta.lockUntil && meta.lockUntil > Date.now());
  const attemptsLeft = Math.max(0, maxAttempts - (meta.failedAttempts || 0));

  useEffect(() => {
    let mounted = true;
    (async () => {
      const pin = await pinService.getPin();
      if (mounted) setHasPin(Boolean(pin));

      const m = await pinService.getMeta();
      if (mounted) setMeta(m);
    })();
    return () => {
      mounted = false;
    };
  }, [pinService]);

  const setPin = useCallback(async (pin: string) => {
    await pinService.setPin(pin);
    setHasPin(true);
    await refreshMeta();
  }, [pinService, refreshMeta]);

  const verifyPin = useCallback(async (pin: string) => {
    const ok = await pinService.verifyPin(pin);
    await refreshMeta();
    return ok;
  }, [pinService, refreshMeta]);

  const loginWithBiometrics = useCallback(async () => {
    if (isLocked) return false;
    return await authenticateBiometrics({ promptMessage: biometryPrompt, cancelButtonText: biometryPromptCancel });
  }, [biometryPrompt, biometryPromptCancel, isLocked]);

  const deletePin = useCallback(async () => {
    await pinService.deletePin();
    setHasPin(false);
    await refreshMeta();
  }, [pinService, refreshMeta]);

  const value = useMemo<SecurePinAPI>(() => ({
    hasPin,
    isLocked,
    attemptsLeft,
    setPin,
    verifyPin,
    loginWithBiometrics,
    deletePin,
  }), [hasPin, isLocked, attemptsLeft, setPin, verifyPin, loginWithBiometrics, deletePin]);

  return <SecurePinContext.Provider value={value}>{children}</SecurePinContext.Provider>;
};

export function useSecurePin(): SecurePinAPI {
  const ctx = useContext(SecurePinContext);
  if (!ctx) throw new Error('useSecurePin must be used within SecurePinProvider');
  return ctx;
}
