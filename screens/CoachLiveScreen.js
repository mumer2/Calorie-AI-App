import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../utils/i18n'; // ✅ i18n translation support

export default function CoachLiveScreen() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    initializeCoach();
  }, []);

  const initializeCoach = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      const userRole = await AsyncStorage.getItem('userRole');

      if (userRole !== 'coach') {
        Alert.alert(i18n.t('accessDenied'), i18n.t('coachOnlyLive'));
        return;
      }

      if (!userId || !userName) {
        Alert.alert(i18n.t('error'), i18n.t('coachInfoMissing'));
        return;
      }

      setCoach({ _id: userId, name: userName });

      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Audio.requestPermissionsAsync();

      if (camStatus === 'granted' && micStatus === 'granted') {
        setHasPermissions(true);
      } else {
        Alert.alert(
          i18n.t('permissionsRequired'),
          i18n.t('cameraMicRequired')
        );
      }
    } catch (error) {
      console.error('❌ Coach Live Init Error:', error);
      Alert.alert(i18n.t('error'), i18n.t('somethingWrong'));
    }
  };

  const handleNavigation = (event) => {
    const { url } = event;
    if (url.startsWith('intent://') || url.includes('external')) return false;
    if (!url.startsWith('https://meet.jit.si')) {
      Linking.openURL(url);
      return false;
    }
    return true;
  };

  const roomName = coach ? `CalorieAI-Coach-${coach._id}` : '';
  const encodedName = encodeURIComponent(coach?.name || 'Coach');
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.disableDeepLinking=true&config.prejoinPageEnabled=false&userInfo.displayName="${encodedName}"`;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {hasPermissions && coach && (
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
