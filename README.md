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

---

## Quick Start

### Install dependencies
```bash
npm install
```

### Run locally (web development)
```bash
npm run dev
```
Open the URL shown by Vite in your browser (usually `http://localhost:5173`).

### Build the web app
```bash
npm run build
```
Output: optimized production build in `dist/`

### Lint
```bash
npm run lint
```

---

## Project Structure

- `src/App.jsx` — main app logic, genre data, UI, persistence, and mobile behavior
- `src/main.jsx` — React bootstrapping
- `src/index.css` — Tailwind CSS entrypoint
- `vite.config.js` — Vite config
- `tailwind.config.js` — Tailwind config
- `eslint.config.js` — ESLint config
- `capacitor.config.json` — Capacitor metadata
- `android/` — Capacitor Android wrapper (generated)

---

## Android & Packaging

This repo uses **Capacitor** to package the web app as an Android app.

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Full Build Pipeline](#full-build-pipeline-clone-to-apk-to-phone)
3. [Quick Rebuild for Iteration](#development-workflow)
4. [Signing for Production](#signing-the-release-apk)
5. [Troubleshooting](#troubleshooting)

### Prerequisites

Before building for Android, install:

1. **Node.js & npm** (v16 or higher)
   - https://nodejs.org

2. **Java Development Kit (JDK) 17 or higher**
   - macOS: `brew install openjdk@17`
   - Ubuntu/Debian: `sudo apt-get install openjdk-17-jdk`
   - Windows: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

3. **Android SDK**
   - **Option A: Android Studio (Recommended)**
     - https://developer.android.com/studio
     - SDK Manager will install required tools
   - **Option B: Command-line tools only**
     - https://developer.android.com/studio
     - Extract to `/opt/android-sdk` (or your preferred location)
     - Install packages:
       ```bash
       sdkmanager "platforms;android-33" "build-tools;30.0.3" "platform-tools"
       ```

4. **Set Android SDK environment variable**
   - macOS/Linux: Add to `~/.bashrc` or `~/.zshrc`:
     ```bash
     export ANDROID_SDK_ROOT=/path/to/android-sdk
     export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
     ```
   - Windows: Set `ANDROID_SDK_ROOT` in System Properties → Environment Variables
   - Verify: `echo $ANDROID_SDK_ROOT`

### Full Build Pipeline: Clone to APK to Phone

**Step 1: Clone and set up**
```bash
git clone https://github.com/ADD3M/adams-genres.git
cd adams-genres
npm install
```

**Step 2: Test the web app**
```bash
npm run dev
```
Verify the app works in your browser. Press `Ctrl+C` to stop.

**Step 3: Build the web app**
```bash
npm run build
```

**Step 4: Sync to Android project**
```bash
npx cap copy android
```
Copies web assets from `dist/` → `android/app/src/main/assets/public/`

**Step 5: Build the APK**

*Debug APK (for testing):*
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

*Release APK (for production):*
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk` (unsigned)

**Step 6: Install on a device or emulator**

*Using Android Studio Emulator:*
1. Open Android Studio → AVD Manager → Create or start a device
2. Install the APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

*Using a physical Android phone:*
1. Enable Developer Mode:
   - Settings → About Phone → tap Build Number 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect via USB
4. Verify connection:
   ```bash
   adb devices
   ```
5. Install:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

**Step 7: Launch the app**
The app will appear on your home screen. Tap to open.

### Development Workflow

After making changes to the web app:
1. Test: `npm run dev`
2. Build: `npm run build`
3. Sync: `npx cap copy android`
4. Rebuild APK: `cd android && ./gradlew assembleDebug`
5. Reinstall: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`

### Signing the Release APK

For Play Store or production distribution, sign the APK with a keystore.

**Generate a keystore (first time only):**
```bash
keytool -genkey -v -keystore adams-genres.keystore -alias adams-genres-key \
  -keyalg RSA -keysize 2048 -validity 10000
```
Save this file securely.

**Sign the APK:**
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore adams-genres.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk adams-genres-key
```

**Align the APK (required for Play Store):**
```bash
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk \
  android/app/build/outputs/apk/release/app-release-signed.apk
```

Result: `android/app/build/outputs/apk/release/app-release-signed.apk` ready for submission.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot find Android SDK | Verify `ANDROID_SDK_ROOT` is set correctly. Run `adb devices` to test. |
| Java version mismatch | Ensure Java 17+: `java -version`. Set `JAVA_HOME` if needed. |
| Gradle license errors | Run `sdkmanager --licenses` and accept all, or use Android Studio's SDK Manager. |
| Gradle build fails | Run `./gradlew clean` and rebuild. Check `android/local.properties` has correct `sdk.dir`. |
| App crashes on device | Check logs: `adb logcat`. Verify permissions in `AndroidManifest.xml`. |

---

## Notes

- `src/App.css` exists but is not used.
- `dist/` and `android/build/` are build output and not committed.
- The app is plain JavaScript/JSX; do not convert to TypeScript unless requested.
- `android/` is Capacitor-managed. Make web changes in `src/` and use Capacitor sync commands.
