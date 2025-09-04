# YogaCustomerApp 🧘‍♀️

![YogaCustomerApp Banner](https://github.com/mixihuyen/YogaCustomerApp/blob/master/IMG_8402.PNG)  
*A mobile app for booking yoga classes with ease and convenience.*

---

## 📖 Overview
**YogaCustomerApp** is a mobile application developed from August 2024 to November 2024 to simplify the process of finding and booking yoga classes. The app enhances user experience by providing a seamless interface and cloud-based data synchronization using Firebase.

**GitHub Repository**: [https://github.com/mixihuyen/YogaCustomerApp](https://github.com/mixihuyen/YogaCustomerApp)

---

## ✨ Features
- **Find a Class**: Search yoga classes by teacher, date, or day of the week.
- **Cloud Sync**: Real-time data retrieval and synchronization with Firebase.
- **Book a Yoga Class**: Book classes, check availability, and filter by date or time.
- **Account Management**: Create accounts, manage shopping carts, and store user data securely in Firebase.

---

## 🛠 Technologies Used
- **React Native** ![React Native](https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=white): Cross-platform mobile app framework.
- **Expo SDK 53** ![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white): Simplified development and deployment.
- **Firebase** ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black): Authentication, real-time database, and cloud storage.
- **React Navigation**: Smooth navigation between screens.
- **React Native Paper**: Modern and consistent UI components.
- **@react-native-community/datetimepicker**: Date and time selection.
- **Tailwind CSS (NativeWind)**: Utility-first styling for enhanced UI (optional).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or Yarn
- Expo CLI
- Firebase account
- Android/iOS emulator or physical device

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/mixihuyen/YogaCustomerApp.git
   cd YogaCustomerApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   For dependency conflicts:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add an Android app and download `google-services.json`.
   - Place `google-services.json` in the `android/` directory.
   - Update Firebase configuration in the app (e.g., `src/config/firebase.js`).

4. **Run the app**:
   ```bash
   npx expo start
   ```
   - Scan the QR code with **Expo Go** on your device.
   - Or run on an emulator:
     ```bash
     npx expo start --android
     ```

5. **Build APK**:
   - Install EAS CLI:
     ```bash
     npm install -g eas-cli
     ```
   - Log in to Expo:
     ```bash
     eas login
     ```
   - Build the APK:
     ```bash
     npx eas-cli build --platform android --profile development
     ```
   - Download the APK from the provided URL.

---

## 📱 Deployment
- **Mobile (APK)**: Built using EAS Build for Android.
- **Web (Optional)**:
  1. Enable web support:
     ```bash
     flutter config --enable-web
     ```
  2. Build web version:
     ```bash
     flutter build web --release
     ```
  3. Deploy to Firebase Hosting:
     ```bash
     firebase init hosting
     firebase deploy
     ```

---

## 🛑 Challenges and Solutions
- **Dependency Conflicts**: Resolved `ERESOLVE` errors by updating `package.json` and using `--legacy-peer-deps`.
- **Permission Issues**: Fixed `EACCES` errors with `sudo` or changing `node_modules` ownership.
- **Build Configuration**: Added `expo-dev-client` and configured `eas.json` for development builds.

---

## 🔮 Future Improvements
- Support iOS builds with EAS.
- Enhance UI with Tailwind CSS (NativeWind).
- Add push notifications for booking confirmations.
- Optimize Firebase queries for faster performance.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact
For questions or feedback, reach out at [lehuyen23vn@gmail.com](mailto:lehuyen23vn@gmail.com).
