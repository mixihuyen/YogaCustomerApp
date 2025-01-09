import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../context/CartContext"; // Import useCart

const ClassDetail = ({ route }) => {
  const { classInstance } = route.params;
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập một thời gian tải (có thể thay đổi để tải dữ liệu thực tế nếu cần)
    const timer = setTimeout(() => {
      setLoading(false); // Thay đổi trạng thái loading sau 1 giây
    }, 1000);

    return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  }, []);

  const handleAddToCart = () => {
    addToCart(classInstance);
    Alert.alert(
      "Added to Cart",
      `You have added ${classInstance.name} to the cart.`
    );
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4da6ff" />
        <Text>Loading, please wait...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Ionicons name="bookmark-outline" size={24} color="#9ed9f6" />
        <View style={styles.textContainer}>
          <Text style={styles.infoLabel}>Class Code</Text>
          <Text style={styles.infoText}>{classInstance.name}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="calendar-outline" size={24} color="#9ed9f6" />
        <View style={styles.textContainer}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoText}>{classInstance.date}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="person-outline" size={24} color="#9ed9f6" />
        <View style={styles.textContainer}>
          <Text style={styles.infoLabel}>Teacher</Text>
          <Text style={styles.infoText}>{classInstance.teacher}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color="#9ed9f6"
        />
        <View style={styles.textContainer}>
          <Text style={styles.infoLabel}>Comments</Text>
          <Text style={styles.infoText}>
            {classInstance.comments || "No comments available."}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Ionicons
          name="cart-outline"
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
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
  textContainer: {
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: "#4da6ff",
    fontWeight: "bold",
    marginRight: 26,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    marginTop: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
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
    marginLeft: 10,
  },
});

export default ClassDetail;
