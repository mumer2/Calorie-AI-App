import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../utils/i18n';
import { LanguageContext } from '../contexts/LanguageContext';

const SEND_REQUEST_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/send-request';
const GET_REPLIES_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/get-replies';

export default function CoachProfileScreen({ route }) {
  const { coach } = route.params;
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('request');
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasNewReplies, setHasNewReplies] = useState(false);
  const { language } = useContext(LanguageContext); // to trigger i18n re-render

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(i18n.t('permissionNotGranted'));
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      const userId = await AsyncStorage.getItem('userId');

      await fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/save-push-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pushToken: token }),
      });

      console.log('Expo Push Token:', token);
    }
  };

  const handleSendRequest = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const userName = await AsyncStorage.getItem('userName');

    if (!message.trim()) {
      Alert.alert(i18n.t('messageRequired'));
      return;
    }

    try {
      setSending(true);
      const response = await fetch(SEND_REQUEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachId: coach._id, userId, userName, message }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(i18n.t('requestSentTitle'), i18n.t('requestSentBody'));
        setMessage('');
      } else {
        Alert.alert(i18n.t('error'), data.message || i18n.t('somethingWentWrong'));
      }
    } catch (err) {
      Alert.alert(i18n.t('error'), i18n.t('sendRequestFailed'));
    } finally {
      setSending(false);
    }
  };

  const fetchReplies = async () => {
    try {
      setLoadingReplies(true);
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${GET_REPLIES_URL}?userId=${userId}&coachId=${coach._id}`);
      const data = await response.json();

      if (response.ok) {
        const prevReplies = await AsyncStorage.getItem(`replies_${coach._id}`);
        const prevParsed = prevReplies ? JSON.parse(prevReplies) : [];
        const newReply = prevParsed.length < data.length;

        if (newReply) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: i18n.t('newReplyTitle'),
              body: i18n.t('newReplyBody'),
              data: { screen: 'Replies' },
            },
            trigger: null,
          });
          setHasNewReplies(true);
        }

        await AsyncStorage.setItem(`replies_${coach._id}`, JSON.stringify(data));
        setReplies(data);
      } else {
        Alert.alert(i18n.t('error'), i18n.t('failedToLoadReplies'));
      }
    } catch (err) {
      Alert.alert(i18n.t('error'), i18n.t('serverConnectionError'));
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'replies') {
      fetchReplies();
      setHasNewReplies(false);
    }
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Text style={styles.profile}>{i18n.t('coachProfile')}</Text>

      <View style={styles.row}>
        <Icon name="person" size={20} color="#0e4d92" style={styles.icon} />
        <Text style={styles.name}>{coach.name}</Text>
      </View>

      <View style={styles.row}>
        <Icon name="email" size={20} color="#0e4d92" style={styles.icon} />
        <Text style={styles.email}>{coach.email}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'request' && styles.activeTab]}
          onPress={() => setActiveTab('request')}
        >
          <Text style={styles.tabText}>{i18n.t('sendRequest')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'replies' && styles.activeTab]}
          onPress={() => setActiveTab('replies')}
        >
          <Text style={styles.tabText}>
            {i18n.t('replies')} {hasNewReplies && <Text style={styles.badge}>•</Text>}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'request' && (
        <>
          <TextInput
            placeholder={i18n.t('typeYourMessage')}
            multiline
            value={message}
            onChangeText={setMessage}
            style={styles.textArea}
          />
          <TouchableOpacity
            style={[styles.button, sending && { opacity: 0.7 }]}
            onPress={handleSendRequest}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{i18n.t('sendRequest')}</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {activeTab === 'replies' && (
        <View style={styles.repliesContainer}>
          {loadingReplies ? (
            <ActivityIndicator size="large" color="#0e4d92" />
          ) : replies.length === 0 ? (
            <Text style={styles.empty}>{i18n.t('noRepliesYet')}</Text>
          ) : (
            <FlatList
              data={replies}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.replyCard}>
                  <Text style={styles.label}>🗨️ {i18n.t('yourRequest')}</Text>
                  <Text style={styles.requestText}>{item.message}</Text>
                  <Text style={styles.date}>{i18n.t('sentAt')}: {new Date(item.timestamp).toLocaleString()}</Text>

                  <View style={styles.separator} />

                  <Text style={styles.label}>🎯 {i18n.t('coachsReply')}</Text>
                  <Text style={styles.replyText}>{item.reply}</Text>
                  <Text style={styles.date}>{i18n.t('repliedAt')}: {new Date(item.repliedAt).toLocaleString()}</Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f0f8ff' },
  profile: { fontSize: 24, fontWeight: 'bold', color: '#0e4d92', marginBottom: 10, textAlign: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#0e4d92' },
  email: { fontSize: 16, color: '#555' },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#0e4d92',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0e4d92',
  },
  badge: {
    color: 'red',
    fontSize: 20,
    marginLeft: 6,
    lineHeight: 16,
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  repliesContainer: { marginTop: 0, marginBottom: 100, paddingBottom: 60 },
  replyCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#0e4d92',
  },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#0e4d92' },
  date: { fontSize: 12, color: '#777', marginBottom: 8, textAlign: 'right' },
  requestText: { fontSize: 15, color: '#444', marginBottom: 6 },
  replyText: { fontSize: 15, color: '#333', marginBottom: 6 },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  empty: { textAlign: 'center', color: '#777', marginTop: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
});
