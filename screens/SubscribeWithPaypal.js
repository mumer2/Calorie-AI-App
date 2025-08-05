import React, { useState, useContext } from 'react';
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
import i18n from '../utils/i18n';
import { LanguageContext } from '../contexts/LanguageContext';

export default function SubscribeWithPaypal({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const { language } = useContext(LanguageContext);

  const planAmount = selectedPlan === 'yearly' ? 399 : 50;

  const handlePaypalPayment = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert(i18n.t('error'), i18n.t('userIdMissing'));
        return;
      }

      const res = await fetch(
        'https://backend-calorieai-app.netlify.app/.netlify/functions/paypal-pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount: planAmount, plan: selectedPlan }),
        }
      );

      const data = await res.json();

      if (res.ok && data.approvalUrl) {
        const supported = await Linking.canOpenURL(data.approvalUrl);
        supported
          ? Linking.openURL(data.approvalUrl)
          : Alert.alert(i18n.t('error'), i18n.t('paypalOpenFail'));

        await AsyncStorage.setItem('isSubscribed', 'true');
      } else {
        Alert.alert(i18n.t('paypalError'), data.error || i18n.t('paypalNoUrl'));
      }
    } catch (err) {
      Alert.alert(i18n.t('error'), err.message || i18n.t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e0f0ff', '#f7fbff']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>💳 {i18n.t('paypalTitle')}</Text>
        <Text style={styles.subtitle}>{i18n.t('paypalSubtitle')}</Text>

        <View style={styles.planToggleContainer}>
          <TouchableOpacity
            style={[styles.planButton, selectedPlan === 'monthly' && styles.activePlan]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <Text
              style={[
                styles.planButtonText,
                selectedPlan === 'monthly' && styles.activeText,
              ]}
            >
              {i18n.t('monthly')} - $50
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planButton, selectedPlan === 'yearly' && styles.activePlan]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <Text
              style={[
                styles.planButtonText,
                selectedPlan === 'yearly' && styles.activeText,
              ]}
            >
              {i18n.t('yearly')} - $399
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handlePaypalPayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {i18n.t('payWithPaypal', { amount: planAmount })}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>{i18n.t('paypalNote')}</Text>
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
  planToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 10,
  },
  planButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0070BA',
    backgroundColor: '#fff',
  },
  planButtonText: {
    color: '#0070BA',
    fontWeight: '600',
  },
  activePlan: {
    backgroundColor: '#0070BA',
  },
  activeText: {
    color: '#fff',
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
