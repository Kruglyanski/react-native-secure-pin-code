import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SecurePinProvider,
  SecurePinScreen,
  useSecurePin,
} from "@kruglyanski/react-native-secure-pin-code";

export default function App() {
  return (
    <SecurePinProvider>
      <AppRoot />
    </SecurePinProvider>
  );
}

const AppRoot = () => {
  const [pinVerified, setPinVerified] = useState(false);
  const { deletePin } = useSecurePin();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {pinVerified ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Hello!</Text>
        </View>
      ) : (
        <SecurePinScreen
          onSuccess={() => setPinVerified(true)}
          onPressForgetPin={() =>
            Alert.alert("Forget PIN?", "Are you sure?", [
              { text: "Cancel" },
              { text: "Yes", onPress: deletePin },
            ])
          }
        />
      )}
    </SafeAreaView>
  );
};
