import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

interface BiometryOptions {
  promptMessage?: string;
  cancelButtonText?: string;
}

export async function authenticateBiometrics({
  promptMessage = 'Authenticate',
  cancelButtonText = 'Cancel',
}: BiometryOptions): Promise<boolean> {
  const isSimulator = await DeviceInfo.isEmulator();
  if (isSimulator && Platform.OS === 'ios') return false;

  const { available } = await rnBiometrics.isSensorAvailable();
  if (!available) return false;

  const result = await rnBiometrics.simplePrompt({
    promptMessage,
    cancelButtonText,
  });

  return result.success;
}
