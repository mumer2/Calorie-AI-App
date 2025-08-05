import React, { useState, useContext } from 'react';
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
import i18n from '../utils/i18n';
import { LanguageContext } from '../contexts/LanguageContext';

export default function SubscribeWithApple({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('monthly'); // 'monthly' or 'yearly'
  const { language } = useContext(LanguageContext);

  const handleApplePay = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return Alert.alert(i18n.t('error'), i18n.t('userIdMissing'));

      const amount = plan === 'yearly' ? 399 : 50;

      const res = await fetch(
        'https://backend-calorieai-app.netlify.app/.netlify/functions/apple-pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount, plan }),
        }
      );

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        const supported = await Linking.canOpenURL(data.paymentUrl);
        supported
          ? Linking.openURL(data.paymentUrl)
          : Alert.alert(i18n.t('error'), i18n.t('applePayOpenFail'));

        await AsyncStorage.setItem('isSubscribed', 'true');
        await AsyncStorage.setItem('subscriptionPlan', plan);
      } else {
        Alert.alert(i18n.t('applePayError'), data.error || i18n.t('applePayNoUrl'));
      }
    } catch (err) {
      Alert.alert(i18n.t('error'), err.message || i18n.t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>💵 {i18n.t('applePayTitle')}</Text>
        <Text style={styles.subtitle}>
          {i18n.t('applePaySubtitle')}
        </Text>

        <View style={styles.planContainer}>
          <TouchableOpacity
            style={[styles.planButton, plan === 'monthly' && styles.planButtonSelected]}
            onPress={() => setPlan('monthly')}
          >
            <Text
              style={[styles.planText, plan === 'monthly' && styles.planTextSelected]}
            >
              {i18n.t('monthly')} - $50
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planButton, plan === 'yearly' && styles.planButtonSelected]}
            onPress={() => setPlan('yearly')}
          >
            <Text
              style={[styles.planText, plan === 'yearly' && styles.planTextSelected]}
            >
              {i18n.t('yearly')} - $399
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleApplePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {i18n.t('payWithApple', { amount: plan === 'yearly' ? '399' : '50' })}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>{i18n.t('applePayNote')}</Text>
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  planContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 12,
  },
  planButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0e4d92',
    backgroundColor: '#fff',
  },
  planButtonSelected: {
    backgroundColor: '#0e4d92',
  },
  planText: {
    color: '#0e4d92',
    fontWeight: '600',
  },
  planTextSelected: {
    color: '#fff',
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
