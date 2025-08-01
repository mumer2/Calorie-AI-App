import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../utils/i18n';
import { LanguageContext } from '../contexts/LanguageContext';

const COACHES_URL = 'https://backend-calorieai-app.netlify.app/.netlify/functions/get-coaches';

export default function CoachVideoScreen() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext); // for language re-render

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch(COACHES_URL);
        const data = await res.json();

        if (res.ok) {
          setCoaches(data);
        } else {
          Alert.alert(i18n.t('error'), data.message || i18n.t('errorFetchingCoaches'));
        }
      } catch (error) {
        Alert.alert(i18n.t('error'), i18n.t('errorFetchingCoaches'));
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const joinSession = (coach) => {
    if (!coach || !coach._id) {
      Alert.alert(i18n.t('error'), i18n.t('errorMissingCoachData'));
      return;
    }

    navigation.navigate('Jitsi', { coach });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#0e4d92" />
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>{i18n.t('selectCoachHeader')}</Text>

          <FlatList
            data={coaches}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => joinSession(item)}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>{i18n.t('noCoachesAvailable')}</Text>}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6fc',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 16,
    textAlign: 'center',
    color: '#0e4d92',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e4d92',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
});
