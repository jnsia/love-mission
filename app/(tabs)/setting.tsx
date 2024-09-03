import useAuthStore from "@/stores/authStore";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SettingScreen() {
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);

  const remove = async () => {
    await logout()
  };

  return (
    <View style={styles.container}>
      <Text>Details</Text>
      <TouchableOpacity style={styles.submit} onPress={remove}>
        <Text>{user.id} 인증</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submit: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
  },
});
