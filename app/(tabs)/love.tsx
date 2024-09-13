import MissionInput from "@/components/common/MissionInput";
import MissionRegistButton from "@/components/common/MissionRegistButton";
import MissionRegistModal from "@/components/common/MissionRegistModal";
import SubmitButton from "@/components/common/SubmitButton";
import theme from "@/constants/Theme";
import useAuthStore from "@/stores/authStore";
import { mission } from "@/types/mission";
import { user } from "@/types/user";
import { supabase } from "@/utils/supabase";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

export default function LoveScreen() {
  const [completedMissions, setCompletedMissions] = useState<mission[]>([]);
  const [missions, setMissions] = useState<mission[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const user: user = useAuthStore((state: any) => state.user);

  const getMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.love_id);

      if (error) {
        console.error("Error fetching missions:", error.message);
        return;
      }

      const missions: mission[] = [];
      const completedMissions: mission[] = [];

      data.forEach((mission: mission) => {
        if (mission.completed) {
          completedMissions.push(mission);
        } else {
          missions.push(mission);
        }
      });

      setMissions(missions);
      setCompletedMissions(completedMissions);
    } catch (error: any) {
      console.error("Error fetching missions:", error.message);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      getMissions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {completedMissions.map((mission) => (
          <TouchableOpacity key={mission.id} style={styles.item}>
            <Text style={styles.itemText} key={mission.id}>
              {mission.title} {mission.completed}
            </Text>
          </TouchableOpacity>
        ))}
        {missions.map((mission) => (
          <TouchableOpacity key={mission.id} style={styles.item}>
            <Text style={styles.itemText} key={mission.id}>
              {mission.title} {mission.completed}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <MissionRegistModal
        getMissions={getMissions}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <MissionRegistButton text="미션 등록하기" onPressEvent={openModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF6347",
  },
  item: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.button,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  completedItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "green",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  warningItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "red",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  completedItemText: {
    fontSize: 16,
    color: "white",
  },
  modalView: {
    flex: 1,
    marginTop: 80,
    marginBottom: 80,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextStyle: {
    color: "#17191c",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
  },
});
