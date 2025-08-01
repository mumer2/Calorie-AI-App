import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { Asset } from 'expo-asset';
import i18n from '../utils/i18n'; // ✅ Add i18n

const rawExercises = [
  {
    key: 'jumpingJacks',
    file: require('../assets/videos/JumpingJacks.mp4'),
    duration: '20 sec',
  },
  {
    key: 'abdominalCrunches',
    file: require('../assets/videos/AbdominalCrunches.mp4'),
    duration: '12 reps',
  },
  {
    key: 'russianTwists',
    file: require('../assets/videos/RussianTwist.mp4'),
    duration: '20 reps',
  },
  {
    key: 'mountainClimbers',
    file: require('../assets/videos/MountainClimber.mp4'),
    duration: '20 reps',
  },
  {
    key: 'heelTouches',
    file: require('../assets/videos/HeelTouch.mp4'),
    duration: '20 reps',
  },
  {
    key: 'legRaises',
    file: require('../assets/videos/LegRaises.mp4'),
    duration: '18 reps',
  },
  {
    key: 'plank',
    file: require('../assets/videos/Plank.mp4'),
    duration: '20 sec',
  },
  {
    key: 'pushUps',
    file: require('../assets/videos/PushUps.mp4'),
    duration: '12 reps',
  },
  {
    key: 'wideArmPushUps',
    file: require('../assets/videos/WideArmPushUps.mp4'),
    duration: '12 reps',
  },
  {
    key: 'cobraStretch',
    file: require('../assets/videos/CobraStretch.mp4'),
    duration: '20 sec',
  },
];

export default function ExerciseScreen() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loaded = await Promise.all(
        rawExercises.map(async (ex) => {
          const asset = Asset.fromModule(ex.file);
          await asset.downloadAsync();
          return {
            ...ex,
            name: i18n.t(ex.key),
            uri: asset.localUri,
          };
        })
      );
      setExercises(loaded);
      setLoading(false);
    })();
  }, []);

  return (
    <ScrollView style={styles.container} edges={['left','right','bottom']}>
      <Text style={styles.title}>🏋️{i18n.t('dailyWorkout')}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0e4d92" style={{ marginTop: 40 }} />
      ) : (
        exercises.map((exercise, idx) => (
          <View key={idx} style={styles.card}>
            <Video
              source={{ uri: exercise.uri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.video}
            />
            <View style={styles.textBox}>
              <Text style={styles.name}>{exercise.name}</Text>
              <Text style={styles.duration}>⏱ {exercise.duration}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 12,
  },
  textBox: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
