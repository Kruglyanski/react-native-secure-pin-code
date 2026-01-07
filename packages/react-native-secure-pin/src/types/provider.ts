export type BiometricsType = 'faceId' | 'touchId' | 'biometrics';

export interface BiometricsConfig {
  /**
   * Включить биометрию
   */
  enabled?: boolean;

  /**
   * Использовать биометрию автоматически при открытии экрана
   */
  autoAuthenticate?: boolean;

  /**
   * Разрешить fallback на PIN если биометрия недоступна
   */
  fallbackToPin?: boolean;

  /**
   * Текст для системного биометрического диалога
   */
  promptMessage?: string;
}

export interface SecurePinProviderProps {
  /**
   * Длина PIN-кода
   * @default 4
   */
  pinLength?: number;

  /**
   * Максимальное количество попыток
   * @default 5
   */
  maxAttempts?: number;

  /**
   * Время блокировки после превышения попыток (мс)
   * @default 30000
   */
  lockTimeoutMs?: number;

  /**
   * Настройки биометрии
   */
  biometrics?: BiometricsConfig;

  children: React.ReactNode;
}
