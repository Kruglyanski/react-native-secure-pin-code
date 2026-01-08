export type PinFlow = 'set' | 'confirm' | 'enter';

export interface SecurePinAPI {
  hasPin: boolean | null;
  isLocked: boolean;
  attemptsLeft: number;
  setPin(pin: string): Promise<void>;
  verifyPin(pin: string): Promise<boolean>;
  loginWithBiometrics(): Promise<boolean>;
  deletePin(): Promise<void>;
}

export interface SecurePinProviderProps {
  children?: React.ReactNode;
  biometryPrompt?: string;
  biometryPromptCancel?: string;
  maxAttempts?: number;
  lockDurationSec?: number;
}
