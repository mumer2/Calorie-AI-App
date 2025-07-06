import React, { useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // <-- import this
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationContext } from '../contexts/NotificationContext';
import * as Notifications from 'expo-notifications';

const NOTIFICATIONS_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/getUserNotifications';

export default function NotificationsScreen() {
  const { notifications, setNotifications, setUnreadCount } = useContext(NotificationContext);
  const [loading, setLoading] = React.useState(true);

  const fetchNotifications = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const response = await fetch(`${NOTIFICATIONS_URL}?userId=${userId}`);
    const data = await response.json();

    if (response.ok) {
      setNotifications(data);

      const unread = data.filter((n) => !n.isRead).length;

      // ✅ Update badge count in context
      setUnreadCount(0);

      // ✅ Update the app icon badge count
      await Notifications.setBadgeCountAsync(0);
    } else {
      Alert.alert('Error', data.message || 'Failed to load notifications');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Could not fetch notifications');
  } finally {
    setLoading(false);
  }
};

  // ✅ Automatically refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={[styles.card, !item.isRead && styles.unread]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Your Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0e4d92" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff', padding: 20 },
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
  title: { fontWeight: 'bold', marginBottom: 4 },
  body: { color: '#333', marginBottom: 6 },
  time: { fontSize: 12, color: '#888' },
  empty: { textAlign: 'center', color: '#666', marginTop: 50 },
});
