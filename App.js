import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import YogaCourseList from "./components/YogaCourseList";
import CourseDetail from "./components/CourseDetail";
import ProfileScreen from "./components/ProfileScreen";
import SignInScreen from "./components/SignInScreen";
import SignUpScreen from "./components/SignUpScreen";
import CartScreen from "./components/CartScreen";
import ClassDetail from "./components/ClassDetail";
import { CartProvider } from "./context/CartContext";
import CheckoutScreen from "./components/CheckoutScreen";
import OrdersScreen from "./components/OrdersScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "YogaCourses") {
            iconName = "list";
          } else if (route.name === "Cart") {
            iconName = "cart";
          } else if (route.name === "Orders") {
            iconName = "clipboard";
          } else if (route.name === "ProfileScreen") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4da6ff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="YogaCourses"
        component={YogaCourseList}
        options={{ title: "Courses" }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Cart" }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Orders" }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated via Firebase");
        setInitialRoute("Main"); // Đặt trang chính nếu đã đăng nhập
      } else {
        console.log("No user found, navigating to Login");
        setInitialRoute("SignInScreen"); // Đặt trang đăng nhập nếu chưa đăng nhập
      }
      setIsAuthChecked(true); // Đánh dấu đã kiểm tra trạng thái xác thực
    });

    return () => unsubscribe(); // Hủy listener khi component bị unmount
  }, []);

  if (!isAuthChecked || initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4da6ff" />
        <Text>Loading, please wait...</Text>
      </View>
    );
  }

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{ title: "Sign In" }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ title: "Sign Up" }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClassDetail"
            component={ClassDetail}
            options={{ title: "Class Detail" }}
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetail}
            options={{ title: "Course Detail" }}
          />
          <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={{ title: "CartScreen" }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: "Checkout" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

export default App;
