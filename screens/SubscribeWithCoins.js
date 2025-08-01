import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../utils/i18n'; // ✅ Import i18n

const COIN_SUBSCRIBE_URL =
  'https://backend-calorieai-app.netlify.app/.netlify/functions/subscribe-with-coins';

export default function SubscribeWithCoins({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const planOptions = {
    monthly: {
      label: i18n.t('monthlyPlanWithCoins'),
      amount: 1000,
      duration: 1,
    },
    yearly: {
      label: i18n.t('yearlyPlanWithCoins'),
      amount: 20000,
      duration: 12,
    },
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error(i18n.t('userIdNotFound'));

      const { amount, duration } = planOptions[selectedPlan];

      const res = await fetch(COIN_SUBSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
          plan: selectedPlan,
          duration,
        }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error(i18n.t('invalidServerResponse') + ': ' + text);
      }

      if (res.ok && data.message === 'Subscription successful') {
        await AsyncStorage.setItem('isSubscribed', 'true');

        Alert.alert(
          i18n.t('subscribed'),
          i18n.t('subscriptionSuccessMessage', { plan: selectedPlan }),
          [
            {
              text: i18n.t('ok'),
              onPress: () => navigation.replace('MainTabs', { screen: 'Home' }),
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(data.message || i18n.t('subscriptionFailed'));
      }
    } catch (err) {
      console.error(err.message || err);
      Alert.alert(i18n.t('error'), err.message || i18n.t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e6f0ff', '#f4f8fb']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t('useCoinsToSubscribe')}</Text>
        <Text style={styles.subtitle}>{i18n.t('choosePlan')}</Text>

        {Object.entries(planOptions).map(([key, { label }]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.planButton,
              selectedPlan === key && styles.selectedPlanButton,
            ]}
            onPress={() => setSelectedPlan(key)}
          >
            <Text
              style={[
                styles.planText,
                selectedPlan === key && styles.selectedPlanText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{i18n.t('confirmSubscription')}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>{i18n.t('subscriptionNote')}</Text>
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
    fontWeight: '700',
    color: '#0e4d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  planButton: {
    borderWidth: 1,
    borderColor: '#0e4d92',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  selectedPlanButton: {
    backgroundColor: '#0e4d92',
  },
  planText: {
    fontSize: 16,
    color: '#0e4d92',
  },
  selectedPlanText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
