import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import i18n from '../utils/i18n';

export default function AppUsageInstructionsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} edges={['bottom', 'left', 'right']}>
      <Text style={styles.title}>{i18n.t('usageInstructions')}</Text>
      <Text style={styles.text}>
        1. Login or create an account to access all features.{'\n\n'}
        2. Set your profile and choose your fitness preferences.{'\n\n'}
        3. Use the Home tab to view recommendations.{'\n\n'}
        4. Track your steps and workouts in the Check-In tab.{'\n\n'}
        5. Monitor your progress in History and Reports.{'\n\n'}
        6. Subscribe to unlock premium features.{'\n\n'}
        7. Contact your coach through Coach List and Live options.{'\n\n'}
        8. Change language or logout in the Settings tab.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
