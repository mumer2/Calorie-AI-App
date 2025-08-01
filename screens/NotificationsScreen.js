import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationContext } from '../contexts/NotificationContext';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../utils/i18n';

const NOTIFICATIONS_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/getUserNotifications';

export default function NotificationsScreen() {
  const { notifications, setNotifications, setUnreadCount } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(`${NOTIFICATIONS_URL}?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);

        // Reset badge count
        await Notifications.setBadgeCountAsync(0);
      } else {
        Alert.alert(i18n.t('error'), data.message || i18n.t('fetchError'));
      }
    } catch (err) {
      console.error('Notification Fetch Error:', err);
      Alert.alert(i18n.t('error'), i18n.t('networkError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, !item.isRead && styles.unread]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 {i18n.t('notifications')}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0e4d92" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0e4d92" // iOS
              colors={['#0e4d92']} // Android
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>{i18n.t('noNotifications')}</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0e4d92',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
  unread: {
    borderLeftColor: '#0e4d92',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#0e4d92',
  },
  body: {
    color: '#333',
    marginBottom: 6,
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
    fontSize: 14,
  },
});
