// ✅ File: SubscribeScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../utils/i18n';
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubscribeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const calculateExpiry = (type) => {
    const now = new Date();
    if (type === 'monthly') now.setMonth(now.getMonth() + 1);
    else now.setFullYear(now.getFullYear() + 1);
    return now.toISOString();
  };

  const proceedWithSubscription = async (method) => {
    if (!selectedPackage) return;

    const userId = await AsyncStorage.getItem('userId');

    const subscriptionData = {
      userId,
      plan: selectedPackage,
      method,
      startDate: new Date().toISOString(),
      endDate: calculateExpiry(selectedPackage),
    };

    navigation.navigate(method, { subscriptionData });
  };

  return (
    <LinearGradient colors={['#e6f0ff', '#f8fcff']} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={[styles.container, { opacity: fadeAnim }]}
        >
          <Text style={styles.title}>{i18n.t('chooseSubscription')}</Text>

          <View style={styles.packageContainer}>
            <TouchableOpacity
              style={[styles.packageBox, selectedPackage === 'monthly' && styles.selectedPackage]}
              onPress={() => setSelectedPackage('monthly')}
            >
              <MaterialIcons name="calendar-today" size={28} color={selectedPackage === 'monthly' ? '#fff' : '#0e4d92'} style={styles.icon} />
              <View>
                <Text style={[styles.packageTitle, selectedPackage === 'monthly' && styles.selectedText]}>
                  {i18n.t('monthlyPlan')}
                </Text>
                <Text style={[styles.packagePrice, selectedPackage === 'monthly' && styles.selectedText]}>
                  $50 / {i18n.t('month')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.packageBox, selectedPackage === 'yearly' && styles.selectedPackage]}
              onPress={() => setSelectedPackage('yearly')}
            >
              <MaterialIcons name="calendar-view-month" size={28} color={selectedPackage === 'yearly' ? '#fff' : '#0e4d92'} style={styles.icon} />
              <View>
                <Text style={[styles.packageTitle, selectedPackage === 'yearly' && styles.selectedText]}>
                  {i18n.t('yearlyPlan')}
                </Text>
                <Text style={[styles.packagePrice, selectedPackage === 'yearly' && styles.selectedText]}>
                  $399 / {i18n.t('year')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {selectedPackage && (
            <>
              <Text style={styles.paymentTitle}>{i18n.t('selectPaymentMethod')}</Text>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => proceedWithSubscription('SubwithCoins')}
              >
                <FontAwesome5 name="coins" size={20} color="#fff" style={styles.iconSmall} />
                <Text style={styles.buttonText}>{i18n.t('subscribeWithCoins')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonWeChat}
                onPress={() => proceedWithSubscription('WeChatPay')}
              >
                <FontAwesome name="wechat" size={20} color="#fff" style={styles.iconSmall} />
                <Text style={styles.buttonText}>{i18n.t('subscribeWithWeChat')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonApple}
                onPress={() => proceedWithSubscription('ApplePay')}
              >
                <Ionicons name="logo-apple" size={20} color="#fff" style={styles.iconSmall} />
                <Text style={styles.buttonText}>{i18n.t('subscribeWithApple')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonPaypal}
                onPress={() => proceedWithSubscription('PayPal')}
              >
                <FontAwesome name="paypal" size={20} color="#fff" style={styles.iconSmall} />
                <Text style={styles.buttonText}>{i18n.t('subscribeWithPaypal')}</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0e4d92',
    textAlign: 'center',
    marginBottom: 30,
  },
  packageContainer: {
    gap: 15,
    marginBottom: 30,
  },
  packageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0e4d92',
    padding: 16,
    borderRadius: 12,
  },
  selectedPackage: {
    backgroundColor: '#0e4d92',
  },
  selectedText: {
    color: '#fff',
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e4d92',
  },
  packagePrice: {
    fontSize: 14,
    color: '#666',
  },
  icon: {
    marginRight: 12,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0e4d92',
    textAlign: 'center',
  },
  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0e4d92',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonWeChat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00c300',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonApple: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonPaypal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0070BA',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  iconSmall: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
