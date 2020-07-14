[![Node Version](https://img.shields.io/badge/nodejs-14.5.0-blue.svg)](https://nodejs.org)
[![Build Status](https://img.shields.io/jenkins/build/https/jenkins.carelulu.com/job/react-native-web-skeleton/job/master.svg)](https://jenkins.carelulu.com/blue/organizations/jenkins/react-native-web-skeleton/activity)
[![Dependencies](https://img.shields.io/badge/dependencies-renovate-brightgreen.svg)](https://github.com/CareLuLu/react-native-web-skeleton/issues/1)
[![Codacy Badge](https://img.shields.io/codacy/grade/275359a12b3f4273a29dc02c52c4aa63/master)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=CareLuLu/react-native-web-skeleton&amp;utm_campaign=Badge_Grade)

This is a multiplatform production ready app coded for Android, iOS, Mobile Web Responsiveness, Web Client-side Rendering (CSR), Server-side Rendering (SSR) and Google Accelerated Mobile Pages (AMP).

See this project in production at https://www.carelulu.com
See this project example at https://wwww.carelulu.com/react-native-web-skeleton

## Table of Contents

* [Setup](#setup)
  * [Node](#node)
  * [Environment Variables](#environment-variables)
  * [NPM Packages](#npm-packages)
* [Available Scripts](#available-scripts)
  * [yarn lint](#yarn-lint)
  * [yarn ios](#yarn-ios)
  * [yarn android](#yarn-android)
  * [yarn web](#yarn-web)
  * [yarn web:build](#yarn-webbuild)
  * [yarn web:server](#npm-run-webserver)
  * [yarn web:server:run](#npm-run-webserverrun)
* [Troubleshooting](#troubleshooting)
  * [Networking](#networking)
  * [iOS Simulator won't open](#ios-simulator-wont-open)
  * [QR Code does not scan](#qr-code-does-not-scan)

## Setup

Please follow the steps below to set up your local environment.

### Node

This project requires [Node.js](https://nodejs.org/) v10.0.0+ to run.
First, go the project's root, install the appropriate NVM version and install project's dependencies and devDependencies:

```sh
nvm install 10.0.0
git clone git@github.com:CareLuLu/v3-app.git
cd v3-app
```

### Environment Variables

Please create a `.env` file based on `.env.sample`. To add new environment variables, take a look at [/src/config/index.js](./src/config/index.js).

### NPM Packages

Please install the npm packages.

```sh
yarn
```

## Available Scripts

If Yarn was installed when the project was initialized, then dependencies will have been installed via Yarn, and you should probably use it to run these commands as well. Unlike dependency installation, command running syntax is identical for Yarn and NPM at the time of this writing.

### `yarn lint`

Run the linter using `eslint`

### `yarn run ios`

Run the expo application but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

### `yarn run android`

Run the expo application but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup).

### `yarn web`

Run the application on web (Client-Side Rendering, CSR).

### `yarn web:build`

Build the server for Server-side Rendering.

### `yarn run web:server`

Build and Run the application on web (Server-Side Rendering, SSR).

### `yarn run web:server:run`

Run the built application on web (Server-Side Rendering, SSR).

## Troubleshooting

### Networking

If you're unable to load your app on your phone due to a network timeout or a refused connection, a good first step is to verify that your phone and computer are on the same network and that they can reach each other. Create React Native App needs access to ports 19000 and 19001 so ensure that your network and firewall settings allow access from your device to your computer on both of these ports.

Try opening a web browser on your phone and opening the URL that the packager script prints, replacing `exp://` with `http://`. So, for example, if underneath the QR code in your terminal you see:

```
exp://192.168.0.1:19000
```

Try opening Safari or Chrome on your phone and loading

```
http://192.168.0.1:19000
```

and

```
http://192.168.0.1:19001
```

If this works, but you're still unable to load your app by scanning the QR code, please open an issue on the [Create React Native App repository](https://github.com/react-community/create-react-native-app) with details about these steps and any other error messages you may have received.

If you're not able to load the `http` URL in your phone's web browser, try using the tethering/mobile hotspot feature on your phone (beware of data usage, though), connecting your computer to that WiFi network, and restarting the packager. If you are using a VPN you may need to disable it.

### iOS Simulator won't open

If you're on a Mac, there are a few errors that users sometimes see when attempting to `npm run ios`:

* "non-zero exit code: 107"
* "You may need to install Xcode" but it is already installed
* and others

There are a few steps you may want to take to troubleshoot these kinds of errors:

1. Make sure Xcode is installed and open it to accept the license agreement if it prompts you. You can install it from the Mac App Store.
2. Open Xcode's Preferences, the Locations tab, and make sure that the `Command Line Tools` menu option is set to something. Sometimes when the CLI tools are first installed by Homebrew this option is left blank, which can prevent Apple utilities from finding the simulator. Make sure to re-run `npm/yarn run ios` after doing so.
3. If that doesn't work, open the Simulator, and under the app menu select `Reset Contents and Settings...`. After that has finished, quit the Simulator, and re-run `npm/yarn run ios`.

### QR Code does not scan

If you're not able to scan the QR code, make sure your phone's camera is focusing correctly, and also make sure that the contrast on the two colors in your terminal is high enough. For example, WebStorm's default themes may [not have enough contrast](https://github.com/react-community/create-react-native-app/issues/49) for terminal QR codes to be scannable with the system barcode scanners that the Expo app uses.

If this causes problems for you, you may want to try changing your terminal's color theme to have more contrast, or running Create React Native App from a different terminal. You can also manually enter the URL printed by the packager script in the Expo app's search bar to load it manually.
