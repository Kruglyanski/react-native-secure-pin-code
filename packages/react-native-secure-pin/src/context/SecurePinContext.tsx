import { createContext, useContext } from 'react';

export interface SecurePinContextValue {
  pinLength: number;
  maxAttempts: number;
  lockTimeoutMs: number;

  verifyPin(pin: string): Promise<boolean>;
  setPin(pin: string): Promise<void>;
  resetPin(): Promise<void>;

  authenticateWithBiometrics(): Promise<boolean>;

  getAttemptsLeft(): Promise<number>;
  isLocked(): Promise<boolean>;
}

export const SecurePinContext =
  createContext<SecurePinContextValue | null>(null);

export const useSecurePinContext = () => {
  const ctx = useContext(SecurePinContext);
  if (!ctx) {
    throw new Error('useSecurePin must be used within SecurePinProvider');
  }
  return ctx;
};
