import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, phone } = route.params || {}; // handle both
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp.trim() || !password.trim()) {
      return Alert.alert('Missing Fields', 'Please fill in all fields');
    }

    setLoading(true);

    try {
      const payload = {
        otp: otp.trim(),
        newPassword: password.trim(),
      };

      if (email) payload.email = email.toLowerCase();
      else if (phone) payload.phone = phone.trim();

      const res = await fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Your password has been reset');
        navigation.navigate('Login');
      } else {
        Alert.alert('Failed', data.message || 'Reset failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subTitle}>
        Enter OTP and New Password
      </Text>

      <TextInput
        placeholder="OTP"
        style={styles.input}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <TextInput
        placeholder="New Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#f0f8ff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#0e4d92' },
  subTitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#0e4d92', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
});

// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

// export default function ResetPasswordScreen({ route, navigation }) {
//   const { email } = route.params;
//   const [otp, setOtp] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleReset = async () => {
//     if (!otp || !password) return Alert.alert('Fill all fields');
//     setLoading(true);

//     try {
//       const res = await fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp, newPassword: password }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert('Success', 'Password reset successful');
//         navigation.navigate('Login');
//       } else {
//         Alert.alert('Error', data.message || 'Reset failed');
//       }
//     } catch (e) {
//       Alert.alert('Error', 'Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Enter OTP and New Password</Text>
//       <TextInput placeholder="OTP" style={styles.input} keyboardType="numeric" value={otp} onChangeText={setOtp} />
//       <TextInput placeholder="New Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
//       <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#f0f8ff' },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0e4d92' },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 },
//   button: { backgroundColor: '#0e4d92', padding: 14, borderRadius: 10, alignItems: 'center' },
//   buttonText: { color: '#fff', fontSize: 16 },
// });
