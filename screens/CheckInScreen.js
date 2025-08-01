import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LanguageContext } from '../contexts/LanguageContext';
import i18n from '../utils/i18n';

export default function CheckInScreen() {
  const [note, setNote] = useState('');
  const { language } = useContext(LanguageContext); // for re-render on language change

  const handleSubmit = async () => {
    if (!note.trim()) {
      Alert.alert(i18n.t('checkinEmpty'));
      return;
    }

    const date = new Date().toDateString();
    const entry = {
      date,
      note,
      timestamp: Date.now(),
    };

    try {
      const stored = await AsyncStorage.getItem('checkins');
      const parsed = stored ? JSON.parse(stored) : [];
      parsed.unshift(entry); // Add to top
      await AsyncStorage.setItem('checkins', JSON.stringify(parsed));

      Alert.alert('✅', i18n.t('checkinSaved'));
      setNote('');
    } catch (err) {
      Alert.alert('❌', i18n.t('checkinFailed'));
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f8ff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={60}
      >
        <View style={styles.box}>
          <Text style={styles.title}>📝 {i18n.t('dailyCheckIn')}</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={i18n.t('checkinPlaceholder')}
            style={styles.input}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>{i18n.t('saveCheckIn')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    paddingTop: 0,
    marginTop: 0,
  },
  box: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#0e4d92',
  },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
