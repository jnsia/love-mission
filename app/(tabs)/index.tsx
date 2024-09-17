import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useState } from "react";
import { user } from "@/types/user";
import useAuthStore from "@/stores/authStore";
import { mission } from "@/types/mission";
import theme from "@/constants/Theme";
import { useFocusEffect } from "expo-router";
import MissionInfoModal from "@/components/common/MissionInfoModal";

export default function HomeScreen() {
  const [missions, setMissions] = useState<mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<mission[]>([]);
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false);
  const [selctedMissionId, setSelctedMissionId] = useState(0);

  const user: user = useAuthStore((state: any) => state.user);
  const getRecentUserInfo = useAuthStore(
    (state: any) => state.getRecentUserInfo
  );

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false)
  }

  const clickMission = async (mission: mission) => {
    setSelctedMissionId(mission.id);
    setIsMissionInfoVisible(true);
  };

  const getMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("missions")
        .select()
        .eq("userId", user.id);

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

  useFocusEffect(
    useCallback(() => {
      getMissions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.guideBox}>
        <Text style={styles.guideText}>연인이 당신에게 할당한 미션입니다!</Text>
        <Text style={styles.guideText}>
          어서 미션을 완료하여 포인트를 획득하세요.
        </Text>
      </View>
      <ScrollView>
        <View>
          {/* <Text>결재 대기 중인 미션</Text> */}
          {completedMissions.map((mission) => (
            <View key={mission.id}>
              <TouchableOpacity
                style={mission.completed ? styles.completedItem : styles.item}
                onPress={() => clickMission(mission)}
              >
                <Text
                  style={
                    mission.completed
                      ? styles.completedItemText
                      : styles.itemText
                  }
                >
                  {mission.title} {mission.completed}
                </Text>
              </TouchableOpacity>
              {selctedMissionId == mission.id && (
                <MissionInfoModal
                  getMissions={getMissions}
                  isMissionInfoVisible={isMissionInfoVisible}
                  mission={mission}
                  closeMissionInfoModal={closeMissionInfoModal}
                />
              )}
            </View>
          ))}
        </View>
        <View>
          {/* <Text>남은 미션</Text> */}
          {missions.map((mission) => (
            <View key={mission.id}>
              <TouchableOpacity
                style={mission.completed ? styles.completedItem : styles.item}
                onPress={() => clickMission(mission)}
              >
                <Text
                  style={
                    mission.completed
                      ? styles.completedItemText
                      : styles.itemText
                  }
                >
                  {mission.title} {mission.completed}
                </Text>
              </TouchableOpacity>
              {selctedMissionId == mission.id && (
                <MissionInfoModal
                  getMissions={getMissions}
                  isMissionInfoVisible={isMissionInfoVisible}
                  mission={mission}
                  closeMissionInfoModal={closeMissionInfoModal}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
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
  guideBox: {
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.button,
    marginBottom: 16,
  },
  guideText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  item: {
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
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
  completedItemText: {
    fontSize: 16,
    color: "white",
  },
});
