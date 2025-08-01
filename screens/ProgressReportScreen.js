import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import i18n from '../utils/i18n';

export default function ProgressReportScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('week');

  useEffect(() => {
    loadStepHistory();
  }, []);

  const loadStepHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('stepHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sorted);
      }
    } catch (e) {
      console.error('Error loading step history', e);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const days = filter === 'month' ? 30 : 7;
    return history.slice(0, days).reverse();
  };

  const getSummary = () => {
    const filtered = getFilteredData();
    if (filtered.length === 0) return null;
    const total = filtered.reduce((sum, day) => sum + day.steps, 0);
    const average = Math.round(total / filtered.length);
    const bestDay = filtered.reduce((max, item) => (item.steps > max.steps ? item : max));
    return { total, average, bestDay };
  };

  const filteredData = getFilteredData();
  const summary = getSummary();

  const chartData = {
    labels: filteredData.map(d => d.date.slice(5)),
    datasets: [{ data: filteredData.map(d => d.steps) }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📈 {i18n.t('progressReport')}</Text>

      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={(val) => setFilter(val)}
      >
        <Picker.Item label={i18n.t('last7Days')} value="week" />
        <Picker.Item label={i18n.t('last30Days')} value="month" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#0e4d92" />
      ) : filteredData.length === 0 ? (
        <Text style={styles.noData}>{i18n.t('noProgressData')}</Text>
      ) : (
        <>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: () => '#0e4d92',
              labelColor: () => '#555',
              style: { borderRadius: 16 },
              propsForDots: { r: '5', strokeWidth: '2', stroke: '#0e4d92' },
            }}
            style={styles.chart}
          />

          {summary && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                👣 {i18n.t('totalSteps')}: {summary.total.toLocaleString()}
              </Text>
              <Text style={styles.summaryText}>
                📊 {i18n.t('averagePerDay')}: {summary.average.toLocaleString()}
              </Text>
              <Text style={styles.summaryText}>
                🏆 {i18n.t('bestDay')}: {summary.bestDay.date} – {summary.bestDay.steps.toLocaleString()} {i18n.t('steps')}
              </Text>
            </View>
          )}

          <Text style={styles.subheading}>📅 {i18n.t('stepHistory')}</Text>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.steps}>
                  {item.steps.toLocaleString()} {i18n.t('steps')}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9ff',
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  steps: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e4d92',
  },
  noData: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    fontSize: 16,
  },
});


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import i18n from '../utils/i18n';

// export default function ProgressReportScreen() {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadStepHistory();
//   }, []);

//   const loadStepHistory = async () => {
//     try {
//       const stored = await AsyncStorage.getItem('stepHistory');
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
//         setHistory(sorted);
//       }
//     } catch (e) {
//       console.error('Error loading step history', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSummary = () => {
//     if (history.length === 0) return null;
//     const total = history.reduce((sum, day) => sum + day.steps, 0);
//     const average = Math.round(total / history.length);
//     const bestDay = history.reduce((max, item) =>
//       item.steps > max.steps ? item : max
//     );
//     return { total, average, bestDay };
//   };

//   const summary = getSummary();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>📈 {i18n.t('progressReport')}</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#0e4d92" />
//       ) : history.length === 0 ? (
//         <Text style={styles.noData}>{i18n.t('noProgressData')}</Text>
//       ) : (
//         <>
//           {summary && (
//             <View style={styles.summaryBox}>
//               <Text style={styles.summaryText}>
//                 👣 {i18n.t('totalSteps')}: {summary.total.toLocaleString()}
//               </Text>
//               <Text style={styles.summaryText}>
//                 📊 {i18n.t('averagePerDay')}: {summary.average.toLocaleString()}
//               </Text>
//               <Text style={styles.summaryText}>
//                 🏆 {i18n.t('bestDay')}: {summary.bestDay.date} –{' '}
//                 {summary.bestDay.steps.toLocaleString()} {i18n.t('steps')}
//               </Text>
//             </View>
//           )}

//           <Text style={styles.subheading}>📅 {i18n.t('stepHistory')}</Text>
//           <FlatList
//             data={history}
//             keyExtractor={(item) => item.date}
//             renderItem={({ item }) => (
//               <View style={styles.item}>
//                 <Text style={styles.date}>{item.date}</Text>
//                 <Text style={styles.steps}>
//                   {item.steps.toLocaleString()} {i18n.t('steps')}
//                 </Text>
//               </View>
//             )}
//             contentContainerStyle={{ paddingBottom: 120 }}
//           />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f9ff',
//     paddingTop: Platform.OS === 'ios' ? 60 : 40,
//     paddingHorizontal: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#0e4d92',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   summaryBox: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     marginBottom: 20,
//     elevation: 3,
//   },
//   summaryText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   subheading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#0e4d92',
//     marginBottom: 10,
//   },
//   item: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     elevation: 2,
//   },
//   date: {
//     fontSize: 16,
//     color: '#333',
//   },
//   steps: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#0e4d92',
//   },
//   noData: {
//     marginTop: 40,
//     textAlign: 'center',
//     color: '#888',
//     fontStyle: 'italic',
//     fontSize: 16,
//   },
// });
