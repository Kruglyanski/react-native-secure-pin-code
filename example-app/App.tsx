import React from 'react';
import { SafeAreaView } from 'react-native';

import { SecurePinProvider, SecurePinScreen } from 'react-native-secure-pin';

export default function App() {
  return (
    <SecurePinProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <SecurePinScreen
          onSuccess={() => console.log('OK')}
          onPressForgetPin={() => console.log('FORGET')}
        />
      </SafeAreaView>
    </SecurePinProvider>
  );
}
