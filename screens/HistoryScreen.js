import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LanguageContext } from '../contexts/LanguageContext';
import i18n from '../utils/i18n';

export default function CheckInHistoryScreen() {
  const { language } = useContext(LanguageContext); // React to language change
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCheckins = async () => {
    try {
      const stored = await AsyncStorage.getItem('checkins');
      const parsed = stored ? JSON.parse(stored) : [];
      setCheckins(parsed);
    } catch (error) {
      console.error('❌ Failed to load check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCheckins();
    }, [])
  );

  const clearAllHistory = () => {
    Alert.alert(
      i18n.t('clearTitle'),
      i18n.t('clearConfirm'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('clear'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('checkins');
            setCheckins([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.note}>{item.note}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📅 {i18n.t('checkinHistory')}</Text>
        {checkins.length > 0 && (
          <TouchableOpacity onPress={clearAllHistory}>
            <Text style={styles.clearText}>{i18n.t('clear')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {checkins.length === 0 ? (
        <Text style={styles.empty}>{i18n.t('noCheckins')}</Text>
      ) : (
        <FlatList
          data={checkins}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff', padding: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0e4d92' },
  clearText: { color: '#e53935', fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
  },
  date: { fontWeight: 'bold', marginBottom: 6, color: '#444' },
  note: { color: '#555', fontSize: 16 },
  empty: { color: '#888', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
