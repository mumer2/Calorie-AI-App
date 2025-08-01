import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../utils/i18n'; // ✅ same as SettingsScreen
import { LanguageContext } from '../contexts/LanguageContext';

export default function CoachHomeScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const { language } = useContext(LanguageContext); // optional if needed

  useFocusEffect(
    useCallback(() => {
      const getName = async () => {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
        }
      };
      getName();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.nameText}>{i18n.t('hi')}, {userName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CoachSettings')}>
          <Ionicons name="settings-outline" size={24} color="#0e4d92" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.dashboardTitle}>🏋️ {i18n.t('dashboardTitle')}</Text>

      {/* Cards */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ReviewRequests')}
        >
          <Ionicons name="eye-outline" size={32} color="#0e4d92" />
          <Text style={styles.cardText}>{i18n.t('reviewRequests')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('CoachLiveScreen')}
        >
          <Ionicons name="camera" size={32} color="#0e4d92" />
          <Text style={styles.cardText}>{i18n.t('joinLiveVideo')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f8ff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e4d92',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#0e4d92',
    textAlign: 'center',
  },
});
