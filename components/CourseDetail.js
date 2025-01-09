import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { firestore } from "../firebaseConfig";

const CourseDetail = ({ route, navigation }) => {
  const { course } = route.params;
  const [classInstances, setClassInstances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassInstances = async () => {
      try {
        const classInstancesCollection = collection(
          firestore,
          `courses/${course.id}/class_instances`
        );
        const classInstancesSnapshot = await getDocs(classInstancesCollection);
        const classInstancesList = classInstancesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClassInstances(classInstancesList);
      } catch (error) {
        console.error("Error fetching class instances: ", error);
        Alert.alert("Error", "Could not fetch class instances.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassInstances();
  }, [course.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4da6ff" />
        <Text>Loading, please wait...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: course.imageUrl }} style={styles.image} />
        <Text style={styles.type}>{course.type}</Text>
        <Text style={styles.description}>{course.description}</Text>

        <View style={styles.detailsBox}>
          <Text style={styles.text}>Day of Week: {course.dayOfWeek}</Text>
          <Text style={styles.text}>Time: {course.time}</Text>
          <Text style={styles.text}>Capacity: {course.capacity} people</Text>
          <Text style={styles.text}>Duration: {course.duration} minutes</Text>
          <Text style={styles.text}>Price: £{course.price}</Text>
        </View>

        <Text style={styles.classInstances}>Class Instances Available:</Text>

        {classInstances.length === 0 ? (
          <Text style={styles.noClassesText}>No classes available</Text>
        ) : (
          <FlatList
            data={classInstances}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ClassDetail", {
                    classInstance: { ...item, price: course.price }, // Include course price here
                  })
                }
              >
                <View style={styles.classInstanceCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.instanceName}>
                      Class code: {item.name}
                    </Text>
                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#666"
                        style={styles.icon}
                      />
                      <Text style={styles.instanceDate}>
                        {" "}
                        Date: {item.date}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.instanceDetails}>
                    👤 Teacher: {item.teacher}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false} // FlatList will not scroll independently
          />
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  type: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  detailsBox: {
    backgroundColor: "#9ed9f6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  classInstances: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noClassesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
  classInstanceCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#9ed9f6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  instanceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  instanceDate: {
    fontSize: 14,
    color: "#666",
  },
  instanceDetails: {
    fontSize: 15,
    color: "#444",
    marginTop: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CourseDetail;
