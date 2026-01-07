export interface VerifyPinResult {
  success: boolean;
  attemptsLeft: number;
  locked: boolean;
}

export interface UseSecurePin {
  /**
   * Проверить PIN
   */
  verifyPin(pin: string): Promise<VerifyPinResult>;

  /**
   * Установить новый PIN
   */
  setPin(pin: string): Promise<void>;

  /**
   * Сбросить PIN
   */
  resetPin(): Promise<void>;

  /**
   * Биометрическая аутентификация
   */
  authenticateWithBiometrics(): Promise<boolean>;

  /**
   * Заблокировано ли сейчас
   */
  isLocked(): Promise<boolean>;

  /**
   * Оставшееся количество попыток
   */
  getAttemptsLeft(): Promise<number>;
}
