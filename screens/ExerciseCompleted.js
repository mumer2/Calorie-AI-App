import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Platform } from 'react-native';
import i18n from '../utils/i18n'; // ✅ i18n translation support

export default function ExerciseCompleted() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../assets/success.png')} style={styles.image} />
        <Text style={styles.title}>🎉 {i18n.t('greatJob')}</Text>
        <Text style={styles.subtitle}>{i18n.t('exerciseCompletedMessage')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6f2ff',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#e6f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
