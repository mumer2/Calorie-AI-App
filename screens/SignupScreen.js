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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';


const REQUEST_OTP_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/request-otp';
const VERIFY_OTP_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/verify-otp';
const SIGNUP_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/signup';

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [contact, setContact] = useState(''); // email or phone
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
  const phoneRegex = /^[0-9]{10,15}$/;
  const passwordRegex = /^(?=.*\d).{6,}$/;

  const isEmail = emailRegex.test(contact.trim());
  const isPhone = phoneRegex.test(contact.trim());

  const handleContinue = async () => {
    if (!contact.trim()) return Alert.alert('Error', 'Enter email or phone number');
    if (isEmail) {
      setVerified(true);
      setStep(2);
    } else if (isPhone) {
      setLoading(true);
      try {
        const res = await fetch(REQUEST_OTP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: contact.trim() }),
        });
        const data = await res.json();
        if (res.ok) {
          Alert.alert('OTP Sent', 'Check your phone');
          setStep(3);
        } else {
          Alert.alert('Failed', data.message || 'Could not send OTP');
        }
      } catch (err) {
        Alert.alert('Error', 'Network error');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Invalid', 'Enter a valid email or phone number');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return Alert.alert('Error', 'Enter the OTP');
    setLoading(true);
    try {
      const res = await fetch(VERIFY_OTP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: contact.trim(), otp }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Verified', 'Phone number verified');
        setVerified(true);
        setStep(2);
      } else {
        Alert.alert('Failed', data.message || 'OTP verification failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !password.trim()) {
      return Alert.alert('Error', 'Name and password are required');
    }
    if (!isEmail && !isPhone) {
      return Alert.alert('Invalid Contact', 'Enter a valid email or phone number');
    }
    if (!passwordRegex.test(password)) {
      return Alert.alert('Weak Password', 'At least 6 characters with a digit');
    }

    setLoading(true);
    try {
      const res = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: isEmail ? contact.trim().toLowerCase() : '',
          phone: isPhone ? contact.trim() : '',
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

        Alert.alert('🎉 Account Created', `You earned ${data.points || 50} points!`);
        navigation.replace('Login');
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

 const renderBackButton = () => (
  <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
    <Ionicons name="arrow-back" size={18} color="#0e4d92" />
    <Text style={styles.backText}>Back</Text>
  </TouchableOpacity>
);


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        {step === 1 && (
          <>
            <TextInput
              placeholder="Email or Phone"
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              keyboardType="default"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Continue'}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            {renderBackButton()}
            <TextInput
              placeholder="Enter OTP"
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
              <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && verified && (
          <>
            {renderBackButton()}

            <View style={styles.roleSwitch}>
              <TouchableOpacity onPress={() => setRole('member')}>
                <Text style={role === 'member' ? styles.selected : styles.unselected}>Member</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRole('coach')}>
                <Text style={role === 'coach' ? styles.selected : styles.unselected}>Coach</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.hintText}>
              Password must be at least 6 characters and include a number.
            </Text>
            <TextInput
              placeholder="Referral Code (optional)"
              style={styles.input}
              value={referralCode}
              onChangeText={setReferralCode}
            />
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e4d92',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
  roleSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  selected: {
    backgroundColor: '#e6f0ff',
    padding: 6,
    borderRadius: 8,
    color: '#0e4d92',
    fontWeight: 'bold',
    fontSize: 16,
  },
  unselected: {
    color: '#888',
    padding: 6,
    fontSize: 16,
  },
  hintText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    color: '#0e4d92',
    textAlign: 'center',
    fontSize: 14,
  },
 backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
backText: {
  fontSize: 14,
  color: '#0e4d92',
  marginLeft: 6,
},
});
