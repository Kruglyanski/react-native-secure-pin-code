export interface Meta {
  failedAttempts: number;
  lockUntil: number | null;
}

export interface PinServiceOptions {
  maxAttempts: number;
  lockDurationSec: number;
}
