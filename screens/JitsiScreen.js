import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LanguageContext } from '../contexts/LanguageContext';
import i18n from '../utils/i18n';

export default function JitsiScreen({ route }) {
  const [hasPermissions, setHasPermissions] = useState(false);
  const { coach } = route.params || {};
  const { language } = useContext(LanguageContext); // Re-render on language change

  useEffect(() => {
    if (!coach) {
      Alert.alert(i18n.t('noCoachTitle'), i18n.t('noCoachMessage'));
      return;
    }

    (async () => {
      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Audio.requestPermissionsAsync();

      if (camStatus === 'granted' && micStatus === 'granted') {
        setHasPermissions(true);
      } else {
        Alert.alert(
          i18n.t('permissionsTitle'),
          i18n.t('permissionsMessage')
        );
      }
    })();
  }, [coach, language]);

  const handleNavigation = (event) => {
    const { url } = event;
    if (url.startsWith('intent://') || url.includes('external')) return false;
    if (!url.startsWith('https://meet.jit.si')) {
      Linking.openURL(url);
      return false;
    }
    return true;
  };

  const displayName = coach?.name || i18n.t('coach');
  const roomName = `CalorieAI-Coach-${coach?._id || 'Unknown'}`;
  const encodedName = encodeURIComponent(displayName);

  const jitsiUrl = `https://meet.jit.si/${roomName}#config.disableDeepLinking=true&config.prejoinPageEnabled=false&userInfo.displayName="${encodedName}"`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        {hasPermissions && (
          <WebView
            source={{ uri: jitsiUrl }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            onShouldStartLoadWithRequest={handleNavigation}
            startInLoadingState
            cacheEnabled={false}
            allowsFullscreenVideo
            mixedContentMode="always"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
