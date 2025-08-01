import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
  StatusBar, Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import i18n from '../utils/i18n'; // ✅ Import i18n

export default function FitnessScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiData, setBmiData] = useState(null);

  const calculate = () => {
    const h = parseFloat(height), w = parseFloat(weight), a = parseInt(age);
    if (!h || !w || !a) return;

    const bmi = w / ((h / 100) ** 2);
    const bmr = 10 * w + 6.25 * h - 5 * a + 5;
    const tdee = bmr * 1.55;

    let category = '', suggestion = '';
    if (bmi < 18.5) {
      category = i18n.t('underweight');
      suggestion = i18n.t('underweightSuggestion');
    } else if (bmi < 25) {
      category = i18n.t('normalWeight');
      suggestion = i18n.t('normalWeightSuggestion');
    } else if (bmi < 30) {
      category = i18n.t('overweight');
      suggestion = i18n.t('overweightSuggestion');
    } else {
      category = i18n.t('obese');
      suggestion = i18n.t('obeseSuggestion');
    }

    const weekly = [bmi - 0.2, bmi - 0.1, bmi, bmi + 0.1, bmi, bmi + 0.05, bmi];
    setBmiData({ bmi, bmr: Math.round(bmr), tdee: Math.round(tdee), category, suggestion, weekly });
  };

  const chartConfig = {
    backgroundGradientFrom: '#e0f7fa',
    backgroundGradientTo: '#e0f7fa',
    decimalPlaces: 1,
    color: opacity => `rgba(14, 77, 146, ${opacity})`,
    labelColor: opacity => `rgba(33,33,33, ${opacity})`,
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#0e4d92' },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>{i18n.t('healthMetrics')}</Text>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder={i18n.t('age')}
            keyboardType="numeric"
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder={i18n.t('height')}
            keyboardType="numeric"
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder={i18n.t('weight')}
            keyboardType="numeric"
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={calculate}>
          <Text style={styles.buttonText}>{i18n.t('calculate')}</Text>
        </TouchableOpacity>

        {bmiData && (
          <>
            <View style={styles.resultBox}>
              <Text style={styles.metric}>{i18n.t('bmi')}: {bmiData.bmi.toFixed(1)} ({bmiData.category})</Text>
              <Text style={styles.metric}>{i18n.t('bmr')}: {bmiData.bmr} kcal/day</Text>
              <Text style={styles.metric}>{i18n.t('tdee')}: {bmiData.tdee} kcal/day</Text>
              <Text style={styles.suggestion}>{bmiData.suggestion}</Text>
            </View>

            <Text style={styles.chartTitle}>{i18n.t('weeklyBmiTrend')}</Text>
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: bmiData.weekly }]
              }}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
            />
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f8ff' },
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, color: '#0e4d92', fontWeight: 'bold', marginVertical: 20 },
  inputGroup: { width: '100%' },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultBox: {
    backgroundColor: '#fff',
    padding: 18,
    width: '100%',
    borderRadius: 12,
    elevation: 2,
    marginVertical: 10
  },
  metric: { fontSize: 16, marginBottom: 6, color: '#222' },
  suggestion: { fontSize: 15, color: '#0d47a1', fontStyle: 'italic', marginTop: 8 },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 16 },
  chart: {
    marginTop: 10, borderRadius: 16,
  },
});
