import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import i18n from '../utils/i18n';

export default function WeChatPayScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const planFee = selectedPlan === 'yearly' ? 39900 : 5000; // fen (¥)

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://backend-calorieai-app.netlify.app/.netlify/functions/wechat-pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ total_fee: planFee }),
        }
      );

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        console.log('🟢 WeChat Payment Response:', data);

        if (data.mweb_url) {
          setUrl(data.mweb_url);
        } else {
          Alert.alert(i18n.t('wechatPayError'), data.error || i18n.t('wechatNoUrl'));
        }
      } else {
        const text = await res.text();
        console.log('🔴 Unexpected response:', text);
        Alert.alert(i18n.t('wechatPayError'), i18n.t('invalidServerResponse'));
      }
    } catch (e) {
      console.log('🔴 Fetch error:', e.message);
      Alert.alert(i18n.t('networkError'), e.message);
    } finally {
      setLoading(false);
    }
  };

  if (url) {
    return (
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        onNavigationStateChange={(navState) => {
          // Optionally handle redirects
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('wechatTitle')}</Text>
      <Text style={styles.subtitle}>{i18n.t('wechatSubtitle')}</Text>

      <View style={styles.planToggle}>
        <TouchableOpacity
          style={[styles.planBtn, selectedPlan === 'monthly' && styles.activePlan]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <Text style={[styles.planText, selectedPlan === 'monthly' && styles.activeText]}>
            {i18n.t('monthly')} - ¥50
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.planBtn, selectedPlan === 'yearly' && styles.activePlan]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <Text style={[styles.planText, selectedPlan === 'yearly' && styles.activeText]}>
            {i18n.t('yearly')} - ¥399
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.subscribeBtn, loading && { opacity: 0.7 }]}
        onPress={initiatePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.subscribeText}>{i18n.t('subscribeNow')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#0e4d92', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 20 },
  planToggle: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  planBtn: {
    borderColor: '#0e4d92',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  activePlan: {
    backgroundColor: '#0e4d92',
  },
  planText: {
    color: '#0e4d92',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  subscribeBtn: {
    backgroundColor: '#0e4d92',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, View } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function WeChatPayScreen() {
//   const [url, setUrl] = useState('');

//   useEffect(() => {
//     fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/wechat-pay', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ total_fee: 100 }), // 100 fen = ¥1.00
//     })
//       .then(async (res) => {
//         const contentType = res.headers.get('content-type');
//         if (contentType && contentType.includes('application/json')) {
//           const data = await res.json();
//           console.log('🟢 WeChat Payment Response:', data);

//           if (data.mweb_url) {
//             setUrl(data.mweb_url);
//           } else {
//             Alert.alert('WeChat Error', data.error || 'WeChat did not return a payment link');
//           }
//         } else {
//           const text = await res.text();
//           console.log('🔴 Unexpected response:', text);
//           Alert.alert('WeChat Error', 'Invalid server response');
//         }
//       })
//       .catch((e) => {
//         console.log('🔴 Fetch error:', e.message);
//         Alert.alert('Network Error', e.message);
//       });
//   }, []);

//   return url ? (
//     <WebView
//       source={{ uri: url }}
//       style={{ flex: 1 }}
//       onNavigationStateChange={(navState) => {
//         // Optional: detect redirect or return URL to exit payment
//         // Example:
//         // if (navState.url.includes('payment-success')) navigation.goBack();
//       }}
//     />
//   ) : (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <ActivityIndicator size="large" color="#0e4d92" />
//     </View>
//   );
// }
