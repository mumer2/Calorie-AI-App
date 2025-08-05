import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import i18n from '../utils/i18n';

const LOGIN_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/login';
const SAVE_PUSH_TOKEN_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/savePushToken';

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState('member');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!identifier.trim() || !password.trim()) {
      return Alert.alert(i18n.t('error'), i18n.t('emailPasswordRequired'));
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const body = {
      password,
      role,
      ...(isEmail ? { email: identifier.trim().toLowerCase() } : { phone: identifier.trim() }),
    };

    setLoading(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userId', data.user._id || '');
        await AsyncStorage.setItem('userName', data.user.name || '');
        await AsyncStorage.setItem('userRole', data.role);
        await AsyncStorage.setItem('userPoints', (data.user.points || 0).toString());
        await AsyncStorage.setItem('referralCode', data.user.referralCode || '');

        await registerPushToken(data.user._id);

        if (data.role === 'member') {
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } else if (data.role === 'coach') {
          navigation.reset({ index: 0, routes: [{ name: 'CoachHome' }] });
        } else {
          Alert.alert(i18n.t('loginError'), i18n.t('unknownRole'));
        }
      } else {
        Alert.alert(i18n.t('loginFailed'), data.message || i18n.t('loginTryAgain'));
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(i18n.t('error'), i18n.t('loginNetworkError'));
    } finally {
      setLoading(false);
    }
  };

  const registerPushToken = async (userId) => {
    try {
      if (!Device.isDevice) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return;

      const token = (await Notifications.getExpoPushTokenAsync()).data;

      await fetch(SAVE_PUSH_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, expoPushToken: token }),
      });
    } catch (err) {
      console.error('Push token registration failed:', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {i18n.t('loginAs')} {role === 'member' ? i18n.t('member') : i18n.t('coach')}
          </Text>

          <View style={styles.roleSwitch}>
            <TouchableOpacity onPress={() => setRole('member')}>
              <Text style={role === 'member' ? styles.selected : styles.unselected}>
                {i18n.t('member')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRole('coach')}>
              <Text style={role === 'coach' ? styles.selected : styles.unselected}>
                {i18n.t('coach')}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder={i18n.t('emailOrPhone')}
            placeholderTextColor="#999"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="default"
            value={identifier}
            onChangeText={setIdentifier}
          />

          <TextInput
            placeholder={i18n.t('password')}
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.forgotContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>{i18n.t('forgotPassword')}?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{i18n.t('login')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>{i18n.t('noAccountSignUp')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f0f8ff' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#0e4d92',
  },
  roleSwitch: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  selected: {
    color: '#0e4d92',
    fontWeight: 'bold',
    marginHorizontal: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  unselected: { color: 'gray', marginHorizontal: 10, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, color: '#0e4d92', fontSize: 14, textAlign: 'center' },
  forgotContainer: { alignItems: 'flex-end', marginBottom: 16 },
  forgotText: { color: '#0e4d92', fontSize: 14, textDecorationLine: 'underline' },
});


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import i18n from '../utils/i18n'; // ✅ Only i18n used here

// const LOGIN_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/login';
// const SAVE_PUSH_TOKEN_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/savePushToken';

// export default function LoginScreen({ navigation }) {
//   const [role, setRole] = useState('member');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (loading) return;

//     if (!email.trim() || !password.trim()) {
//       return Alert.alert(i18n.t('error'), i18n.t('emailPasswordRequired'));
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(LOGIN_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password,
//           role,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.token && data.user) {
//         await AsyncStorage.setItem('authToken', data.token);
//         await AsyncStorage.setItem('userId', data.user._id || '');
//         await AsyncStorage.setItem('userName', data.user.name || '');
//         await AsyncStorage.setItem('userRole', data.role);
//         await AsyncStorage.setItem('userPoints', (data.user.points || 0).toString());
//         await AsyncStorage.setItem('referralCode', data.user.referralCode || '');

//         await registerPushToken(data.user._id);

//         if (data.role === 'member') {
//           navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
//         } else if (data.role === 'coach') {
//           navigation.reset({ index: 0, routes: [{ name: 'CoachHome' }] });
//         } else {
//           Alert.alert(i18n.t('loginError'), i18n.t('unknownRole'));
//         }
//       } else {
//         Alert.alert(i18n.t('loginFailed'), data.message || i18n.t('loginTryAgain'));
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       Alert.alert(i18n.t('error'), i18n.t('loginNetworkError'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const registerPushToken = async (userId) => {
//     try {
//       if (!Device.isDevice) return;

//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       if (finalStatus !== 'granted') return;

//       const token = (await Notifications.getExpoPushTokenAsync()).data;

//       await fetch(SAVE_PUSH_TOKEN_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, expoPushToken: token }),
//       });
//     } catch (err) {
//       console.error('Push token registration failed:', err.message);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.wrapper}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.card}>
//           <Text style={styles.title}>
//             {i18n.t('loginAs')} {role === 'member' ? i18n.t('member') : i18n.t('coach')}
//           </Text>

//           <View style={styles.roleSwitch}>
//             <TouchableOpacity onPress={() => setRole('member')}>
//               <Text style={role === 'member' ? styles.selected : styles.unselected}>
//                 {i18n.t('member')}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setRole('coach')}>
//               <Text style={role === 'coach' ? styles.selected : styles.unselected}>
//                 {i18n.t('coach')}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <TextInput
//             placeholder={i18n.t('email')}
//             placeholderTextColor="#999"
//             style={styles.input}
//             autoCapitalize="none"
//             keyboardType="email-address"
//             value={email}
//             onChangeText={setEmail}
//           />

//           <TextInput
//             placeholder={i18n.t('password')}
//             placeholderTextColor="#999"
//             style={styles.input}
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//           />

//           <View style={styles.forgotContainer}>
//             <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
//               <Text style={styles.forgotText}>{i18n.t('forgotPassword')}?</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, loading && { opacity: 0.7 }]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>{i18n.t('login')}</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//             <Text style={styles.link}>{i18n.t('noAccountSignUp')}</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: { flex: 1, backgroundColor: '#f0f8ff' },
//   scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
//   card: {
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#0e4d92',
//   },
//   roleSwitch: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
//   selected: {
//     color: '#0e4d92',
//     fontWeight: 'bold',
//     marginHorizontal: 10,
//     fontSize: 16,
//     textDecorationLine: 'underline',
//   },
//   unselected: { color: 'gray', marginHorizontal: 10, fontSize: 16 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#0e4d92',
//     padding: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   link: { marginTop: 20, color: '#0e4d92', fontSize: 14, textAlign: 'center' },
//   forgotContainer: { alignItems: 'flex-end', marginBottom: 16 },
//   forgotText: { color: '#0e4d92', fontSize: 14, textDecorationLine: 'underline' },
// });


// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   TextInput,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Alert,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   ActivityIndicator,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import * as Notifications from 'expo-notifications';
// // import * as Device from 'expo-device';

// // const LOGIN_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/login';
// // const SAVE_PUSH_TOKEN_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/savePushToken'; // 👈 create this backend

// // export default function LoginScreen({ navigation }) {
// //   const [role, setRole] = useState('member');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleLogin = async () => {
// //     if (loading) return;

// //     if (!email.trim() || !password.trim()) {
// //       return Alert.alert('Error', 'Email and password are required');
// //     }

// //     setLoading(true);

// //     try {
// //       const response = await fetch(LOGIN_URL, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           email: email.trim().toLowerCase(),
// //           password,
// //           role,
// //         }),
// //       });

// //       const data = await response.json();

// //       if (response.ok && data.token && data.user) {
// //         await AsyncStorage.setItem('authToken', data.token);
// //         await AsyncStorage.setItem('userId', data.user._id || '');
// //         await AsyncStorage.setItem('userName', data.user.name || '');
// //         await AsyncStorage.setItem('userRole', data.role);
// //         await AsyncStorage.setItem('userPoints', (data.user.points || 0).toString());
// //         await AsyncStorage.setItem('referralCode', data.user.referralCode || '');

// //         // ✅ Register push token and send to backend
// //         await registerPushToken(data.user._id);

// //         // Navigate to appropriate home
// //         if (data.role === 'member') {
// //           navigation.reset({
// //             index: 0,
// //             routes: [{ name: 'MainTabs' }],
// //           });
// //         } else if (data.role === 'coach') {
// //           navigation.reset({
// //             index: 0,
// //             routes: [{ name: 'CoachHome' }],
// //           });
// //         } else {
// //           Alert.alert('Login Error', 'Unknown role returned from server.');
// //         }
// //       } else {
// //         Alert.alert('Login Failed', data.message || 'Login failed. Please try again.');
// //       }
// //     } catch (error) {
// //       console.error('Login error:', error);
// //       Alert.alert('Error', 'Could not connect to server');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Function to register and save Expo push token
// //   const registerPushToken = async (userId) => {
// //     try {
// //       if (!Device.isDevice) return;

// //       const { status: existingStatus } = await Notifications.getPermissionsAsync();
// //       let finalStatus = existingStatus;

// //       if (existingStatus !== 'granted') {
// //         const { status } = await Notifications.requestPermissionsAsync();
// //         finalStatus = status;
// //       }

// //       if (finalStatus !== 'granted') return;

// //       const token = (await Notifications.getExpoPushTokenAsync()).data;

// //       await fetch(SAVE_PUSH_TOKEN_URL, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ userId, expoPushToken: token }),
// //       });
// //     } catch (err) {
// //       console.error('Push token registration failed:', err.message);
// //     }
// //   };

// //   return (
// //     <KeyboardAvoidingView
// //       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //       style={styles.wrapper}
// //     >
// //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// //         <View style={styles.card}>
// //           <Text style={styles.title}>Login as {role}</Text>

// //           <View style={styles.roleSwitch}>
// //             <TouchableOpacity onPress={() => setRole('member')}>
// //               <Text style={role === 'member' ? styles.selected : styles.unselected}>Member</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity onPress={() => setRole('coach')}>
// //               <Text style={role === 'coach' ? styles.selected : styles.unselected}>Coach</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <TextInput
// //             placeholder="Email"
// //             placeholderTextColor="#999"
// //             style={styles.input}
// //             autoCapitalize="none"
// //             keyboardType="email-address"
// //             value={email}
// //             onChangeText={setEmail}
// //           />

// //           <TextInput
// //             placeholder="Password"
// //             placeholderTextColor="#999"
// //             style={styles.input}
// //             secureTextEntry
// //             value={password}
// //             onChangeText={setPassword}
// //           />

// //           <View style={styles.forgotContainer}>
// //             <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
// //               <Text style={styles.forgotText}>Forgot Password?</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.button, loading && { opacity: 0.7 }]}
// //             onPress={handleLogin}
// //             disabled={loading}
// //           >
// //             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
// //           </TouchableOpacity>

// //           <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
// //             <Text style={styles.link}>Don't have an account? Sign up</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </ScrollView>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   wrapper: { flex: 1, backgroundColor: '#f0f8ff' },
// //   scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
// //   card: {
// //     backgroundColor: '#fff',
// //     padding: 24,
// //     borderRadius: 16,
// //     elevation: 4,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //   },
// //   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#0e4d92' },
// //   roleSwitch: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
// //   selected: {
// //     color: '#0e4d92',
// //     fontWeight: 'bold',
// //     marginHorizontal: 10,
// //     fontSize: 16,
// //     textDecorationLine: 'underline',
// //   },
// //   unselected: { color: 'gray', marginHorizontal: 10, fontSize: 16 },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     backgroundColor: '#fff',
// //     padding: 12,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //     fontSize: 16,
// //   },
// //   button: {
// //     backgroundColor: '#0e4d92',
// //     padding: 14,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //   },
// //   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// //   link: { marginTop: 20, color: '#0e4d92', fontSize: 14, textAlign: 'center' },
// //   forgotContainer: { alignItems: 'flex-end', marginBottom: 16 },
// //   forgotText: { color: '#0e4d92', fontSize: 14, textDecorationLine: 'underline' },
// // });
