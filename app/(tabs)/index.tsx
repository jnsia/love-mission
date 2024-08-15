import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { user } from "@/types/user";
import useAuthStore from "@/stores/authStore";

interface todo {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<todo[]>([]);
  const [text, setText] = useState("");

  const user: user = useAuthStore((state: any) => state.user);

  const offset = new Date().getTimezoneOffset() * 60000;
  const today = new Date(Date.now() - offset).toISOString().substring(0, 10);

  const addTodo = async () => {
    if (text == "") return;

    const { error } = await supabase
      .from("todos")
      .insert({ title: text, user_id: user.id });

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
      const { data, error } = await supabase.from("todos").select("*");

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
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        onChangeText={setText}
        value={text}
      />
      <TouchableOpacity style={styles.button} onPress={addTodo}>
        <Text style={styles.buttonText}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,
    backgroundColor: "#E6E6FA",
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
    backgroundColor: "#FFF8DC",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FFF8DC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
