import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Hàm lưu giỏ hàng vào Firestore
  const saveCartToFirestore = async () => {
    if (userId && cartItems.length > 0) {
      // Chỉ lưu khi có dữ liệu trong cartItems
      try {
        const docRef = doc(firestore, "carts", userId);
        await setDoc(docRef, { cartItems });
        console.log("Cart saved to Firestore for user:", userId, cartItems);
      } catch (error) {
        console.log("Failed to save cart to Firestore:", error);
      }
    }
  };



  useEffect(() => {
    if (userId) {
      saveCartToFirestore(); // Lưu giỏ hàng mỗi khi cartItems hoặc userId thay đổi
    }
  }, [cartItems, userId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("User authenticated:", user.uid);
        await loadCartFromFirestore(user.uid); // Gọi hàm loadCartFromFirestore
      } else {
        console.log("User not authenticated.");
        setUserId(null);

      }
    });
    return () => unsubscribe();
  }, []);

  const loadCartFromFirestore = async (userId) => {
    if (!userId) return; // Nếu không có userId thì không tải

    try {
      const docRef = doc(firestore, "carts", userId);
      const docSnap = await getDoc(docRef);
      console.log("Attempting to load cart for user:", userId);

      if (docSnap.exists()) {
        const loadedCart = docSnap.data().cartItems || [];
        console.log("Loaded cart from Firestore for user:", userId, loadedCart);
        setCartItems(loadedCart);
      } else {
        console.log("No cart data found in Firestore for user:", userId);
        setCartItems([]); // Nếu không có dữ liệu thì đặt giỏ hàng trống
      }
    } catch (error) {
      console.log("Error loading cart from Firestore:", error);
    }
  };




  const resetCartInMemory = () => {
    setCartItems([]);
     console.log("Rest cart");
  };

  const addToCart = (newItem) => {
    setCartItems((prevCartItems) => {
      const existingItemIndex = prevCartItems.findIndex(
        (item) => item.id === newItem.id
      );
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCartItems];
        updatedCart[existingItemIndex].quantity += 1;
        console.log("Updated cart:", updatedCart);
        return updatedCart;
      } else {
        const updatedCart = [...prevCartItems, { ...newItem, quantity: 1 }];
        console.log("New item added to cart:", updatedCart);
        return updatedCart;
      }
    });
  };


  const increaseQuantity = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((item) =>
          item.id === itemId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== itemId)
    );
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        loadCartFromFirestore,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        calculateTotalPrice,
        resetCartInMemory,
        saveCartToFirestore,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
