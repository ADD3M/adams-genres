# Adams Genres

Adams Genres is a mobile-first React + Vite app for generating electric-guitar-friendly genre and subgenre prompts.
It is packaged for Android using Capacitor, with a touch-friendly interface and local persistence.

## Overview
- Generate guitar practice prompts by rolling genres and subgenres.
- Lock a genre for focused results.
- Copy the current prompt to clipboard.
- Save recent rolls and restore them with a tap.
- Works well on mobile and also supports desktop keyboard shortcuts.

## Features
- Mobile-friendly UI with touch controls
- Genre lock dropdown
- Reroll button and "Reroll subgenre" button
- Recent roll history with restore-on-tap
- Toast feedback for actions
- Local storage persistence
- Supports `Space` = reroll and `C` = copy on desktop
- Capacitor Android packaging support

## Usage
1. Open the app.
2. Choose a genre or leave it on `Any`.
3. Tap **Reroll** to generate a new genre + subgenre.
4. Tap **Reroll subgenre** to keep the current genre and refresh only the subgenre.
5. Tap **Copy** to copy the current prompt.
6. Tap a history item to restore that roll.
7. Tap **Clear** to empty the history.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL shown by Vite in your browser.

## Build

```bash
npm run build
```

The production build is output to `dist/`.

## Lint

```bash
npm run lint
```

## Android / Capacitor

This repo uses Capacitor to package the web app as an Android app.

### Prerequisites

Before building for Android, you need:

1. **Node.js & npm** (v16 or higher)
   - Download from https://nodejs.org

2. **Java Development Kit (JDK) 17 or higher**
   - macOS: `brew install openjdk@17`
   - Ubuntu/Debian: `sudo apt-get install openjdk-17-jdk`
   - Windows: Download from https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

3. **Android SDK**
   - **Option A: Android Studio (Recommended)**
     - Download from https://developer.android.com/studio
     - During installation, SDK Manager will install Android SDK, Build-Tools, and Platform-Tools
   - **Option B: Command-line tools only**
     - Download from https://developer.android.com/studio
     - Extract to a known location (e.g., `/opt/android-sdk`)
     - Run `sdkmanager` to install:
       ```bash
       sdkmanager "platforms;android-33" "build-tools;30.0.3" "platform-tools"
       ```

4. **Android SDK environment variable**
   - Set `ANDROID_SDK_ROOT` (or `ANDROID_HOME`) to your SDK location
   - macOS/Linux: Add to `~/.bashrc` or `~/.zshrc`:
     ```bash
     export ANDROID_SDK_ROOT=/path/to/android-sdk
     export PATH=$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools
     ```
   - Windows: Set via System Properties → Environment Variables
   - Verify: `echo $ANDROID_SDK_ROOT`

### Full Build Pipeline: Clone to APK to Phone

#### Step 1: Clone and Set Up
```bash
git clone https://github.com/ADD3M/adams-genres.git
cd adams-genres
npm install
```

#### Step 2: Test the Web App
```bash
npm run dev
```
Open the URL in your browser (usually `http://localhost:5173`). Verify the app works and features function correctly. Press `Ctrl+C` to stop the dev server.

#### Step 3: Build the Web App
```bash
npm run build
```
This creates an optimized production build in the `dist/` folder.

#### Step 4: Sync Web Assets to Android Project
```bash
npx cap copy android
```
This copies the built web app from `dist/` into the Android project's `www/` folder.

#### Step 5: Build the APK

##### Option A: Debug APK (for testing on emulator or device)
```bash
cd android
./gradlew assembleDebug
```
Output location: `android/app/build/outputs/apk/debug/app-debug.apk`

##### Option B: Release APK (for production/Play Store)
```bash
cd android
./gradlew assembleRelease
```
Output location: `android/app/build/outputs/apk/release/app-release.apk`

**Note:** Release builds require signing with a keystore. See "Signing the Release APK" below.

#### Step 6: Install on an Android Device or Emulator

##### Using Android Studio Emulator:
1. Open Android Studio
2. Click "AVD Manager" → Create a Virtual Device (or use an existing one)
3. Start the emulator
4. In terminal, install the APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

##### Using a Physical Android Phone:
1. Enable **Developer Mode** on your phone:
   - Go to Settings → About Phone → Build Number
   - Tap Build Number 7 times
2. Enable **USB Debugging**:
   - Go to Settings → Developer Options → USB Debugging
3. Connect phone via USB cable
4. Verify connection:
   ```bash
   adb devices
   ```
   You should see your device listed.
5. Install the APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### Step 7: Run on Your Device
After installation, the app will appear on your home screen. Tap to launch.

### Signing the Release APK

For Play Store or production distribution, the release APK must be signed with a keystore.

#### Generate a Keystore (first time only):
```bash
keytool -genkey -v -keystore adams-genres.keystore -alias adams-genres-key -keyalg RSA -keysize 2048 -validity 10000
```
You'll be prompted for a password and keystore details. **Save this file securely.**

#### Sign the Release APK:
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore adams-genres.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk adams-genres-key
```

#### Align the APK (required for Play Store):
```bash
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk \
  android/app/build/outputs/apk/release/app-release-signed.apk
```

The signed APK is now ready: `android/app/build/outputs/apk/release/app-release-signed.apk`

### Troubleshooting

**"Cannot find Android SDK"**
- Verify `ANDROID_SDK_ROOT` is set and points to a valid SDK directory
- Run `adb devices` to confirm platform-tools are accessible

**"Java version mismatch"**
- Ensure Java 17+ is in PATH: `java -version`
- On Linux/macOS, set `JAVA_HOME` if needed: `export JAVA_HOME=/path/to/java17`

**"License not accepted"**
- Run: `sdkmanager --licenses` and accept all licenses
- Or use Android Studio's SDK Manager GUI

**"Gradle build fails"**
- Run `./gradlew clean` to clear build cache
- Ensure all prerequisites are installed
- Check that `android/local.properties` contains the correct `sdk.dir` path

**"App crashes on device"**
- Check logs: `adb logcat`
- Verify permissions in `android/app/src/main/AndroidManifest.xml`

### Development Workflow

After making changes to the web app:
1. Test locally: `npm run dev`
2. Build: `npm run build`
3. Sync to Android: `npx cap copy android`
4. Rebuild APK: `cd android && ./gradlew assembleDebug`
5. Reinstall: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`

### Project Files

Native Android files are located in `android/`.

- To refresh Android assets after changing web code:
  ```bash
  npm run build
  npx cap copy android
  ```
- To sync native plugin changes:
  ```bash
  npx cap sync android
  ```

> Only edit `android/` when making platform-specific native changes.

## Project structure

- `src/App.jsx` — main app logic, genre data, UI, persistence, and mobile behavior
- `src/main.jsx` — React bootstrapping
- `src/index.css` — Tailwind CSS entrypoint
- `vite.config.js` — Vite config
- `tailwind.config.js` — Tailwind config
- `eslint.config.js` — ESLint config
- `capacitor.config.json` — Capacitor metadata
- `android/` — generated Android wrapper

## Notes
- `src/App.css` exists but is not used.
- `dist/` is build output and should not be committed.
- The app is intentionally plain JavaScript/JSX; do not convert to TypeScript unless requested.
