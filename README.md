# Adams Genres

Adams Genres is a mobile-first React + Vite app for generating electric-guitar-friendly genre and subgenre prompts.
It is packaged for Android using Capacitor, with a touch-friendly interface and local persistence.

## Overview
- Generate guitar practice prompts by rolling genres and subgenres.
- Lock a genre for focused results.
- Copy the current prompt to clipboard.
- Share the current prompt via native share or copy fallback.
- Save recent rolls and restore them with a tap.
- Favorite best prompts for quick restore.
- Add custom genres and subgenres in-app.
- Toggle between dark and light themes.
- Works well on mobile and also supports desktop keyboard shortcuts.

## Features
- Mobile-friendly UI with touch controls
- Genre lock dropdown
- Reroll button and "Reroll subgenre" button
- Favorite a prompt and restore favorites quickly
- Custom genre and subgenre creation
- Dark/light theme toggle
- Native share support with copy fallback
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
5. Tap **Share** to use native sharing or copy text manually.
6. Tap **Favorite** to save the best prompts.
7. Tap a history item to restore that roll.
8. Tap **Clear** to empty the history.

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

1. **Node.js & npm** (v16 or higher)
   ```bash
   sudo apt-get install nodejs npm
   ```
   Or download from https://nodejs.org

2. **Java Development Kit (JDK) 17 or higher**
   ```bash
   sudo apt-get install openjdk-17-jdk
   ```
   Verify: `java -version`

3. **Android SDK**
   - **Easiest:** Download [Android Studio](https://developer.android.com/studio)
   - **Or CLI only:** Install cmdline-tools and run:
     ```bash
     sdkmanager "platforms;android-33" "build-tools;30.0.3" "platform-tools"
     ```

4. **Set Android SDK path**
   Add to `~/.bashrc` or `~/.zshrc`:
   ```bash
   export ANDROID_SDK_ROOT=/path/to/android-sdk
   export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
   ```
   Then reload: `source ~/.bashrc`

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
| `adb devices` shows nothing | Check USB Debugging is enabled. Try a different USB cable or port. |
| Gradle build fails | Run `./gradlew clean` and try again. |
| Java version error | Verify Java 17+: `java -version`. Set `JAVA_HOME` if needed: `export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64` |
| Cannot find Android SDK | Check `ANDROID_SDK_ROOT` or `ANDROID_HOME` is set: `echo $ANDROID_SDK_ROOT` and `echo $ANDROID_HOME`. |
| `cordova.variables.gradle` missing | Re-sync Capacitor from the repo root: `npx cap sync android` or `npx cap update android`. |
| Gradle says `SDK location not found` | Create or edit `android/local.properties` and add: `sdk.dir=/path/to/your/Android/Sdk`. If you prefer the terminal, export it before building: `export ANDROID_SDK_ROOT=/path/to/your/Android/Sdk` and `export ANDROID_HOME=/path/to/your/Android/Sdk`. |
| Build is using the wrong project path | Run the commands from the repo root, not from inside `android/` unless you are already there. |
| Capacitor plugin files are stale | From the repo root, remove the generated plugins folder if needed and resync: `rm -rf android/capacitor-cordova-android-plugins && npx cap sync android`. |
| Local repo is behind remote | Pull the latest changes before rebuilding: `git pull origin main`. |

### Useful local commands

```bash
cd ~/adams-genres
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

If you are building on a different machine, make sure the Android SDK path in `android/local.properties` matches that machine.

---

## Notes

- `src/App.css` exists but is not used.
- `dist/` and `android/build/` are build output and not committed.
- The app is plain JavaScript/JSX; do not convert to TypeScript unless requested.
- `android/` is Capacitor-managed. Make web changes in `src/` and use Capacitor sync commands.
