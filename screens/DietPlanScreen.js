import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import i18n from '../utils/i18n'; // ✅ Import i18n

export default function DietPlanScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const checkSubscription = async () => {
        const subscribed = await AsyncStorage.getItem('isSubscribed');
        if (subscribed !== 'true') {
          navigation.navigate('Subscribe');
        } else {
          setLoading(false);
        }
      };
      checkSubscription();
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const meals = [
    {
      title: i18n.t('breakfast'),
      image: require('../assets/BreakFast.jpeg'),
      items: [
        i18n.t('oatsMilkFruits'),
        i18n.t('boiledEggsToast'),
        i18n.t('greekYogurtNuts'),
      ],
    },
    {
      title: i18n.t('lunch'),
      image: require('../assets/Lunch.jpeg'),
      items: [
        i18n.t('grilledChickenRiceVeggies'),
        i18n.t('dalRotiSalad'),
        i18n.t('quinoaChickpeas'),
      ],
    },
    {
      title: i18n.t('dinner'),
      image: require('../assets/Dinner.jpeg'),
      items: [
        i18n.t('stirFriedTofuRice'),
        i18n.t('paneerSaladBowl'),
        i18n.t('soupWholeGrainBread'),
      ],
    },
    {
      title: i18n.t('snacks'),
      image: require('../assets/Snacks.jpeg'),
      items: [
        i18n.t('fruitSmoothie'),
        i18n.t('nutsDryFruits'),
        i18n.t('boiledCornSprouts'),
      ],
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0e4d92" />
        <Text style={{ marginTop: 10, color: '#444' }}>
          {i18n.t('checkingSubscription')}
        </Text>
      </View>
    );
  }

  return (
    <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>{i18n.t('recommendedDietPlan')}</Text>
      {meals.map((meal, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.mealRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{meal.title}</Text>
              {meal.items.map((item, idx) => (
                <Text key={idx} style={styles.item}>• {item}</Text>
              ))}
            </View>
            <Image source={meal.image} style={styles.mealImage} />
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },
  item: {
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },
  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft: 12,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
