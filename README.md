# React Native Secure PIN Monorepo

This repository is a monorepo* that contains:

* Library: `@kruglyanski/react-native-secure-pin-code`
* Example app for development and manual testing

The project is managed using Yarn workspaces.

---

## Requirements

* Node.js (recommended: LTS)
* Yarn (Berry)
* React Native development environment set up (Xcode / Android Studio)

---

## Installation

⚠️ Important:Dependencies must be installed only once, from the root of the repository.

yarn install

Do not run `yarn install` inside `example` or library folders.

---

## Building the library

After installing dependencies, you must build the library **before running the example app**.

cd packages/react-native-secure-pin-code
yarn build


This will generate the compiled output used by the example app.

---

## Running the example app

cd example

yarn ios

yarn android

---

## Development workflow

1. Make changes in the library source code
2. Run `yarn build` inside the library folder
3. Run `yarn watch` inside the library folder to watch for changes
4. Restart the example app if needed

Because this is a workspace setup, the example app always uses the local version of the library.

---

## Publishing

The library is published to npm as:

@kruglyanski/react-native-secure-pin-code

Publishing is done from the library folder only.

---

## License

MIT © Roman Kruglyanski
