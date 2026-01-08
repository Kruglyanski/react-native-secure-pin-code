import * as Keychain from 'react-native-keychain';
import { Meta, PinServiceOptions } from '../types/pin';

export class PinService {
  private options: PinServiceOptions;
  private metaServiceKey = 'secure_pin_service_meta';
  private pinServiceKey = 'secure_pin_service_pin';

  constructor(options: PinServiceOptions) {
    this.options = options;
  }

  private async readMeta(): Promise<Meta> {
    try {
      const creds = await Keychain.getGenericPassword({ service: this.metaServiceKey }).catch(() => null);
      if (!creds) return { failedAttempts: 0, lockUntil: null };
      const parsed: Meta = JSON.parse(creds.password);
      if (parsed.lockUntil && parsed.lockUntil <= Date.now()) {
        return { failedAttempts: 0, lockUntil: null };
      }
      return parsed;
    } catch {
      return { failedAttempts: 0, lockUntil: null };
    }
  }

  private async writeMeta(meta: Meta): Promise<void> {
    try {
      await Keychain.setGenericPassword('meta', JSON.stringify(meta), {
        service: this.metaServiceKey,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (e) {
      console.error('Failed to write meta', e);
    }
  }

  async setPin(pin: string) {
    await Keychain.setGenericPassword('pin', pin, { service: this.pinServiceKey });
    await this.writeMeta({ failedAttempts: 0, lockUntil: null });
  }

  async getPin(): Promise<string | null> {
    const creds = await Keychain.getGenericPassword({ service: this.pinServiceKey });
    return creds?.password || null;
  }

  async verifyPin(pin: string): Promise<boolean> {
    const meta = await this.readMeta();
    if (meta.lockUntil && meta.lockUntil > Date.now()) return false;

    const stored = await this.getPin();
    if (!stored) return false;

    const ok = stored === pin;
    if (!ok) {
      await this.incrementFailed(meta);
    } else {
      await this.writeMeta({ failedAttempts: 0, lockUntil: null });
    }
    return ok;
  }

  private async incrementFailed(meta: Meta): Promise<void> {
    const m: Meta = { ...meta, failedAttempts: (meta.failedAttempts || 0) + 1 };
    if (m.failedAttempts >= this.options.maxAttempts) {
      m.lockUntil = Date.now() + this.options.lockDurationSec * 1000;
    }
    await this.writeMeta(m);
  }

  async deletePin() {
    try {
      await Keychain.resetGenericPassword({ service: this.pinServiceKey });
      await Keychain.resetGenericPassword({ service: this.metaServiceKey }).catch(() => {});
    } catch (e) {
      console.error('Failed to delete PIN', e);
    }
  }

  async getMeta(): Promise<Meta> {
    return this.readMeta();
  }
}
