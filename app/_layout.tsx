import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import useAuthStore from "@/stores/authStore";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const isLoggedIn: boolean = useAuthStore((state: any) => state.isLoggedIn);
  const getPIN = useAuthStore((state: any) => state.getPIN);
  const router = useRouter();

  const fetchUser = async () => {
    await getPIN();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // user 값에 따라 로그인 상태를 업데이트
    if (isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn]);

  return (
    <>
      <StatusBar
        barStyle="light-content" // 상태바 아이콘을 밝게 표시
        translucent={true} // 상태바를 투명하게 설정
        backgroundColor="transparent" // 상태바의 배경을 투명하게 설정
      />

      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="(tabs)" />
          ) : (
            // <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/index"
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, // 상태바 높이만큼 패딩 추가 (모든 화면에 적용)
    backgroundColor: "#121417", // 차콜 블랙
  },
});
