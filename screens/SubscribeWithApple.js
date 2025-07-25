import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubscribeWithApple({ navigation }) {
  const [loading, setLoading] = useState(false);
  const amount = 5; // USD

  const handleApplePay = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return Alert.alert('Error', 'User ID not found');

      const res = await fetch(
        'https://backend-calorieai-app.netlify.app/.netlify/functions/apple-pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount }),
        }
      );

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        const supported = await Linking.canOpenURL(data.paymentUrl);
        supported
          ? Linking.openURL(data.paymentUrl)
          : Alert.alert('Error', 'Cannot open Apple Pay URL');

        // Save subscription state
        await AsyncStorage.setItem('isSubscribed', 'true');
      } else {
        Alert.alert('Apple Pay Error', data.error || 'No session URL');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>💵 Apple Pay Subscription</Text>
        <Text style={styles.subtitle}>
          Get unlimited access to premium features instantly.
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleApplePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pay $5 with Apple Pay</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>🔐 Safe & secure checkout powered by Stripe.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0e4d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  note: {
    marginTop: 20,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
