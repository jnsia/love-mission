import useAuthStore from "@/stores/authStore";
import { user } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const [pin, setPin] = useState("");
  const [checkPin, setCheckPin] = useState(true);

  const user = useAuthStore((state: any) => state.user);
  const getPIN = useAuthStore((state: any) => state.getPIN);

  const signIn = async () => {
    await AsyncStorage.setItem("JNoteS_PIN", pin);
    await getPIN();

    if (user === null) {
      setCheckPin(false);
    } else {
      setCheckPin(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>남자친구/여자친구의 생년월일을 입력해주세요!</Text>
      <TextInput
        style={styles.input}
        placeholder="000000"
        inputMode="numeric"
        maxLength={6}
        onChangeText={setPin}
        value={pin}
      />
      {!checkPin && (
        <Text style={styles.warningText}>
          연인의 생년월일을 다시 확인해주세요.
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>인증</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF8DC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF6347",
  },
  input: {
    width: "100%",
    padding: 15,
    borderColor: "#FF6347",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  warningText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3, 
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF", 
    fontWeight: "bold", 
  },
});
