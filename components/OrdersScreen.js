import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { firestore, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const ordersRef = collection(firestore, "orders");
      // Sắp xếp theo `orderDate` giảm dần để đơn hàng mới nhất lên đầu
      const q = query(
        ordersRef,
        where("userId", "==", user.uid),
        orderBy("orderDate", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
        setLoading(false);
      });

      // Hủy listener khi component bị unmount
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

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
      {orders.length === 0 ? (
        <View style={styles.emptyOrdersContainer}>
          <Ionicons name="clipboard-outline" size={80} color="#ccc" />
          <Text style={styles.noOrdersText}>No orders found.</Text>
          <Text style={styles.noOrdersMessage}>Make your first order!</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>Order ID: {item.id}</Text>
              <Text style={styles.orderDate}>
                Order Date: {item.orderDate.toDate().toLocaleString()}
              </Text>
              <View style={styles.itemsContainer}>
                {item.cartItems.map((cartItem, index) => (
                  <View key={index} style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>Class: {cartItem.name}</Text>
                    <Text style={styles.itemText}>
                      Teacher: {cartItem.teacher}
                    </Text>
                    <Text style={styles.itemText}>Date: {cartItem.date}</Text>
                    <Text style={styles.itemText}>
                      Price: £{(cartItem.price * cartItem.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.totalPrice}>
                Total: £{item.totalPrice.toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 15,
  },
  noOrdersText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  noOrdersMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  emptyOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#9ed9f6",
    borderRadius: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4da6ff",
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  itemDetails: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#e8f7ff",
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemText: {
    fontSize: 14,
    color: "#555",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4da6ff",
    textAlign: "right",
    marginTop: 10,
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
