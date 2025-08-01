import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import i18n from '../utils/i18n';

export default function StepsHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadStepHistory();
  }, []);

  useEffect(() => {
    applyFilter(filter);
  }, [history, filter]);

  const loadStepHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('stepHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sorted);
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem('stepHistory');
    setHistory([]);
  };

  const applyFilter = (selected) => {
    const now = moment();
    let filteredData = history;

    if (selected === 'Week') {
      filteredData = history.filter(item =>
        moment(item.date).isSame(now, 'week')
      );
    } else if (selected === 'Month') {
      filteredData = history.filter(item =>
        moment(item.date).isSame(now, 'month')
      );
    }

    setFiltered(filteredData);
  };

  const getSummary = () => {
    const totalSteps = filtered.reduce((acc, item) => acc + item.steps, 0);
    const distance = (totalSteps * 0.0008).toFixed(2);
    const calories = (totalSteps * 0.04).toFixed(1);
    return { totalSteps, distance, calories };
  };

  const renderSummary = () => {
    const { totalSteps, distance, calories } = getSummary();
    return (
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>📈 {i18n.t('summary')} - {i18n.t(filter.toLowerCase())}</Text>
        <Text style={styles.summaryItem}>👣 {i18n.t('steps')}: {totalSteps.toLocaleString()}</Text>
        <Text style={styles.summaryItem}>🚶 {i18n.t('distance')}: {distance} km</Text>
        <Text style={styles.summaryItem}>🔥 {i18n.t('calories')}: {calories} kcal</Text>
      </View>
    );
  };

  const renderFilterTabs = () => (
    <View style={styles.filterBar}>
      {['All', 'Week', 'Month'].map(option => (
        <TouchableOpacity
          key={option}
          style={[styles.filterTab, filter === option && styles.filterTabActive]}
          onPress={() => setFilter(option)}
        >
          <Text style={[styles.filterText, filter === option && styles.filterTextActive]}>
            {i18n.t(option.toLowerCase())}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItem = ({ item }) => {
    const distance = (item.steps * 0.0008).toFixed(2);
    const calories = (item.steps * 0.04).toFixed(1);

    return (
      <Animated.View style={styles.item}>
        <Text style={styles.date}>📅 {moment(item.date).format('dddd, MMM D')}</Text>
        <Text style={styles.steps}>👣 {item.steps.toLocaleString()} {i18n.t('steps')}</Text>
        <Text style={styles.metrics}>🚶 {distance} km ‧ 🔥 {calories} kcal</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏃‍♂️ {i18n.t('stepHistoryTracker')}</Text>

      {renderSummary()}
      {renderFilterTabs()}

      <FlatList
        data={filtered}
        keyExtractor={item => item.date}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noData}>{i18n.t('noDataMessage')}</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {filtered.length > 0 && (
        <View style={styles.clearBtnWrapper}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
            <Text style={styles.clearBtnText}>🗑 {i18n.t('clearAllHistory')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f1fb',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e4d92',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#d9e8fa',
  },
  filterTabActive: {
    backgroundColor: '#0e4d92',
  },
  filterText: {
    fontSize: 14,
    color: '#0e4d92',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  date: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  steps: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0e4d92',
    marginBottom: 2,
  },
  metrics: {
    fontSize: 14,
    color: '#444',
  },
  noData: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    fontSize: 16,
  },
  clearBtn: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#e53935',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 3,
  },
  clearBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
});
