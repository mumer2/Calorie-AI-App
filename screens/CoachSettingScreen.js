import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import i18n from "../utils/i18n";
import { LanguageContext } from "../contexts/LanguageContext";

export default function CoachSettingScreen({ navigation }) {
  const [name, setName] = useState("");
  const [profileUri, setProfileUri] = useState("");
  const [activeTab, setActiveTab] = useState("menu");
  const { language, changeLanguage } = useContext(LanguageContext);

  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const id = await AsyncStorage.getItem("userId");
      const role = await AsyncStorage.getItem("userRole");
      if (!id || !role) return;

      setUserId(id);
      setUserRole(role);

      const nameKey = `name_${role}_${id}`;
      const storedName = await AsyncStorage.getItem(nameKey);
      const storedImage = await AsyncStorage.getItem(`profile_${role}_${id}`);

      if (!storedName) {
        const defaultName = role === "coach" ? "Coach" : "User";
        await AsyncStorage.setItem(nameKey, defaultName);
        setName(defaultName);
      } else {
        setName(storedName);
      }

      if (storedImage) setProfileUri(storedImage);
    };

    loadData();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("❌", i18n.t("nameEmpty"));
      return;
    }

    if (userId && userRole) {
      await AsyncStorage.setItem(`name_${userRole}_${userId}`, name.trim());
      Alert.alert("✅", i18n.t("nameUpdated"));
    }
  };

  const pickImage = async () => {
    if (!userId || !userRole) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileUri(uri);
      await AsyncStorage.setItem(`profile_${userRole}_${userId}`, uri);
    }
  };

  const handleLanguageChange = async (lang) => {
    await changeLanguage(lang);
    Alert.alert(
      "✅",
      `${i18n.t("languageChanged")} ${lang === "en" ? "English" : "中文"}`
    );
 const token = await AsyncStorage.getItem("authToken");

  if (token) {
    navigation.reset({
      index: 0,
      routes: [{ name: "RoleRedirect" }],
    });
  } else {
    navigation.navigate("Login");
  }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "RoleRedirect" }],
    // });
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t("logout"),
      i18n.t("confirmLogout"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("logout"),
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "authToken",
                "userId",
                "userRole",
              ]);
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              Alert.alert("Logout Error", "Something went wrong.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("settings")}</Text>

      {activeTab === "menu" && (
        <View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setActiveTab("profile")}
          >
            <Text style={styles.menuText}>👤 {i18n.t("profile")}</Text>
          </TouchableOpacity>

          <View style={styles.languageContainer}>
            <Text style={styles.subTitle}>🌐 {i18n.t("language")}</Text>

            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === "en" && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageChange("en")}
              >
                <Text
                  style={[
                    styles.langText,
                    language === "en" && styles.langTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === "zh" && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageChange("zh")}
              >
                <Text
                  style={[
                    styles.langText,
                    language === "zh" && styles.langTextActive,
                  ]}
                >
                  中文
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {activeTab === "profile" && (
        <View style={styles.profileCard}>
          <Text style={styles.subTitle}>{i18n.t("editProfile")}</Text>

          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={
                profileUri
                  ? { uri: profileUri }
                  : { uri: "https://www.w3schools.com/howto/img_avatar.png" }
              }
              style={styles.image}
            />
            <Text style={styles.changePhotoText}>{i18n.t("changePhoto")}</Text>
          </TouchableOpacity>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={i18n.t("enterName")}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>{i18n.t("save")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("menu")}
            style={styles.backButton}
          >
            <Text style={styles.backText}>{i18n.t("back")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate("PrivacyPolicy")}
      >
        <Text style={styles.menuText}>🔒 {i18n.t("privacyPolicy")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate("AppInstructions")}
      >
        <Text style={styles.menuText}>📘 {i18n.t("usageInstructions")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
        <Text style={styles.menuText}>🚪 {i18n.t("logout")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f4faff" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#0e4d92",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0e4d92",
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  menuText: {
    fontSize: 16,
    color: "#0e4d92",
    fontWeight: "600",
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#0e4d92",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  backText: {
    color: "#0e4d92",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 14,
    color: "#0e4d92",
    textDecorationLine: "underline",
  },
  languageContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  langButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  langButtonActive: {
    backgroundColor: "#0e4d92",
  },
  langText: {
    color: "#0e4d92",
    fontWeight: "600",
  },
  langTextActive: {
    color: "#fff",
  },
});
