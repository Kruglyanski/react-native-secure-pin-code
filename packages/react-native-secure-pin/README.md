eact Native Secure PIN Code

A secure, customizable PIN code solution for React Native with optional biometric authentication and built-in lockout protection.

This library provides:

secure PIN storage

automatic lockout after failed attempts

optional Face ID / Touch ID authentication

a ready-to-use PIN screen

a small, stable, forward-compatible API

The library is designed to be safe by default and suitable for production use.

Installation

Install the package:

yarn add @kruglyanski/react-native-secure-pin-code


or

npm install @kruglyanski/react-native-secure-pin-code


Install required native dependencies:

yarn add react-native-keychain react-native-biometrics react-native-device-info


Then install iOS pods:

cd ios && pod install
# @kruglyanski/react-native-secure-pin-code

A secure, customizable PIN code solution for React Native with biometric authentication support.

This library provides a ready-to-use PIN screen, secure storage, lockout protection, and biometric login, while allowing full control over UI customization.
---
## Installation
Install the package:

yarn add @kruglyanski/react-native-secure-pin-code
or
npm install @kruglyanski/react-native-secure-pin-code

Install required native dependencies:

yarn add react-native-keychain react-native-biometrics react-native-device-info

Then install iOS pods:

cd ios && pod install

---

## Features

- Secure PIN storage using native keychain
- Configurable PIN length (4–8 digits)
- Lockout after multiple failed attempts
- Biometric authentication (Face ID / Touch ID / Android Biometrics)
- Fully customizable UI
- Clean Provider + Hook API
- Works with the New Architecture
- Written in TypeScript

---

## Important Usage Rule

⚠️ **SecurePinProvider is required**

Both:
- `useSecurePin`
- `SecurePinScreen`

**MUST be rendered inside `SecurePinProvider`.**

The hook and the screen will NOT work outside the provider.

---

## SecurePinProvider

The provider is responsible for:
- PIN storage
- Attempt counting
- Lock timers
- Biometric authentication
- Global PIN state

### SecurePinProvider props

- **children**  
  Your application content.

- **maxAttempts** (optional)  
  Maximum number of allowed failed PIN attempts before lock.  
  Default: `3`

- **lockDurationSec** (optional)  
  Lock duration in seconds after exceeding max attempts.  
  Default: `30`

- **biometryPromptText** (optional)  
  Text shown in biometric authentication prompt.

- **biometryPromptCancelText** (optional)  
  Cancel button text in biometric prompt.

- **showBiometrics** (optional)  
  Enables biometric login availability.  
  Default: `true`

---

## useSecurePin Hook

The hook provides access to PIN state and actions.

### Returned API description

- **hasPin**  
  Indicates whether a PIN is already set.  
  `true`, `false`, or `null` while loading.

- **isLocked**  
  Whether PIN input is currently locked.

- **lockUntil**  
  Timestamp (ms) when the lock will be released, or `null`.

- **attemptsLeft**  
  Number of remaining attempts before lock.

- **setPin(pin)**  
  Saves a new PIN securely.

- **checkPin(pin)**  
  Verifies the entered PIN.

- **loginWithBiometrics()**  
  Attempts biometric authentication.

- **deletePin()**  
  Removes the stored PIN.

---

## SecurePinScreen

A fully controlled UI component that handles:
- PIN creation
- PIN confirmation
- PIN verification
- Lock state UI
- Error and status messages

### SecurePinScreen props

#### Behavior

- **pinLength**  
  Length of the PIN.  
  Supported values: 4–8

- **onSuccess**  
  Called when PIN is successfully created or verified.

- **onPressForgetPin**  
  Required callback for "Forgot PIN" action.

- **allowFontScaling**  
  Enables or disables font scaling.  
  Default: `true`

---

#### Text customization

- **titleSet**  
  Title shown when creating a PIN.

- **titleEnter**  
  Title shown when entering a PIN.

- **enterMessage**  
  Message shown on PIN entry screen.

- **createMessage**  
  Message shown on PIN creation screen.

- **confirmMessage**  
  Message shown on PIN confirmation screen.

- **doNotMatchMessage**  
  Message shown when PINs do not match.

- **lockedMessage**  
  Message shown when input is locked.

- **wrongPinMessage**  
  Function returning message when PIN is incorrect.  
  Receives `attemptsLeft`.

- **textDescriptionLockedPage**  
  Main lock screen description.

- **textSubDescriptionLockedPage**  
  Secondary lock screen description.

- **exitButtonText**  
  Text for exit / logout button on lock screen.

---

#### Style customization

- **containerStyle**
- **titleStyle**
- **subtitleStyle**
- **lockTextStyle**
- **keyPadStyle**
- **keyStyle**
- **keyTextStyle**

All style props accept standard React Native style objects.

---

#### UI customization

- **eraseComponent**  
  Custom component for the erase (backspace) button.

---

## Dependencies

This library relies on the following native dependencies:

- `react-native-keychain`
- `react-native-biometrics`
- `react-native-device-info`

They must be installed and properly linked in your project.

---

## Platform Support

- iOS
- Android

Supports the New Architecture.

---

## License

MIT © Roman Kruglyanski
