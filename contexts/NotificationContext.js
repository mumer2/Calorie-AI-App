import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCountState] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const stored = await AsyncStorage.getItem('unreadCount');
      if (stored !== null) {
        setUnreadCountState(parseInt(stored, 10));
      }
    };
    loadUnreadCount();
  }, []);

  const updateUnreadCount = async (count) => {
    setUnreadCountState(count);
    await AsyncStorage.setItem('unreadCount', count.toString());
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount: updateUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
