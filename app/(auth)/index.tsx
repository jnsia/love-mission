import { colors } from "@/constants/Colors";
import useAuthStore from "@/stores/authStore";
import { user } from "@/types/user";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const [pin, setPin] = useState("");
  const [checkPin, setCheckPin] = useState(true);

  const [animation] = useState(new Animated.Value(1));

  const user = useAuthStore((state: any) => state.user);
  const getPIN = useAuthStore((state: any) => state.getPIN);

  const handleFocus = () => {
    Animated.spring(animation, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const signIn = async () => {
    if (pin.length !== 6) {
      setCheckPin(true);
      return;
    }

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
      <Animated.View style={[styles.inputContainer, { transform: [{ scale: animation }] }]}>
        <FontAwesome name="lock" size={24} color="#FF6347" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="000000"
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={6}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
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
    // marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121417", // 차콜 블랙
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF6347",
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: colors.deepRed,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#333',
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
  icon: {
    marginRight: 10,
  },
});
