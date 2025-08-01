import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LanguageContext } from '../contexts/LanguageContext';
import i18n from '../utils/i18n';

export default function CoachListScreen({ navigation }) {
  const { language } = useContext(LanguageContext); // Re-render on language change
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/get-coaches')
      .then(res => res.json())
      .then(data => {
        setCoaches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Coach fetch error:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const renderCoach = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CoachProfile', { coach: item })}
    >
      <Text style={styles.name}>{item.name}</Text>
      {item.specialty ? <Text style={styles.specialty}>{item.specialty}</Text> : null}
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('availableCoaches')}</Text>

      {error ? (
        <Text style={styles.error}>{i18n.t('errorFetch')}</Text>
      ) : coaches.length === 0 ? (
        <Text style={styles.empty}>{i18n.t('noCoaches')}</Text>
      ) : (
        <FlatList
          data={coaches}
          keyExtractor={(item) => item._id}
          renderItem={renderCoach}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#eef6fb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0e4d92',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e4d92',
  },
  specialty: {
    color: '#555',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 40,
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e53935',
    marginTop: 40,
  },
});
