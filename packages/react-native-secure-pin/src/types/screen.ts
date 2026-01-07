export type SecurePinMode = 'create' | 'verify' | 'change';

export interface SecurePinScreenProps {
  /**
   * Режим работы экрана
   */
  mode: SecurePinMode;

  /**
   * Вызывается при успешной операции
   */
  onSuccess?: () => void;

  /**
   * Вызывается при ошибке PIN
   */
  onFailure?: (attemptsLeft: number) => void;

  /**
   * Вызывается при блокировке
   */
  onLocked?: () => void;

  /**
   * Автоматически запускать биометрию
   */
  autoBiometrics?: boolean;
}
