import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../utils/i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ReminderScreen() {
  const [reminders, setReminders] = useState([]);
  const [text, setText] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadReminders();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(i18n.t('permissionDenied'));
    }
  };

  const loadReminders = async () => {
    const stored = await AsyncStorage.getItem('reminders');
    if (stored) {
      setReminders(JSON.parse(stored));
    }
  };

  const saveReminders = async (newReminders) => {
    setReminders(newReminders);
    await AsyncStorage.setItem('reminders', JSON.stringify(newReminders));
  };

  const scheduleReminder = async (text, date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('reminderTitle'),
        body: text,
        sound: 'default',
      },
      trigger: {
        type: 'date',
        date,
      },
    });
  };

  const addReminder = async () => {
    if (!text.trim()) return;

    const newReminder = {
      id: Date.now().toString(),
      text,
      time: time.toLocaleTimeString(),
    };

    const updated = [newReminder, ...reminders];
    saveReminders(updated);
    setText('');
    await scheduleReminder(text, time);
    Alert.alert('✅', `${i18n.t('reminderSet')} ${time.toLocaleTimeString()}`);
  };

  const deleteReminder = (id) => {
    Alert.alert(i18n.t('delete'), i18n.t('deleteConfirm'), [
      { text: i18n.t('cancel'), style: 'cancel' },
      {
        text: i18n.t('delete'),
        style: 'destructive',
        onPress: () => {
          const filtered = reminders.filter((r) => r.id !== id);
          saveReminders(filtered);
        },
      },
    ]);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(false);
    setTime(currentTime);
  };

  const clearAllReminders = () => {
    Alert.alert(i18n.t('clearAll'), i18n.t('clearAllConfirm'), [
      { text: i18n.t('cancel'), style: 'cancel' },
      {
        text: i18n.t('deleteAll'),
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('reminders');
          setReminders([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 {i18n.t('reminders')}</Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={i18n.t('reminderPlaceholder')}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.timeText}>⏰ {i18n.t('setTime')}: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onChangeTime}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={addReminder}>
        <Text style={styles.buttonText}>{i18n.t('addReminder')}</Text>
      </TouchableOpacity>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderRow}>
            <View>
              <Text style={styles.reminderText}>🔔 {item.text}</Text>
              <Text style={styles.reminderTime}>🕒 {item.time}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteReminder(item.id)}
            >
              <Text style={styles.deleteBtnText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* <TouchableOpacity
        style={[styles.button, { backgroundColor: '#c0392b' }]}
        onPress={clearAllReminders}
      >
        <Text style={styles.buttonText}>🗑️ {i18n.t('clearAllReminders')}</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0e4d92',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  timeButton: {
    marginBottom: 10,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  reminderText: {
    fontSize: 16,
    color: '#333',
  },
  reminderTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteBtnText: {
    fontSize: 18,
    color: '#c0392b',
  },
});
