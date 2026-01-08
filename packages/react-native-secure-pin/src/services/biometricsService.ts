import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ReactNativeBiometrics from 'react-native-biometrics';
import { BiometricsOptions } from '../types/biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export async function authenticateBiometrics(options: BiometricsOptions): Promise<boolean> {
  try {
    const isSimulator = await DeviceInfo.isEmulator();
    if (isSimulator && Platform.OS === 'ios') return false;

    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) return false;

    const result = await rnBiometrics.simplePrompt({
      promptMessage: options.promptMessage,
      cancelButtonText: options.cancelButtonText,
    });

    return result.success;
  } catch {
    return false;
  }
}
