import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationIcon({ count, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
      <Ionicons name="notifications-outline" size={28} color="black" />
      {count > 0 && (
        <View style={{
          position: 'absolute',
          right: 5,
          top: 5,
          backgroundColor: 'red',
          borderRadius: 10,
          width: 18,
          height: 18,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 10 }}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
