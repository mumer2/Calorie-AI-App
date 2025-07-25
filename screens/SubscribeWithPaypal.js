// ===========================
// 1. SubscribeWithPaypal.js
// ===========================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubscribeWithPaypal({ navigation }) {
  const [loading, setLoading] = useState(false);
  const amount = 5; // USD

  const handlePaypalPayment = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }

      const res = await fetch(
        'https://backend-calorieai-app.netlify.app/.netlify/functions/paypal-pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount }),
        }
      );

      const data = await res.json();

      if (res.ok && data.approvalUrl) {
        const supported = await Linking.canOpenURL(data.approvalUrl);
        supported
          ? Linking.openURL(data.approvalUrl)
          : Alert.alert('Error', 'Cannot open PayPal URL');
      } else {
        Alert.alert('PayPal Error', data.error || 'No approval URL');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e0f0ff', '#f7fbff']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>💳 PayPal Subscription</Text>
        <Text style={styles.subtitle}>
          Subscribe for premium access using PayPal.
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handlePaypalPayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pay $5 with PayPal</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>🔒 Fast & secure PayPal checkout.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#003087',
    marginBottom: 12,
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
    backgroundColor: '#0070BA',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
