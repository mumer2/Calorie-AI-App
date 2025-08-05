import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import i18n from '../utils/i18n';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{i18n.t('privacyPolicy')}</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        This Privacy Policy explains how we collect, use, and protect your personal data when you use our application. By using our app, you agree to the terms of this policy.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We may collect the following types of information:
        {"\n"}• Name, email, and contact details
        {"\n"}• Profile image and preferences
        {"\n"}• Fitness data and health-related information
        {"\n"}• Device and usage data (e.g., app activity, crash logs)
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        The data we collect is used to:
        {"\n"}• Provide and personalize app services
        {"\n"}• Improve user experience and app performance
        {"\n"}• Send reminders, notifications, and updates
        {"\n"}• Analyze trends and statistics (anonymously)
      </Text>

      <Text style={styles.sectionTitle}>4. Data Sharing</Text>
      <Text style={styles.paragraph}>
        We do not sell, trade, or rent your personal data. We may share information with:
        {"\n"}• Service providers assisting with app functionality
        {"\n"}• Legal authorities if required by law
      </Text>

      <Text style={styles.sectionTitle}>5. Data Security</Text>
      <Text style={styles.paragraph}>
        We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Rights</Text>
      <Text style={styles.paragraph}>
        You have the right to:
        {"\n"}• Access or update your personal data
        {"\n"}• Request data deletion
        {"\n"}• Withdraw consent at any time
      </Text>

      <Text style={styles.sectionTitle}>7. Data Retention</Text>
      <Text style={styles.paragraph}>
        We retain your data as long as your account is active or as needed to provide you with our services.
      </Text>

      <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
      <Text style={styles.paragraph}>
        We may update this Privacy Policy from time to time. Changes will be notified via app or email.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions or concerns about this Privacy Policy, please contact us at:
        {"\n"}support@calorieai.app
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7fbff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#0e4d92',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10,
    color: '#333',
  },
});
