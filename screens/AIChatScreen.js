import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../contexts/LanguageContext';
import i18n from '../utils/i18n';

const CHAT_STORAGE_KEY = '@chat_messages';

export default function AIChatScreen() {
  const { language } = useContext(LanguageContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Load stored chat
  useEffect(() => {
    const loadChat = async () => {
      const saved = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    };
    loadChat();
  }, []);

  // Save chat on update
  useEffect(() => {
    AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        'https://backend-calorieai-app.netlify.app/.netlify/functions/openai',
        { question: input, lang: language }, // include language
        { headers: { 'Content-Type': 'application/json' } }
      );

      const aiMessage = { role: 'assistant', content: res.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('❌ Chat API error:', err.message);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: i18n.t('errorFetch') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={60}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false} // hides scroll line
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 0 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.role === 'user' ? styles.userMsg : styles.aiMsg,
              ]}
            >
              <Text style={styles.sender}>
                {item.role === 'user' ? i18n.t('you') : i18n.t('coachbot')}
              </Text>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {loading && (
          <View style={styles.typingWrapper}>
            <ActivityIndicator size="small" color="#555" />
            <Text style={styles.typingText}>{i18n.t('thinking')}</Text>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={i18n.t('askPlaceholder')}
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>{i18n.t('send')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 0,
    paddingTop: 0, // removes top margin
    backgroundColor: '#fff',
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    elevation: 2,
  },
  userMsg: {
    backgroundColor: '#daf0ff',
    alignSelf: 'flex-end',
  },
  aiMsg: {
    backgroundColor: '#eeeeee',
    alignSelf: 'flex-start',
  },
  sender: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    color: '#222',
  },
  typingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 90,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#eee',
    zIndex: 2,
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
