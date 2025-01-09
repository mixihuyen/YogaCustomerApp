import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native"; // Importing useNavigation

const CartScreen = () => {
  const {
    cartItems,
    removeFromCart,
    calculateTotalPrice,
    increaseQuantity,
    decreaseQuantity,
    loading,
  } = useCart();

  const navigation = useNavigation(); // Initialize navigation
if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4da6ff" />
      <Text>Loading, please wait...</Text>
    </View>
  );
}
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    Alert.alert("Item removed", "The item has been removed from your cart.");
  };

  const handleCheckout = () => {
    const totalPrice = calculateTotalPrice();
    if (cartItems.length === 0) {
      Alert.alert(
        "Cart is empty",
        "Add items to the cart before checking out."
      );
      return;
    }

    Alert.alert(
      "Checkout",
      `Your total is £${totalPrice.toFixed(2)}. Proceeding to checkout...`
    );
    navigation.navigate("Checkout");
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCart}>Your cart is empty</Text>
          <Text style={styles.emptyCartMessage}>Add items to your cart!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemDetails}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>
                        Class code: {item.name}
                      </Text>
                      <Text style={styles.teacherText}>
                        Teacher: {item.teacher}
                      </Text>
                      <Text style={styles.dateText}>Date: {item.date}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      style={styles.iconButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={24}
                        color="#ff4d4d"
                      />
                    </TouchableOpacity>
                  </View>
                  {/* Quantity and Price in the same row */}
                  <View style={styles.quantityAndPriceContainer}>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Quantity: </Text>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(item.id)}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="remove-circle-outline"
                          size={24}
                          color="#4da6ff"
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => increaseQuantity(item.id)}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={24}
                          color="#4da6ff"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemPrice}>
                      £{((item.price ?? 0) * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: £{calculateTotalPrice().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 20,
    backgroundColor: "#fff",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCart: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  emptyCartMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  emptyCart: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#9ed9f6",
  },
  itemDetails: {
    flexDirection: "row", // Đặt chế độ hiển thị theo hàng
    justifyContent: "space-between", // Đặt khoảng cách giữa các mục
    alignItems: "center", // Căn giữa theo chiều dọc
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  teacherText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  quantityAndPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#555",
    marginRight: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4da6ff",
  },
  totalContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: "#9ed9f6",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007acc",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 4,
  },
});

export default CartScreen;
