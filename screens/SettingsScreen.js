import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../utils/i18n';
import { LanguageContext } from '../contexts/LanguageContext';

export default function SettingsScreen({ navigation }) {
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const { language, changeLanguage } = useContext(LanguageContext); // 🌐 Language context

  useEffect(() => {
    AsyncStorage.getItem('userName').then((storedName) => {
      if (storedName) setName(storedName);
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('❌', i18n.t('nameEmpty'));
      return;
    }

    await AsyncStorage.setItem('userName', name.trim());
    Alert.alert('✅', i18n.t('nameUpdated'));
  };

  const handleLanguageChange = async (lang) => {
    await changeLanguage(lang);
    Alert.alert('✅', `${i18n.t('languageChanged')} ${lang === 'en' ? 'English' : '中文'}`);
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t('logout'),
      i18n.t('confirmLogout'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'authToken',
                'userRole',
                'userName',
                'appLanguage',
              ]);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Logout Error', 'Something went wrong.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('settings')}</Text>

      {activeTab === 'menu' && (
        <View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.menuText}>👤 {i18n.t('profile')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleLogout}
          >
            <Text style={styles.menuText}>🚪 {i18n.t('logout')}</Text>
          </TouchableOpacity>

          <View style={styles.languageContainer}>
            <Text style={styles.subTitle}>🌐 {i18n.t('language')}</Text>

            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === 'en' && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'en' && styles.langTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === 'zh' && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageChange('zh')}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'zh' && styles.langTextActive,
                  ]}
                >
                  中文
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'profile' && (
        <View style={styles.profileCard}>
          <Text style={styles.subTitle}>{i18n.t('editProfile')}</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={i18n.t('enterName')}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>{i18n.t('save')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('menu')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>{i18n.t('back')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4faff' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#0e4d92',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    color: '#0e4d92',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  backText: {
    color: '#0e4d92',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  languageContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  langButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  langButtonActive: {
    backgroundColor: '#0e4d92',
  },
  langText: {
    color: '#0e4d92',
    fontWeight: '600',
  },
  langTextActive: {
    color: '#fff',
  },
});
