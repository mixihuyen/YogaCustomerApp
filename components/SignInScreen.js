import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { auth, firestore } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons"; // Thêm icon

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (userDoc.exists()) {
        Alert.alert("Success", "Signed in successfully!");
        navigation.navigate("Main");
      } else {
        Alert.alert("Error", "Profile not found. Please contact support.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#9ed9f6"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#9ed9f6"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SignUpScreen")}
        style={styles.signUpButton}
      >
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 100,
    marginBottom: 20,
    textAlign: "center",
    color: "#9ed9f6",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9ed9f6",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#007acc",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButton: {
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    color: "#9ed9f6",
    fontSize: 16,
  },
});

export default SignInScreen;
