import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { auth, firestore } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const { resetCartInMemory } = useCart();

  useEffect(() => {
    // Theo dõi trạng thái đăng nhập của người dùng
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Tải dữ liệu hồ sơ người dùng khi đăng nhập thành công
        const loadUserProfile = async () => {
          try {
            const userDoc = await getDoc(doc(firestore, "users", user.uid));
            if (userDoc.exists()) {
              setUserData(userDoc.data());
            } else {
              console.log("No profile data found for user:", user.uid);
            }
          } catch (error) {
            console.error("Error loading user profile:", error);
          }
        };
        loadUserProfile();
      } else {
        // Điều hướng về trang đăng nhập khi không có người dùng
        console.log("No authenticated user found, navigating to Login.");
        navigation.reset({ index: 0, routes: [{ name: "SignInScreen" }] });
      }
    });

    // Hủy đăng ký listener khi component bị unmount
    return () => unsubscribe();
  }, [navigation]);

  const handleSignOut = async () => {
    try {
      resetCartInMemory(); // Clear cart data when user signs out
      await signOut(auth);
      Alert.alert("Signed Out", "You have been signed out successfully.");
      navigation.reset({ index: 0, routes: [{ name: "SignInScreen" }] });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4da6ff" />
        <Text>Loading, please wait...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name="person-circle-outline"
        size={100}
        color="#9ed9f6"
        style={styles.icon}
      />
      <Text style={styles.headerText}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>First Name:</Text>
        <Text style={styles.value}>{userData.firstName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.value}>{userData.lastName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{userData.phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  icon: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9ed9f6",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 10,
    width: "95%",
    backgroundColor: "#ffffff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#9ed9f6",
    borderRadius: 12,
    padding: 15,
  },
  label: {
    fontSize: 16,
    color: "#4da6ff",
    fontWeight: "bold",
  },
  value: {
    fontSize: 15,
    color: "#333",
    marginTop: 5,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fe6666",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    width: "60%",
    justifyContent: "center",
  },
  signOutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
});

export default ProfileScreen;
