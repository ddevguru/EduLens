import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ---- Student flow screens (1–14) ---- */
import SplashScreen from '../screens/student/SplashScreen';
import OnboardingScreen from '../screens/student/OnboardingScreen';
import WelcomeScreen from '../screens/student/WelcomeScreen';
import ProfileSelectScreen from '../screens/student/ProfileSelectScreen';
import NewProfileScreen from '../screens/student/NewProfileScreen';
import PinUnlockScreen from '../screens/student/PinUnlockScreen';
import CaptureHubScreen from '../screens/student/CaptureHubScreen';
import CameraScreen from '../screens/student/CameraScreen';
import AILoadingScreen from '../screens/student/AILoadingScreen';
import LessonScreen from '../screens/student/LessonScreen';
import QuizScreen from '../screens/student/QuizScreen';
import SummaryScreen from '../screens/student/SummaryScreen';
import QRExportScreen from '../screens/student/QRExportScreen';

/* ---- Teacher flow screens (15–21) ---- */
import TeacherLoginScreen from '../screens/teacher/TeacherLoginScreen';
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import TopicMasteryScreen from '../screens/teacher/TopicMasteryScreen';
import StudentDetailScreen from '../screens/teacher/StudentDetailScreen';
import TeacherScannerScreen from '../screens/teacher/TeacherScannerScreen';
import QRImportScreen from '../screens/teacher/QRImportScreen';
import SettingsScreen from '../screens/teacher/SettingsScreen';

const Stack = createNativeStackNavigator();

/**
 * RootNavigator — a single native stack holding the whole journey.
 *
 * The app has two intertwined flows that share one stack so that the
 * teacher area can be reached from the student Welcome screen and the
 * QR-sync screens can hop between them freely:
 *
 *   Splash → Welcome ─┬─ (Student) ProfileSelect → PinUnlock → CaptureHub …
 *                     └─ (Teacher) TeacherLogin → TeacherDashboard …
 *
 * Headers are disabled globally — every screen draws its own storybook
 * ScreenHeader so the editorial layout stays consistent. A gentle
 * horizontal slide is used for forward motion; the fades are reserved
 * for the splash hand-off.
 */
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FBF6EE' },
        gestureEnabled: true,
      }}
    >
      {/* ---------- Student flow ---------- */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />
      <Stack.Screen name="NewProfile" component={NewProfileScreen} />
      <Stack.Screen name="PinUnlock" component={PinUnlockScreen} />
      <Stack.Screen
        name="CaptureHub"
        component={CaptureHubScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="AILoading"
        component={AILoadingScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen name="QRExport" component={QRExportScreen} />

      {/* ---------- Teacher flow ---------- */}
      <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="TopicMastery" component={TopicMasteryScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen
        name="TeacherScanner"
        component={TeacherScannerScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="QRImport"
        component={QRImportScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
