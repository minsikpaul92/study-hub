Source: <https://seneca-ictoer.github.io/WEB530/H-Expo/expo>

# Introduction to Expo

## What is Expo?

Expo is an open-source framework and platform built on top of **React Native**. It provides a robust set of tools, libraries, and services that radically simplify mobile app development by abstracting away the complex, platform-specific ecosystems of iOS and Android.

By leveraging Expo, you can build truly native cross-platform mobile applications using only **JavaScript or TypeScript**.

### Core Benefits

* **Zero Native Configuration:** You don't need to touch Java, Objective-C, Swift, or complex build Gradle files to get started.
* **Unified API:** Access native device hardware (like the camera, biometrics, location, and sensors) through a single, consistent JavaScript API.
* **Instant Over-the-Air (OTA) Updates:** Publish updates directly to your users instantly, bypassing the lengthy App Store or Google Play review processes for minor changes and bug fixes.
* **Universal Development:** Write code once and run it seamlessly on Android, iOS, and even the Web.

## Expo vs. Bare React Native

When building a mobile app with standard ("bare") React Native, you are responsible for managing two entirely separate native projects: an Android project (built with Java/Kotlin) and an iOS project (built with Swift/Objective-C). This requires installing heavy software like Android Studio and Xcode, configuring environment variables, and dealing with mismatched build tools.

Expo eliminates this friction by wrapping around React Native.

| Feature | Bare React Native | Expo (Managed Workflow) |
| --- | --- | --- |
| **Language Requirements** | JavaScript + Swift/Kotlin (for native modules) | Strictly JavaScript / TypeScript |
| **Development Machine** | Requires macOS for iOS builds; Windows/Linux/macOS for Android | Any OS (Windows, Mac, Linux) can build for both platforms |
| **Setup Overhead** | High (Xcode, Android Studio, SDKs, Emulators) | Low (Node.js, VS Code, and a mobile device) |
| **Native Code Access** | Direct access to modify native directories | Handled via Expo Config Plugins (no direct native editing required) |

## Moving Beyond Expo Snack

Up until this point, you have been using **Expo Snack** to write and test code directly in your web browser. Snack is an amazing playground for prototyping, but it has concrete limitations when building real-world production applications.

Graduating from Snack to a local development workflow unlocks the capabilities required for professional software engineering:

* **Complete File Control:** Instead of working in a single browser tab, your project lives entirely on your machine. You can structure complex directories, manage assets locally, and use Git version control.
* **Advanced Code Editing:** You get the full power of VS Code, including real-time linting, code snippets, local extensions, and robust debugging tools.
* **Unlimited Ecosystem Access:** Snack only supports a curated subset of npm packages. Local development allows you to install *any* third-party package or library available in the Node ecosystem.
* **Offline Development:** You don't need an active internet connection to compile and test code on your local network.

💡 **The good news:** Your React Native code does not change! Writing a component locally in VS Code uses the exact same syntax, hooks, and layout logic you learned inside Expo Snack.

## How Expo Works: The Managed Workflow

In this course, we utilize the **Managed Workflow**. Under this model, Expo handles the native iOS and Android compilation under the hood. You only deal with the JavaScript/TypeScript layer.

### The Magic of Expo Go

The fastest way to develop with Expo is using **Expo Go**, the same client application you used to preview your Snacks on a physical phone.

When you run your development server locally on your computer using the command line interface (CLI), Expo doesn't compile a massive binary file and push it to your phone. Instead, it starts a local bundler called **Metro** that bundles your JavaScript files.

The Expo Go app on your phone opens this bundle via a local network connection (or a secure tunnel) and renders it instantly using your device's native rendering engines.

💡 **Think of Expo Go like a web browser for mobile apps:** Your local computer acts as the web server hosting your project files, and Expo Go acts as the mobile browser rendering native components dynamically.

## Creating a New Expo Project

If you haven't already done so, please follow the steps outlined in [Setup Tools & Dev Environment](https://seneca-ictoer.github.io/WEB530/Z-Guides/tool-dev-setup).

1. Start VS Code.
2. Choose `File`, `Open Folder...`. It is recommended you choose an empty folder however you will create a new folder for your application in the next step.
3. Type `npx create-expo-app myapp --template blank` (where `myapp` refers to the name of the application folder you want to create).

* `Ok to proceed? (y)` - You may be asked to install packages, press `y` or `ENTER` to install the packages and proceed.
* `Select an Expo SDK version` - Choose `For learning with Expo Go (SDK 54)`.
* The installation may take a minute or two to complete.

4. Move into the project folder: `cd myapp`.
5. Start the development server: `npx expo start --tunnel`.

* If asked, install `@expo/ngrok`.

⚠️ It is not uncommon to receive an error like:
`CommandError: Please install @expo/ngrok@^4.1.0 and try again`

💡If you receive the above message, try installing `ngrok` manually:
`npm install -g @expo/ngrok@4.1.0`
`npm install --save-dev @expo/ngrok@^4.1.0`

## Running Your New App

You can run your app in several ways:

* On your phone (recommended)
  + Install Expo Go from the App Store or Google Play
  + Scan the QR code from Expo Dev Tools
  + Your app loads instantly

On a simulator/emulator

* iOS Simulator (macOS only)
* Android Emulator (optional)

💡 If you receive an error that Expo Go needs to be updated on your device,
it may be that the version available in the store is outdated. You can manually
install the latest version by going to (<https://expo.dev/go>).

## Modifying the App

You can make changes to App.js (just like when working with Snack). When creating custom components, add them to a subfolder called `/components`.
