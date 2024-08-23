import MissionInput from "@/components/common/MissionInput";
import SubmitButton from "@/components/common/SubmitButton";
import { colors } from "@/constants/Colors";
import theme from "@/constants/Theme";
import useAuthStore from "@/stores/authStore";
import { todo } from "@/types/todo";
import { user } from "@/types/user";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

export default function LoveScreen() {
  const [todos, setTodos] = useState<todo[]>([]);
  const [text, setText] = useState("");

  const user: user = useAuthStore((state: any) => state.user);

  const offset = new Date().getTimezoneOffset() * 60000;
  const today = new Date(Date.now() - offset).toISOString().substring(0, 10);

  const addTodo = async () => {
    if (text == "") return;

    const { error } = await supabase
      .from("todos")
      .insert({ title: text, user_id: user.love_id });

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

  const getTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.love_id);

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
      <FlatList
        data={todos}
        keyExtractor={(todo: todo) => todo.id.toString()}
        renderItem={({ item }) =>
          item.completed ? (
            <TouchableOpacity style={styles.completedItem}>
              <Text style={styles.completedItemText} key={item.id}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.item}>
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
