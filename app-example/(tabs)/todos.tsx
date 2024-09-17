import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { user } from "@/types/user";
import useAuthStore from "@/stores/authStore";
import { todo } from "@/types/todo";
import theme from "@/constants/Theme";
import SubmitButton from "@/components/common/SubmitButton";
import MissionInput from "@/components/common/MissionInput";

export default function Todos() {
  const [todos, setTodos] = useState<todo[]>([]);
  const [text, setText] = useState("");

  const user: user = useAuthStore((state: any) => state.user);

  const offset = new Date().getTimezoneOffset() * 60000;
  const today = new Date(Date.now() - offset).toISOString().substring(0, 10);

  const addTodo = async () => {
    if (text == "") return;

    const { error } = await supabase
      .from("todos")
      .insert({ title: text, userId: user.id });

    if (error) {
      console.error(error);
      return;
    }

    setText("");
    getTodos();
  };

  const removeTodo = async (todo: todo) => {
    const { error } = await supabase
      .from("dones")
      .insert({ title: todo.title, completed: todo.completed });

    if (error) {
      console.error(error);
      return;
    }

    const response = await supabase.from("todos").delete().eq("id", todo.id);
    console.log(`Delete Todo: ${todo.title}`);

    getTodos();
  };

  const updateStatus = async (todo: todo) => {
    const confirmText = todo.completed
      ? "미션을 완료하지 않으셨나요~?"
      : "미션을 완수하셨나요!";

    Alert.alert(
      "미션 완료 여부 변경",
      confirmText,
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: async () => {
            const { error } = await supabase
              .from("todos")
              .update({ completed: !todo.completed })
              .eq("id", todo.id);

            if (error) {
              return;
            }

            getTodos();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const getTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Error fetching todos:", error.message);
        return;
      }

      const newTodos: todo[] = [];

      data.forEach((todo) => {
        const { created_at } = todo;
        const createDate = created_at.substring(0, 10);

        if (createDate !== today) {
          removeTodo(todo);
        } else {
          newTodos.push(todo);
        }
      });

      setTodos(newTodos);
    } catch (error: any) {
      console.error("Error fetching todos:", error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.guideBox}>
        <Text style={styles.guideText}>연인이 당신에게 할당한 미션입니다!</Text>
        <Text style={styles.guideText}>
          어서 미션을 완료하여 포인트를 획득하세요.
        </Text>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(todo: todo) => todo.id.toString()}
        renderItem={({ item }) =>
          item.completed ? (
            <TouchableOpacity
              style={styles.completedItem}
              onPress={() => updateStatus(item)}
            >
              <Text style={styles.completedItemText} key={item.id}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.item}
              onPress={() => updateStatus(item)}
            >
              <Text key={item.id} style={styles.itemText}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )
        }
      />

      <MissionInput text={text} setText={setText} />
      <SubmitButton text="저장하기" onPressEvent={addTodo} />
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
  },
  guideText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  item: {
    padding: 16,
    backgroundColor: "white",
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
