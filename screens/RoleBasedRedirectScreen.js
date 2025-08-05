// screens/RoleBasedRedirectScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoleBasedRedirectScreen({ navigation }) {
  useEffect(() => {
    const redirect = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role === 'coach') {
        navigation.reset({ index: 0, routes: [{ name: 'CoachHome' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      }
    };
    redirect();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0e4d92" />
    </View>
  );
}
