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

export default function HomeScreen() {
  const [missions, setMissions] = useState<mission[]>([]);

  const user: user = useAuthStore((state: any) => state.user);
  const getRecentUserInfo = useAuthStore(
    (state: any) => state.getRecentUserInfo
  );

  const doneMission = async (mission: mission) => {
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset).toISOString().substring(0, 10);

    const { error } = await supabase.from("histories").insert({
      date: today,
      point: 100,
      record: `${mission.title} 미션 성공`,
      user_id: user.id,
    });

    if (error) {
      console.error(error);
      return;
    }

    await supabase.from("missions").delete().eq("id", mission.id);
    await supabase
      .from("users")
      .update({ point: user.point + 100 })
      .eq("id", user.id);

    getRecentUserInfo(user.id);
    getMissions();
  };

  const updateStatus = async (mission: mission) => {
    Alert.alert(
      "미션 진행 여부",
      "미션을 완수하셨나요?",
      [
        {
          text: "아니요...",
        },
        {
          text: "네!",
          onPress: () => {
            doneMission(mission);
            getMissions();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const getMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("missions")
        .select()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching missions:", error.message);
        return;
      }

      setMissions(data);
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
        <Text style={styles.guideText}>
          누나! 이 어플의 변화를 지켜봐줘요~
        </Text>
      </View>
      <ScrollView>
        {missions.map((mission) => (
          <TouchableOpacity
            key={mission.id}
            style={mission.completed ? styles.completedItem : styles.item}
            onPress={() => updateStatus(mission)}
          >
            <Text
              style={
                mission.completed ? styles.completedItemText : styles.itemText
              }
              key={mission.id}
            >
              {mission.title} {mission.completed}
            </Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: "#CCCCCC",
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
