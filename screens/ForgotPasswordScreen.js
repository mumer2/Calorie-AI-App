import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import i18n from "../utils/i18n";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isPhone = /^\d{10,15}$/.test(input);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const handleReset = async () => {
    const trimmed = input.trim();

    if (!trimmed) {
      Alert.alert(i18n.t("error"), i18n.t("enterEmailOrPhone"));
      return;
    }

    if (!isEmail && !isPhone) {
      Alert.alert(i18n.t("error"), i18n.t("validEmailOrPhone"));
      return;
    }

    const payload = isPhone
      ? { phone: trimmed }
      : { email: trimmed.toLowerCase() };

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-calorieai-app.netlify.app/.netlify/functions/requestReset",
        payload
      );

      if (response.data?.success && response.data?.token) {
        Alert.alert(i18n.t("codeSent"), i18n.t("checkInboxOrSms"));

        navigation.navigate("ResetPassword", {
          email: response.data.email || "",
          phone: response.data.phone || "",
          token: response.data.token,
        });
      } else {
        Alert.alert(
          i18n.t("error"),
          response.data?.message || i18n.t("sendCodeFailed")
        );
      }
    } catch (error) {
      console.error("Reset error:", error);
      Alert.alert(
        i18n.t("error"),
        error.response?.data?.message || i18n.t("serverError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔑 {i18n.t("forgotPasswordTitle")}</Text>

      <TextInput
        placeholder={i18n.t("enterEmailOrPhone")}
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="default"
        autoCapitalize="none"
        value={input}
        onChangeText={setInput}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#2c2c4e" />
        ) : (
          <Text style={styles.buttonText}>{i18n.t("sendResetCode")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Icon name="arrow-back" size={20} color="#555" />
          <Text style={[styles.link, { marginLeft: 6 }]}>{i18n.t("back")}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c2c4e",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#eee",
    color: "#000",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#f8e1c1",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c2c4e",
  },
  link: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
  },
});

// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

// export default function ForgotPasswordScreen({ navigation }) {
//     const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSendOTP = async () => {
//     if (!email) return Alert.alert('Email is required');
//     setLoading(true);

//     try {
//         const res = await fetch('https://backend-calorieai-app.netlify.app/.netlify/functions/send-otp', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email }),
//           });
    
//           const data = await res.json();
//           if (res.ok) {
//         Alert.alert('Success', 'OTP sent to your email');
//         navigation.navigate('ResetPassword', { email });
//       } else {
//         Alert.alert('Error', data.message || 'Could not send OTP');
//       }
//     } catch (e) {
//       Alert.alert('Error', 'Network error');
//     } finally {
//         setLoading(false);
//       }
//     };

//   return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Reset Password</Text>
//         <TextInput
//           placeholder="Enter your email"
//           style={styles.input}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
//         </TouchableOpacity>
//       </View>
//     );
//   }
  
//   const styles = StyleSheet.create({
//       container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#f0f8ff' },
//       title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0e4d92' },
//       input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 },
//       button: { backgroundColor: '#0e4d92', padding: 14, borderRadius: 10, alignItems: 'center' },
//       buttonText: { color: '#fff', fontSize: 16 },
// });