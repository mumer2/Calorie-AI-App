import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../utils/i18n'; // ✅ import i18n

const REQUEST_OTP_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/send-code';
const VERIFY_OTP_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/verify-code';
const SIGNUP_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/signup';

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReferral = async () => {
      const code = await AsyncStorage.getItem('referralCode');
      if (code) setReferralCode(code);
    };
    loadReferral();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{6,15}$/;

  const isEmail = emailRegex.test(contact.trim());
  const isPhone = phoneRegex.test(contact.trim());

  const getFormattedPhone = () => contact.trim();

  const handleContinue = async () => {
    if (!contact.trim()) {
      return Alert.alert(i18n.t('error'), i18n.t('enterPhoneOrEmail'));
    }

    if (isEmail) {
      setVerified(true);
      setStep(2);
    } else if (isPhone) {
      setLoading(true);
      try {
        const res = await fetch(REQUEST_OTP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: getFormattedPhone() }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          Alert.alert(i18n.t('otpSent'), i18n.t('checkYourPhone'));
          setStep(3);
        } else {
          Alert.alert(i18n.t('failed'), data.message || i18n.t('otpFailed'));
        }
      } catch (err) {
        Alert.alert(i18n.t('error'), i18n.t('otpNetworkError'));
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert(i18n.t('invalid'), i18n.t('validPhoneOrEmail'));
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return Alert.alert(i18n.t('error'), i18n.t('enterOtp'));

    setLoading(true);
    try {
      const res = await fetch(VERIFY_OTP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: getFormattedPhone(), code: otp.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        Alert.alert(i18n.t('verified'), i18n.t('phoneVerified'));
        setVerified(true);
        setStep(2);
      } else {
        Alert.alert(i18n.t('failed'), data.message || i18n.t('otpFailed'));
      }
    } catch (err) {
      Alert.alert(i18n.t('error'), i18n.t('otpNetworkError'));
    } finally {
      setLoading(false);
    }
  };

  const passwordRegex = /^(?=.*[0-9]).{6,}$/;

  const handleSignup = async () => {
    if (!name.trim() || !password.trim()) {
      return Alert.alert(i18n.t('error'), i18n.t('namePasswordRequired'));
    }
    if (!isEmail && !isPhone) {
      return Alert.alert(i18n.t('invalid'), i18n.t('validPhoneOrEmail'));
    }
    if (!passwordRegex.test(password)) {
      return Alert.alert(i18n.t('weakPassword'), i18n.t('passwordHint'));
    }

    setLoading(true);
    try {
      const res = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: isEmail ? contact.trim().toLowerCase() : '',
          phone: isPhone ? getFormattedPhone() : '',
          password,
          role,
          referralCode: referralCode.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.userId) {
        await AsyncStorage.setItem('userName', name.trim());
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('userRole', role);
        await AsyncStorage.setItem('userPoints', data.points?.toString() || '50');
        await AsyncStorage.setItem('referralCode', data.referralCode || '');
        await AsyncStorage.removeItem('referralCode');

        Alert.alert(i18n.t('accountCreated'), i18n.t('youEarnedPoints', { points: data.points || 50 }));
        navigation.replace('Login');
      } else {
        Alert.alert(i18n.t('signupFailed'), data.message || i18n.t('somethingWrong'));
      }
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('loginNetworkError'));
    } finally {
      setLoading(false);
    }
  };

  const renderBackButton = () => (
    <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
      <Ionicons name="arrow-back" size={18} color="#0e4d92" />
      <Text style={styles.backText}>{i18n.t('back')}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{i18n.t('createAccount')}</Text>

        {step === 1 && (
          <>
            <TextInput
              placeholder={i18n.t('phoneOrEmail')}
              style={styles.input}
              keyboardType="default"
              value={contact}
              onChangeText={setContact}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? i18n.t('processing') : i18n.t('continue')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            {renderBackButton()}
            <TextInput
              placeholder={i18n.t('enterOtp')}
              style={styles.input}
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? i18n.t('verifying') : i18n.t('verifyCode')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && verified && (
          <>
            {renderBackButton()}
            <View style={styles.roleSwitch}>
              <TouchableOpacity onPress={() => setRole('member')}>
                <Text style={role === 'member' ? styles.selected : styles.unselected}>{i18n.t('member')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRole('coach')}>
                <Text style={role === 'coach' ? styles.selected : styles.unselected}>{i18n.t('coach')}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder={i18n.t('fullName')}
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder={i18n.t('password')}
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.hintText}>{i18n.t('passwordHint')}</Text>
            <TextInput
              placeholder={i18n.t('referralCodeOptional')}
              style={styles.input}
              value={referralCode}
              onChangeText={setReferralCode}
            />
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? i18n.t('signingUp') : i18n.t('signUp')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>{i18n.t('alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef6fb', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 4 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0e4d92', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12,
    fontSize: 16, backgroundColor: '#fafafa', marginBottom: 14,
  },
  roleSwitch: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 16 },
  selected: {
    backgroundColor: '#e6f0ff', padding: 6, borderRadius: 8,
    color: '#0e4d92', fontWeight: 'bold', fontSize: 16,
  },
  unselected: { color: '#888', padding: 6, fontSize: 16 },
  hintText: { color: '#888', fontSize: 12, marginBottom: 10, marginLeft: 4 },
  button: { backgroundColor: '#0e4d92', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 16, color: '#0e4d92', textAlign: 'center', fontSize: 14 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backText: { fontSize: 14, color: '#0e4d92', marginLeft: 6 },
});
