import { Meta } from "./pin";

export type PinFlow = 'set' | 'confirm' | 'enter';

export interface SecurePinAPI {
  hasPin: boolean | null;

  isLocked: boolean;
  lockUntil: number | null;
  attemptsLeft: number;

  setPin(pin: string): Promise<void>;
  checkPin(pin: string): Promise<boolean>;

  loginWithBiometrics(): Promise<boolean>;
  deletePin(): Promise<void>;
}

export interface SecurePinProviderProps {
  children: React.ReactNode;
  maxAttempts?: number;
  lockDurationSec?: number;
  biometryPromptText?: string;
  biometryPromptCancelText?: string;
  showBiometrics?: boolean;
}
