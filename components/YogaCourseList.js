import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { firestore, auth } from "../firebaseConfig";
import Ionicons from "react-native-vector-icons/Ionicons";
import { signOut } from "firebase/auth";

const YogaCourseList = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isModalVisible, setModalVisible] = useState(false); // Kiểm soát hiển thị popup
  const [loading, setLoading] = useState(true);

  const bannerImages = [
    require("../assets/banner01.png"),
    require("../assets/banner02.png"),
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesCollection = collection(firestore, "courses");
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesList = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
        setFilteredCourses(coursesList);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCourses();
  }, []);

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const applyFilter = () => {
    const filtered = courses.filter((course) => {
      const matchDays =
        selectedDays.length > 0
          ? selectedDays.some((day) => course.dayOfWeek.includes(day))
          : true;

      return matchDays;
    });

    if (filtered.length === 0) {
      Alert.alert("No Results", "No courses match the selected filters.");
    }
    setFilteredCourses(filtered);
    setModalVisible(false);
  };

  const clearFilter = () => {
    setSelectedDays([]);
    setSelectedTime("");
    setFilteredCourses(courses);
  };

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#4da6ff" />
          <Text>Loading, please wait...</Text>
        </View>
      ) : (
        <>
          {/* Banner */}
          <View style={styles.bannerWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.bannerContainer}
            >
              {bannerImages.map((image, index) => (
                <Image key={index} source={image} style={styles.banner} />
              ))}
            </ScrollView>
          </View>

          {/* Filter Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.iconTextContainer}>
                <Ionicons name="filter" size={24} color="#4da6ff" />
                <Text style={styles.iconText}>Filter</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Modal Popup for Selecting Days */}
          <Modal
            transparent
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Days of the Week</Text>

                <View style={styles.checkboxContainer}>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <View key={day} style={styles.checkboxWrapper}>
                      <Checkbox
                        status={
                          selectedDays.includes(day) ? "checked" : "unchecked"
                        }
                        onPress={() => toggleDaySelection(day)}
                      />
                      <Text style={styles.checkboxLabel}>{day}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearFilter}
                  >
                    <Text style={styles.outlineButtonText}>Clear Filter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={applyFilter}
                  >
                    <Text style={styles.buttonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Course List */}
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CourseDetail", { course: item })
                }
                style={{ flex: 1 }}
              >
                <View style={styles.card}>
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  <Text style={styles.type}>{item.type}</Text>
                  <Text style={styles.description} numberOfLines={3}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerWrapper: {
    height: Dimensions.get("window").width *0.4,
  },
  bannerContainer: {
    width: "100%",
    height: "100%",
  },
  banner: {
    width: Dimensions.get("window").width * 0.9,
    height: "100%",
    resizeMode: "cover",
    marginHorizontal: Dimensions.get("window").width * 0.05,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
  },

  iconButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },

  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    color: "#4da6ff",
    fontSize: 12,
    marginLeft: 5, // Thêm khoảng cách giữa icon và text
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  checkboxContainer: {
    marginVertical: 15,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#4da6ff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  clearButton: {
    backgroundColor: "transparent",
    borderColor: "#ff4d4d",
    borderRadius: 5,
    borderWidth: 2,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  outlineButtonText: {
    color: "#ff4d4d",
    fontWeight: "bold",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").width / 4,
    resizeMode: "cover",
  },
  type: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 10,
    color: "#666",
    textAlign: "start",
  },
});

export default YogaCourseList;
