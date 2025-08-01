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
import i18n from '../utils/i18n'; // ✅ Add i18n import

export default function ForgotPasswordScreen({ navigation }) {
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{6,15}$/;

  const handleSendOTP = async () => {
    if (!contact.trim()) return Alert.alert(i18n.t('error'), i18n.t('enterContact'));
    setLoading(true);

    const isEmail = emailRegex.test(contact.trim());
    const isPhone = phoneRegex.test(contact.trim());

    if (!isEmail && !isPhone) {
      Alert.alert(i18n.t('invalid'), i18n.t('validContact'));
      setLoading(false);
      return;
    }

    try {
      const endpoint = isEmail
        ? 'https://backend-calorieai-app.netlify.app/.netlify/functions/send-otp'
        : 'https://backend-calorieai-app.netlify.app/.netlify/functions/send-code';

      const body = isEmail
        ? { email: contact.trim().toLowerCase() }
        : { phone: contact.trim() };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success !== false) {
        Alert.alert(i18n.t('success'), i18n.t('otpSent'));
        navigation.navigate('ResetPassword', {
          contact: contact.trim(),
          method: isEmail ? 'email' : 'phone',
        });
      } else {
        Alert.alert(i18n.t('failed'), data.message || i18n.t('otpFailed'));
      }
    } catch (err) {
      Alert.alert(i18n.t('error'), i18n.t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('resetPassword')}</Text>
      <TextInput
        placeholder={i18n.t('enterContact')}
        style={styles.input}
        keyboardType="default"
        autoCapitalize="none"
        value={contact}
        onChangeText={setContact}
        placeholderTextColor="#888"
      />
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{i18n.t('sendOtp')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0e4d92',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

// export default function ForgotPasswordScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSendOTP = async () => {
//     if (!email) return Alert.alert('Email is required');
//     setLoading(true);

//     try {
//       const res = await fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert('Success', 'OTP sent to your email');
//         navigation.navigate('ResetPassword', { email });
//       } else {
//         Alert.alert('Error', data.message || 'Could not send OTP');
//       }
//     } catch (e) {
//       Alert.alert('Error', 'Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Reset Password</Text>
//       <TextInput
//         placeholder="Enter your email"
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
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