import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { auth, firestore } from "../firebaseConfig"; // Đảm bảo import Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import Ionicons from "react-native-vector-icons/Ionicons"; // Thêm icon

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSignUp = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Lưu thông tin người dùng vào Firestore
      await setDoc(doc(firestore, "users", userId), {
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("SignInScreen");
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "The email is already in use. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#9ed9f6"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#9ed9f6"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

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

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#9ed9f6"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="call-outline"
          size={20}
          color="#9ed9f6"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SignInScreen")}
        style={styles.signInButton}
      >
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#f0f4f7",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
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
  signInButton: {
    marginTop: 20,
    alignItems: "center",
  },
  signInText: {
    color: "#9ed9f6",
    fontSize: 16,
  },
});

export default SignUpScreen;
