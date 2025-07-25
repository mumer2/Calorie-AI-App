import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WeChatPayScreen() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/wechat-pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_fee: 100 }), // 100 fen = ¥1.00
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('🟢 WeChat Payment Response:', data);

          if (data.mweb_url) {
            setUrl(data.mweb_url);
          } else {
            Alert.alert('WeChat Error', data.error || 'WeChat did not return a payment link');
          }
        } else {
          const text = await res.text();
          console.log('🔴 Unexpected response:', text);
          Alert.alert('WeChat Error', 'Invalid server response');
        }
      })
      .catch((e) => {
        console.log('🔴 Fetch error:', e.message);
        Alert.alert('Network Error', e.message);
      });
  }, []);

  return url ? (
    <WebView
      source={{ uri: url }}
      style={{ flex: 1 }}
      onNavigationStateChange={(navState) => {
        // Optional: detect redirect or return URL to exit payment
        // Example:
        // if (navState.url.includes('payment-success')) navigation.goBack();
      }}
    />
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0e4d92" />
    </View>
  );
}
