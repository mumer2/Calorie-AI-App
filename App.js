import React, { useEffect, useState, useContext, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { navigationRef } from "./screens/NavigationService";
import i18n from './utils/i18n';
import { LanguageProvider, LanguageContext } from './contexts/LanguageContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';



// Context
import {
  NotificationProvider,
  NotificationContext,
} from "./contexts/NotificationContext";

// Screens
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import FitnessScreen from "./screens/FitnessScreen";
import DietPlanScreen from "./screens/DietPlanScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import SubscribeScreen from "./screens/SubscribeScreen";
import StepCounterScreen from "./screens/StepCounterScreen";
import CheckInScreen from "./screens/CheckInScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ReminderScreen from "./screens/ReminderScreen";
import StepsHistoryScreen from "./screens/StepsHistoryScreen";
import TrainingScreen from "./screens/TrainingScreen";
import TrainingVideoScreen from "./screens/TrainingVideoScreen";
import TrainingDetailScreen from "./screens/TrainingDetailScreen";
import ProgressReportScreen from "./screens/ProgressReportScreen";
import JitsiScreen from "./screens/JitsiScreen";
import AIChatScreen from "./screens/AIChatScreen";
import ReviewRequestsScreen from "./screens/ReviewRequestsScreen";
import CoachHomeScreen from "./screens/CoachHomeScreen";
import CoachListScreen from "./screens/CoachListScreen";
import CoachProfileScreen from "./screens/CoachProfileScreen";
import SendRequestScreen from "./screens/SendRequestScreen";
import CoachVideoListScreen from "./screens/CoachVideoListScreen";
import CoachLiveScreen from "./screens/CoachLiveScreen";
import CoinsRewardScreen from "./screens/CoinsRewardScreen";
import RedeemScreen from "./screens/RedeemScreen";
import WeChatPayScreen from "./screens/WeChatPayScreen";
import SubscribeWithCoins from "./screens/SubscribeWithCoins";
import SubscriptionSuccessScreen from "./screens/SubscriptionSuccessScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import SubscribeWithApple from "./screens/SubscribeWithApple";
import SubscribeWithPaypal from "./screens/SubscribeWithPaypal";
import CoachSettingScreen from "./screens/CoachSettingScreen";
import RoleBasedRedirectScreen from "./screens/RoleBasedRedirectScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import AppUsageInstructionsScreen from "./screens/AppUsageInstructionsScreen";

// 🔔 Push Notification Setup
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

// Tabs for Member
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { unreadCount } = useContext(NotificationContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === "Home") icon = "home-outline";
          else if (route.name === "Check-In") icon = "checkmark-done-outline";
          else if (route.name === "History") icon = "calendar-outline";
          else if (route.name === "Settings") icon = "settings-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0e4d92",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: i18n.t('home'), tabBarBadge: unreadCount > 0 ? unreadCount : undefined }}
      />
      <Tab.Screen name="Check-In" component={CheckInScreen} options={{ title: i18n.t('checkin'), headerShown: true  }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: i18n.t('history'), headerShown: true  }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: i18n.t('settings'), headerShown: true  }} />
    </Tab.Navigator>
  );
}

// Stack
const Stack = createNativeStackNavigator();

function AppWithNotifications({ userToken, userRole }) {
  const { language } = useContext(LanguageContext); // 👈 Get current language
  const { setNotifications, setUnreadCount } = useContext(NotificationContext);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data?.screen;
      if (screen) {
        navigationRef.current?.navigate(screen);
      }
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} key={language}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={
          !userToken ? "Login" : userRole === "coach" ? "CoachHome" : "MainTabs"
        }
      >
      <Stack.Screen name="RoleRedirect" component={RoleBasedRedirectScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: i18n.t('login') }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: i18n.t('signup') }} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CoachHome" component={CoachHomeScreen} options={{ title: i18n.t('coachHome'), headerShown: true  }} />
        <Stack.Screen name="Fitness" component={FitnessScreen} options={{ title: i18n.t('fitness'), headerShown: true  }} />
        <Stack.Screen name="Diet" component={DietPlanScreen} options={{ title: i18n.t('diet'), headerShown: true  }} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: i18n.t('exercise'), headerShown: true  }} />
        <Stack.Screen name="Subscribe" component={SubscribeScreen} options={{ title: i18n.t('subscribe'), headerShown: true  }} />
        <Stack.Screen name="Steps" component={StepCounterScreen} options={{ title: i18n.t('steps') }} />
        <Stack.Screen name="Reminders" component={ReminderScreen} options={{ title: i18n.t('reminders'), headerShown: true  }} />
        <Stack.Screen name="StepHistory" component={StepsHistoryScreen} options={{ title: i18n.t('stepHistory'), headerShown: true  }} />
        <Stack.Screen name="Training" component={TrainingScreen} options={{ title: i18n.t('training'), headerShown: true  }} />
        <Stack.Screen name="TrainingDetail" component={TrainingDetailScreen} options={{ title: i18n.t('trainingDetail'), headerShown: true  }} />
        <Stack.Screen name="TrainingVideo" component={TrainingVideoScreen} options={{ title: i18n.t('trainingVideo'), headerShown: true  }} />
        <Stack.Screen name="ProgressReport" component={ProgressReportScreen} options={{ title: i18n.t('progressReport'), headerShown: true  }} />
        <Stack.Screen name="Jitsi" component={JitsiScreen} options={{ title: i18n.t('jitsi'), headerShown: true }} />
        <Stack.Screen name="AIChat" component={AIChatScreen} options={{ title: i18n.t('aiChat'), headerShown: true  }} />
        <Stack.Screen name="ReviewRequests" component={ReviewRequestsScreen} options={{ title: i18n.t('reviewRequests'), headerShown: true }} />
        <Stack.Screen name="CoachList" component={CoachListScreen} options={{ title: i18n.t('coachList'), headerShown: true  }} />
        <Stack.Screen name="CoachProfile" component={CoachProfileScreen} options={{ title: i18n.t('coachProfile'), headerShown: true  }} />
        <Stack.Screen name="SendRequest" component={SendRequestScreen} options={{ title: i18n.t('sendRequest'), headerShown: true }} />
        <Stack.Screen name="CoachVideoList" component={CoachVideoListScreen} options={{ title: i18n.t('coachVideoList'), headerShown: true }} />
        <Stack.Screen name="CoachLiveScreen" component={CoachLiveScreen} options={{ title: i18n.t('coachLiveScreen'), headerShown: true }} />
        <Stack.Screen name="CoinsReward" component={CoinsRewardScreen} options={{ title: i18n.t('coinsReward'), headerShown: true }} />
        <Stack.Screen name="RedeemScreen" component={RedeemScreen} options={{ title: i18n.t('redeemScreen'), headerShown: true }} />
        <Stack.Screen name="WeChatPay" component={WeChatPayScreen} options={{ title: i18n.t('weChatPay'), headerShown: true  }} />
        <Stack.Screen name="SubwithCoins" component={SubscribeWithCoins} options={{ title: i18n.t('subWithCoins'), headerShown: true }} />
        <Stack.Screen name="SubscriptionSuccess" component={SubscriptionSuccessScreen} options={{ title: i18n.t('subscriptionSuccess') }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: i18n.t('forgotPassword'), headerShown: true }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: i18n.t('resetPassword'), headerShown: true }}/>
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: i18n.t('notifications'), headerShown: true  }} />
        <Stack.Screen name="ApplePay" component={SubscribeWithApple} options={{ title: i18n.t('applePay'), headerShown: true }} />
        <Stack.Screen name="PayPal" component={SubscribeWithPaypal} options={{ title: i18n.t('paypal'), headerShown: true }} />
        <Stack.Screen name="CoachSettings" component={CoachSettingScreen} options={{ title: i18n.t('settings'), headerShown: true  }} />
<Stack.Screen
  name="PrivacyPolicy"
  component={PrivacyPolicyScreen}
  options={{ title: i18n.t('privacyPolicy'), headerShown: true }}
/>
<Stack.Screen
  name="AppInstructions"
  component={AppUsageInstructionsScreen}
  options={{ title: i18n.t('usageInstructions'), headerShown: true }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// App Root
export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const role = await AsyncStorage.getItem("userRole");
      const lang = await AsyncStorage.getItem("appLanguage");
      if (lang) i18n.locale = lang;
      setUserToken(token);
      setUserRole(role);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null;

  return (
     <SafeAreaProvider>
    <LanguageProvider>
    <NotificationProvider>
      <AppWithNotifications userToken={userToken} userRole={userRole} />
    </NotificationProvider>
    </LanguageProvider>
    </SafeAreaProvider>
  );
}



// import React, { useEffect, useState, useContext, useRef } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { navigationRef } from "./screens/NavigationService";
// import i18n from './utils/i18n';

// // Context
// import {
//   NotificationProvider,
//   NotificationContext,
// } from "./contexts/NotificationContext";

// // Screens
// import LoginScreen from "./screens/LoginScreen";
// import SignupScreen from "./screens/SignupScreen";
// import HomeScreen from "./screens/HomeScreen";
// import FitnessScreen from "./screens/FitnessScreen";
// import DietPlanScreen from "./screens/DietPlanScreen";
// import ExerciseScreen from "./screens/ExerciseScreen";
// import SubscribeScreen from "./screens/SubscribeScreen";
// import StepCounterScreen from "./screens/StepCounterScreen";
// import CheckInScreen from "./screens/CheckInScreen";
// import HistoryScreen from "./screens/HistoryScreen";
// import SettingsScreen from "./screens/SettingsScreen";
// import ReminderScreen from "./screens/ReminderScreen";
// import StepsHistoryScreen from "./screens/StepsHistoryScreen";
// import TrainingScreen from "./screens/TrainingScreen";
// import TrainingVideoScreen from "./screens/TrainingVideoScreen";
// import TrainingDetailScreen from "./screens/TrainingDetailScreen";
// import ProgressReportScreen from "./screens/ProgressReportScreen";
// import JitsiScreen from "./screens/JitsiScreen";
// import AIChatScreen from "./screens/AIChatScreen";
// import ReviewRequestsScreen from "./screens/ReviewRequestsScreen";
// import CoachHomeScreen from "./screens/CoachHomeScreen";
// import CoachListScreen from "./screens/CoachListScreen";
// import CoachProfileScreen from "./screens/CoachProfileScreen";
// import SendRequestScreen from "./screens/SendRequestScreen";
// import CoachVideoListScreen from "./screens/CoachVideoListScreen";
// import CoachLiveScreen from "./screens/CoachLiveScreen";
// import CoinsRewardScreen from "./screens/CoinsRewardScreen";
// import RedeemScreen from "./screens/RedeemScreen";
// import WeChatPayScreen from "./screens/WeChatPayScreen";
// import SubscribeWithCoins from "./screens/SubscribeWithCoins";
// import SubscriptionSuccessScreen from "./screens/SubscriptionSuccessScreen";
// import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
// import ResetPasswordScreen from "./screens/ResetPasswordScreen";
// import NotificationsScreen from "./screens/NotificationsScreen";
// import SubscribeWithApple from "./screens/SubscribeWithApple";
// import SubscribeWithPaypal from "./screens/SubscribeWithPaypal";

// // 🔔 Push Notification Setup
// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       alert("Failed to get push token!");
//       return;
//     }

//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log("Expo Push Token:", token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   return token;
// }

// // Tabs for Member
// const Tab = createBottomTabNavigator();

// function MainTabs() {
//   const { unreadCount } = useContext(NotificationContext);

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let icon;
//           if (route.name === "Home") icon = "home-outline";
//           else if (route.name === "Check-In") icon = "checkmark-done-outline";
//           else if (route.name === "History") icon = "calendar-outline";
//           else if (route.name === "Settings") icon = "settings-outline";
//           return <Ionicons name={icon} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#0e4d92",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
//         }}
//       />
//       {/* <Tab.Screen name="Check-In" component={CheckInScreen} />
//       <Tab.Screen name="History" component={HistoryScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} /> */}
//       <Tab.Screen name="Check-In" component={CheckInScreen} options={{ title: i18n.t('checkin') }} />
// <Tab.Screen name="History" component={HistoryScreen} options={{ title: i18n.t('history') }} />
// <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: i18n.t('settings') }} />

//     </Tab.Navigator>
//   );
// }

// // Stack
// const Stack = createNativeStackNavigator();

// function AppWithNotifications({ userToken, userRole }) {
//   const { setNotifications, setUnreadCount } = useContext(NotificationContext);

//   useEffect(() => {
//     registerForPushNotificationsAsync();

//     const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//       setUnreadCount((prev) => prev + 1);
//     });

//     const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
//       const screen = response.notification.request.content.data?.screen;
//       if (screen) {
//         navigationRef.current?.navigate(screen);
//       }
//     });

//     Notifications.setNotificationHandler({
//       handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//       }),
//     });

//     return () => {
//       receivedListener.remove();
//       responseListener.remove();
//     };
//   }, []);

//   return (
//     <NavigationContainer ref={navigationRef}>
//       <Stack.Navigator
//         screenOptions={{ headerShown: false }}
//         initialRouteName={
//           !userToken
//             ? "Login"
//             : userRole === "coach"
//             ? "CoachHome"
//             : "MainTabs"
//         }
//       >
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Signup" component={SignupScreen} />
//         <Stack.Screen name="MainTabs" component={MainTabs} />
//         <Stack.Screen name="CoachHome" component={CoachHomeScreen} />
//         <Stack.Screen name="Fitness" component={FitnessScreen} />
//         <Stack.Screen name="Diet" component={DietPlanScreen} />
//         <Stack.Screen name="Exercise" component={ExerciseScreen} />
//         <Stack.Screen name="Subscribe" component={SubscribeScreen} />
//         <Stack.Screen name="Steps" component={StepCounterScreen} />
//         <Stack.Screen name="Reminders" component={ReminderScreen} />
//         <Stack.Screen name="StepHistory" component={StepsHistoryScreen} />
//         <Stack.Screen name="Training" component={TrainingScreen} />
//         <Stack.Screen name="TrainingDetail" component={TrainingDetailScreen} />
//         <Stack.Screen name="TrainingVideo" component={TrainingVideoScreen} />
//         <Stack.Screen name="ProgressReport" component={ProgressReportScreen} />
//         <Stack.Screen name="Jitsi" component={JitsiScreen} />
//         <Stack.Screen name="AIChat" component={AIChatScreen} />
//         <Stack.Screen name="ReviewRequests" component={ReviewRequestsScreen} />
//         <Stack.Screen name="CoachList" component={CoachListScreen} />
//         <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
//         <Stack.Screen name="SendRequest" component={SendRequestScreen} />
//         <Stack.Screen name="CoachVideoList" component={CoachVideoListScreen} />
//         <Stack.Screen name="CoachLiveScreen" component={CoachLiveScreen} />
//         <Stack.Screen name="CoinsReward" component={CoinsRewardScreen} />
//         <Stack.Screen name="RedeemScreen" component={RedeemScreen} />
//         <Stack.Screen name="WeChatPay" component={WeChatPayScreen} />
//         <Stack.Screen name="SubwithCoins" component={SubscribeWithCoins} />
//         <Stack.Screen name="SubscriptionSuccess" component={SubscriptionSuccessScreen} />
//         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//         <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
//         <Stack.Screen name="Notifications" component={NotificationsScreen} />
//         <Stack.Screen name="ApplePay" component={SubscribeWithApple} />
//         <Stack.Screen name="PayPal" component={SubscribeWithPaypal} />

//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// // App Root
// export default function App() {
//   const [userToken, setUserToken] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem("authToken");
//       const role = await AsyncStorage.getItem("userRole");
//       setUserToken(token);
//       setUserRole(role);
//       setLoading(false);
//     };
//     checkAuth();
//   }, []);

//   if (loading) return null;

//   return (
//     <NotificationProvider>
//       <AppWithNotifications userToken={userToken} userRole={userRole} />
//     </NotificationProvider>
//   );
// }
