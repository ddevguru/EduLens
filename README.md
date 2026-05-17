# EduLens — Mobile UI (Member 3: Frontend + Voice)

An **offline-first, multimodal AI tutor** for underserved students across
India, Africa and Southeast Asia. EduLens runs **Gemma 4 (E2B, 4-bit)**
on-device via **Google LiteRT** — a student photographs a textbook page,
gets a step-by-step explanation in their own language, and answers adaptive
quizzes. Teachers see class-wide learning gaps, synced entirely by QR code.
No internet. No accounts. No cloud.

This repository is the **React Native (Expo) frontend** — all 21 screens,
built to feel like a soft Ghibli-style storybook rather than a sterile app.

---

## ✨ Design language

The brief asked for two things that pull in opposite directions — *"each
screen should feel like a surreal anime scene"* and *"a soothing WordPress
website look"*. EduLens resolves this as a **storybook rendered as an app**:

- **Editorial layout** — serif display headings (Fraunces), small kicker
  labels above titles, generous whitespace, calm card-based sections. This
  is the "WordPress / magazine" structure.
- **Anime illustration panels** — every screen is anchored by a full-bleed
  illustration with a warm gradient sky. This is the "surreal anime scene".
- **A warm dawn palette** — aged-paper backgrounds, dawn-indigo skies,
  sunrise-coral actions, meadow-sage for success. The student flow moves
  through the *times of a day*; the teacher flow is a quiet *evening*.
- **Child-first ergonomics** — large tap targets, minimal text, friendly
  rounded shapes, soft warm shadows (never harsh grey).

Everything is theme-driven — colours, gradients, spacing, type and shadows
all live in `src/theme/tokens.js`, so the whole app re-skins from one file.

---

## 📱 The 21 screens

**Student flow (1–14)**

| # | Screen | File |
|---|--------|------|
| 1 | Splash | `src/screens/student/SplashScreen.js` |
| 2 | Welcome (Student / Teacher) | `src/screens/student/WelcomeScreen.js` |
| 3 | Profile Select | `src/screens/student/ProfileSelectScreen.js` |
| 4 | New Profile | `src/screens/student/NewProfileScreen.js` |
| 5 | PIN Unlock / Setup | `src/screens/student/PinUnlockScreen.js` |
| 6 | Capture Hub (home) | `src/screens/student/CaptureHubScreen.js` |
| 7 | Camera Scan | `src/screens/student/CameraScreen.js` |
| 8 | AI Loading | `src/screens/student/AILoadingScreen.js` |
| 9 | Lesson Studio | `src/screens/student/LessonScreen.js` |
| 10–12 | Challenge Arena (+ correct / incorrect states) | `src/screens/student/QuizScreen.js` |
| 13 | Session Summary | `src/screens/student/SummaryScreen.js` |
| 14 | Student QR Export | `src/screens/student/QRExportScreen.js` |

**Teacher flow (15–21)**

| # | Screen | File |
|---|--------|------|
| 15 | Teacher PIN Login | `src/screens/teacher/TeacherLoginScreen.js` |
| 16 | Teacher Dashboard | `src/screens/teacher/TeacherDashboardScreen.js` |
| 17 | Topic Mastery (heatmap) | `src/screens/teacher/TopicMasteryScreen.js` |
| 18 | Student Detail | `src/screens/teacher/StudentDetailScreen.js` |
| 19 | Teacher QR Scanner | `src/screens/teacher/TeacherScannerScreen.js` |
| 20 | QR Import States (success / duplicate / invalid) | `src/screens/teacher/QRImportScreen.js` |
| 21 | Settings | `src/screens/teacher/SettingsScreen.js` |

Quiz screens 10–12 are one stateful screen (the Challenge Arena handles its
own correct/incorrect feedback). QR import screen 20 renders all three
outcomes — pass `route.params.result` as `'success' | 'duplicate' | 'invalid'`.

---

## 🗂 Project structure

```
edulens/
├── App.js                      # font loading + providers + navigation
├── app.json                    # Expo config
├── babel.config.js
├── package.json
├── assets/
│   ├── illustrations/          # ← drop your Gemini anime art here
│   └── avatars/                # ← optional avatar art
└── src/
    ├── theme/
    │   ├── tokens.js           # colours, gradients, spacing, type, shadow
    │   └── illustrations.js    # central illustration registry + AI prompts
    ├── components/
    │   ├── Illustration.js     # real-image OR placeholder renderer
    │   ├── ui.js               # ScreenScaffold, PrimaryButton, Card, …
    │   └── widgets.js          # Avatar, ScreenHeader, PinPad, MasteryBar, …
    ├── navigation/
    │   └── RootNavigator.js    # native stack wiring all 21 screens
    └── screens/
        ├── student/            # screens 1–14
        └── teacher/            # screens 15–21
```

---

## 🖼 Swapping in your Gemini anime art

Every illustration is referenced through **one file**:
`src/theme/illustrations.js`. The app currently renders tasteful
**gradient + line-art placeholders** so nothing ever looks broken — but
each placeholder is one line away from being your real artwork.

**To replace a placeholder:**

1. Generate the image in Gemini. Each registry entry already contains a
   ready-to-paste `aiPrompt`. **Prepend the GLOBAL STYLE PROMPT** (at the
   top of `illustrations.js`) to every prompt so the whole set stays in one
   consistent anime style.
2. Save the PNG into `assets/illustrations/` using the **exact filename**
   from the registry's `file` field.
3. In `illustrations.js`, change that entry's `source` from `null` to:
   ```js
   source: require('../../assets/illustrations/<file>.png'),
   ```

That's it — every screen pulls from the registry, so the new art appears
everywhere it's used. No screen code changes.

**Illustration filenames** (drop these into `assets/illustrations/`):

```
splash        → splash_lantern.png         welcome     → welcome_two_paths.png
profilePick   → profile_window.png         newProfile  → new_profile_seed.png
pinUnlock     → pin_keyhouse.png           captureHub  → capture_desk.png
cameraHint    → camera_firefly.png         aiThinking  → thinking_owl.png
lesson        → lesson_garden.png          quiz        → quiz_steppingstones.png
correct       → state_correct_star.png     incorrect   → state_retry_paperboat.png
summary       → summary_hilltop.png        qrExport    → qr_paperplane.png
teacherLogin  → teacher_lantern_desk.png   teacherDash → teacher_constellation.png
topicMastery  → topic_terraced_fields.png  studentDetail → student_lantern_path.png
scanner       → scanner_moth_light.png     empty       → empty_quietfield.png
settings      → settings_toolshelf.png
```

Avatars (`assets/avatars/`) work the same way — `fox.png`, `owl.png`,
`deer.png`, `rabbit.png`, `cat.png`, `bird.png`, `bear.png`, `turtle.png`.
Until added, friendly SVG animal mascots are drawn instead.

---

## ▶️ Running the app

```bash
npm install
npm start          # then press a / i, or scan the QR with Expo Go
```

Requires Node 18+ and the Expo Go app (or an Android/iOS simulator).

---

## 🔌 What's stubbed for the demo

This is the **UI layer**. It is fully navigable end-to-end with realistic
sample data, but three native capabilities are intentionally stubbed so the
UI runs anywhere without device permissions. Wire these in for the live demo:

- **Camera** (`CameraScreen`, `TeacherScannerScreen`) — currently a styled
  faux viewfinder. Replace with `expo-camera`; the scanner expects a QR
  barcode handler that calls `navigation.navigate('QRImport', { result })`.
- **Voice in / out** (`LessonScreen` speaker FAB, capture voice button) —
  hook up `expo-speech` for TTS and a speech-to-text module for STT. The
  language selected in Settings drives the locale.
- **QR generation** (`QRExportScreen`) — currently a decorative SVG QR.
  Replace `QRPlaceholder` with `react-native-qrcode-svg`, encoding the
  weekly metrics JSON from Member 4's sync format.
- **On-device model** — the Gemma 4 / LiteRT bridge replaces the timed
  transition in `AILoadingScreen`.

The master teacher PIN is set in `TeacherLoginScreen.js` (`MASTER_PIN`) —
in a real deployment this comes from the device's deployment config.

---

## 🧩 Reusable components (quick reference)

- **`ScreenScaffold`** — gradient sky + paper grain + safe area + optional
  sticky footer. `tint` picks the time-of-day gradient; `dark` for teacher.
- **`PrimaryButton`** — the big child-first action button. Variants:
  `coral`, `sky`, `sage`, `gold`, `ghost`.
- **`ScreenHeader`** — editorial header with a kicker label and back arrow.
- **`Illustration`** — renders real art or a themed placeholder by `name`.
- **`Card`, `Badge`, `Chip`, `SectionTitle`, `ProgressDots`** — layout kit.
- **`Avatar`, `PinPad`, `SpeakerButton`, `Stat`, `MasteryBar`** — widgets.

Built for the Gemma Hackathon · Education · Impact · Technical Innovation.
