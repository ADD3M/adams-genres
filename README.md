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

This repo uses **Capacitor** to package the web app as an Android app. This guide covers building a debug APK for personal testing on your phone via USB.

### Prerequisites

1. **Node.js & npm** (v16 or higher) — https://nodejs.org

2. **Java Development Kit (JDK) 17 or higher**
   - macOS: `brew install openjdk@17`
   - Ubuntu/Debian: `sudo apt-get install openjdk-17-jdk`
   - Windows: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

3. **Android SDK**
   - **Easiest:** Download [Android Studio](https://developer.android.com/studio) (includes everything)
   - **Or CLI only:** Install cmdline-tools and run:
     ```bash
     sdkmanager "platforms;android-33" "build-tools;30.0.3" "platform-tools"
     ```

4. **Set Android SDK path**
   - macOS/Linux: Add to `~/.bashrc` or `~/.zshrc`:
     ```bash
     export ANDROID_SDK_ROOT=/path/to/android-sdk
     export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
     ```
   - Windows: Set `ANDROID_SDK_ROOT` in System Properties → Environment Variables

### Build and Send to Your Phone

**Step 1: Prepare the web app**
```bash
npm run build
npx cap copy android
```

**Step 2: Build the APK**
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

**Step 3: Connect your phone and install**

Enable USB Debugging on your phone:
- Settings → About Phone → tap Build Number 7 times
- Settings → Developer Options → enable USB Debugging
- Connect via USB cable

Then install:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Step 4: Done!**
The app will appear on your home screen. Tap to open.

### Quick iteration workflow

After making code changes:
```bash
npm run build
npx cap copy android
cd android && ./gradlew assembleDebug
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Troubleshooting

| Issue | Fix |
|-------|-----|
| `adb devices` shows nothing | Check USB Debugging is enabled. Try different USB cable. |
| Gradle build fails | Run `./gradlew clean` and try again. |
| Java version error | Verify Java 17+: `java -version`. Set `JAVA_HOME` if needed. |
| Cannot find Android SDK | Check `ANDROID_SDK_ROOT` is set: `echo $ANDROID_SDK_ROOT` |

---

## Notes

- `src/App.css` exists but is not used.
- `dist/` and `android/build/` are build output and not committed.
- The app is plain JavaScript/JSX; do not convert to TypeScript unless requested.
- `android/` is Capacitor-managed. Make web changes in `src/` and use Capacitor sync commands.
