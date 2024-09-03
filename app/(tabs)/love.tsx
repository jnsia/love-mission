import MissionInput from "@/components/common/MissionInput";
import SubmitButton from "@/components/common/SubmitButton";
import theme from "@/constants/Theme";
import useAuthStore from "@/stores/authStore";
import { mission } from "@/types/mission";
import { user } from "@/types/user";
import { supabase } from "@/utils/supabase";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

export default function LoveScreen() {
  const [missions, setMissions] = useState<mission[]>([]);
  const [text, setText] = useState("");

  const user: user = useAuthStore((state: any) => state.user);

  const addMission = async () => {
    if (text == "") return;

    const { error } = await supabase
      .from("missions")
      .insert({ title: text, user_id: user.love_id });

    if (error) {
      console.error(error);
      return;
    }

    setText("");
    getMissions();
  };

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
      <ScrollView>
        {missions.map((mission) => (
          <TouchableOpacity
          key={mission.id}
            style={mission.completed ? styles.completedItem : styles.item}
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
      <MissionInput text={text} setText={setText} />
      <SubmitButton text="저장하기" onPressEvent={addMission} />
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
