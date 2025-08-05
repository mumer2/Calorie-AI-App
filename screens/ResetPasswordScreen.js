import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../utils/i18n'; // ✅ Import i18n

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, phone } = route.params;
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isPhone = !!phone;

  const handleReset = async () => {
    if (!token.trim() || !newPassword.trim()) {
      Alert.alert(i18n.t('error'), i18n.t('fillAllFields'));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(i18n.t('error'), i18n.t('passwordMinLength'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        token,
        newPassword,
        ...(isPhone ? { phone } : { email }),
      };

      const response = await axios.post(
        'https://backend-calorieai-app.netlify.app/.netlify/functions/setNewPassword',
        payload
      );

      if (response.data?.success) {
        Alert.alert('✅ ' + i18n.t('success'), i18n.t('passwordResetSuccess'));
        navigation.replace('Login');
      } else {
        Alert.alert(i18n.t('error'), response.data?.message || i18n.t('resetFailed'));
      }
    } catch (err) {
      console.error('Reset error:', err.message);
      Alert.alert(i18n.t('error'), err.response?.data?.message || i18n.t('serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔐 {i18n.t('resetPassword')}</Text>
      <Text style={styles.subtitle}>
        {isPhone
          ? `${i18n.t('resettingForPhone')}: ${phone}`
          : `${i18n.t('resettingForEmail')}: ${email}`}
      </Text>

      <TextInput
        placeholder={i18n.t('otp')}
        keyboardType="numeric"
        value={token}
        onChangeText={setToken}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder={i18n.t('newPassword')}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{i18n.t('resetPassword')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
        <Icon name="arrow-back" size={20} color="#555" />
        <Text style={styles.backText}>{i18n.t('back')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c2c4e',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#eee',
    color: '#000',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#A26769',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#555',
    fontSize: 14,
    marginLeft: 6,
  },
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
