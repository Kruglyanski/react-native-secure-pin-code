# Example App

This folder contains a demo React Native application used to test and showcase the `@kruglyanski/react-native-secure-pin-code` library.

The example app is not meant for production. It exists only to validate the library behavior during development.

---

## Prerequisites

* Node.js (recommended: LTS)
* Yarn (Berry)
* React Native development environment set up (Xcode / Android Studio)

---

## Installation

> ⚠️ Important: Dependencies are installed only in the root of the monorepo.

From the **root directory**:


yarn install


Then build the library:


cd packages/react-native-secure-pin
yarn build


---

## Running the Example App

From the `example` directory:

### iOS

cd example
yarn ios

Don't forget to run `yarn pod install` before running the app

### Android


cd example
yarn android

---

## How It Works

* The example app imports the library via Yarn workspace, not from npm


cd packages/react-nativesecure-pin
yarn build
yarn watch to watch for changes

* After rebuilding, restart Metro if needed:


yarn start --reset-cache

---

## What to Edit

* App entry point: `example/App.tsx`
* Library source: `packages/react-native-secure-pin/src`

---

## Notes

* Do not run `yarn install` inside `example`
* Do not publish anything from this folder
* This app exists only for local development and testing

---
