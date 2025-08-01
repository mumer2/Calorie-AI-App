import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import i18n from '../utils/i18n';

export default function RedeemScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎁 {i18n.t('redeemRewards')}</Text>
      <Text style={styles.message}>{i18n.t('redeemComingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
