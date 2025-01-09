import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBddTU3jXDTlAXdd2fI_QAAqktZPl9gOOo",
  authDomain: "courscework.firebaseapp.com",
  projectId: "courscework",
  storageBucket: "courscework.appspot.com",
  messagingSenderId: "328270878043",
  appId: "1:328270878043:web:51dd03ca2f9bf962eff67e",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Khởi tạo Auth với AsyncStorage để duy trì đăng nhập
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { firestore, auth };
