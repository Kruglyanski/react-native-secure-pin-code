import * as Keychain from 'react-native-keychain';

const PIN_KEY = 'SECURE_PIN';
const META_KEY = 'SECURE_PIN_META';

interface Meta {
  attempts: number;
  lockedUntil: number | null;
}

export async function savePin(pin: string) {
  await Keychain.setGenericPassword('pin', pin, {
    service: PIN_KEY,
  });
}

export async function getPin(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({
    service: PIN_KEY,
  });
  return creds ? creds.password : null;
}

export async function resetPin() {
  await Keychain.resetGenericPassword({ service: PIN_KEY });
  await Keychain.resetGenericPassword({ service: META_KEY });
}

export async function getMeta(): Promise<Meta> {
  const creds = await Keychain.getGenericPassword({
    service: META_KEY,
  });

  if (!creds) {
    return { attempts: 0, lockedUntil: null };
  }

  return JSON.parse(creds.password) as Meta;
}

export async function saveMeta(meta: Meta) {
  await Keychain.setGenericPassword(
    'meta',
    JSON.stringify(meta),
    { service: META_KEY },
  );
}
