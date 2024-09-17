import MissionInfoModal from "@/components/common/MissionInfoModal";
import MissionInput from "@/components/common/MissionInput";
import RegistButton from "@/components/common/RegistButton";
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
} from "react-native";

export default function LoveScreen() {
  const [missions, setMissions] = useState<mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<mission[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false);
  const [selctedMissionId, setSelctedMissionId] = useState(0);

  const user: user = useAuthStore((state: any) => state.user);

  const getMissions = async () => {
    const { data, error } = await supabase
      .from("missions")
      .select()
      .eq("userId", user.loveId);

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
  };

  const clickMission = (mission: mission) => {
    setSelctedMissionId(mission.id);
    setIsMissionInfoVisible(true);
  };

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false);
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
        {completedMissions.map((mission: mission) => (
          <View key={mission.id}>
            <TouchableOpacity
              style={styles.completedItem}
              onPress={() => clickMission(mission)}
            >
              <Text style={styles.completedItemText}>{mission.title}</Text>
            </TouchableOpacity>
            {selctedMissionId == mission.id && (
              <MissionInfoModal
                getMissions={getMissions}
                closeMissionInfoModal={closeMissionInfoModal}
                isMissionInfoVisible={isMissionInfoVisible}
                mission={mission}
              />
            )}
          </View>
        ))}
        {missions.map((mission) => (
          <View key={mission.id}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => clickMission(mission)}
            >
              <Text style={styles.itemText}>{mission.title}</Text>
            </TouchableOpacity>
            {selctedMissionId == mission.id && (
              <MissionInfoModal
                getMissions={getMissions}
                closeMissionInfoModal={closeMissionInfoModal}
                isMissionInfoVisible={isMissionInfoVisible}
                mission={mission}
              />
            )}
          </View>
        ))}
      </ScrollView>
      <MissionRegistModal
        getMissions={getMissions}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <RegistButton text="미션 등록하기" onPressEvent={openModal} />
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
