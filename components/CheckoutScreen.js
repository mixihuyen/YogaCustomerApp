import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useCart } from "../context/CartContext";
import { firestore, auth } from "../firebaseConfig";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, calculateTotalPrice, resetCartInMemory } = useCart();
  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: `${data.firstName || ""} ${data.lastName || ""}`,
            phoneNumber: data.phoneNumber || "",
            email: data.email || user.email,
          });
        } else {
          console.log("No user profile found.");
        }
      } catch (error) {
        console.error("Error loading user data:", error.message);
        Alert.alert("Error", "Could not load user data.");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchUserData(user);
      } else {
        setIsAuthenticated(false);
        setUserData({ name: "", phoneNumber: "", email: "" });
        Alert.alert("Error", "User is not logged in.");
        navigation.navigate("Login");
      }
    });

    return () => unsubscribe();
  }, []);

  const saveCartToFirestore = async (cart) => {
    const userId = auth.currentUser.uid;
    try {
      const docRef = doc(firestore, "carts", userId);
      await setDoc(docRef, { cartItems: cart });
      console.log("Cart saved to Firestore for user:", userId);
    } catch (error) {
      console.error("Error saving cart to Firestore:", error);
      Alert.alert("Error", "Could not save cart to database.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!userData.name || !userData.phoneNumber || !userData.email) {
      Alert.alert("Incomplete Information", "Please fill out all fields.");
      return;
    }

    try {
      // Lưu đơn hàng vào Firestore
      await addDoc(collection(firestore, "orders"), {
        userId: auth.currentUser.uid,
        userData,
        cartItems,
        totalPrice: calculateTotalPrice(),
        orderDate: new Date(),
      });

      Alert.alert("Order Success", "Your order has been placed successfully!");

      // Xóa giỏ hàng sau khi đặt hàng thành công
      await saveCartToFirestore([]); // Gọi hàm lưu giỏ hàng với mảng trống để xóa
      resetCartInMemory();
      navigation.navigate("Orders"); // Chuyển hướng đến OrdersScreen
    } catch (error) {
      Alert.alert("Order Failed", "Could not place order: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>User Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={userData.phoneNumber}
        onChangeText={(text) => setUserData({ ...userData, phoneNumber: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
      />
      <Text style={styles.sectionTitle}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>
              {item.name} x {item.quantity}
            </Text>
            <Text>£{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        )}
      />
      <Text style={styles.totalText}>
        Total: £{calculateTotalPrice().toFixed(2)}
      </Text>
      <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  orderButton: {
    backgroundColor: "#4da6ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
