import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import useAuthStore from "@/stores/authStore";
import { user } from "@/types/user";
import { Alert } from "react-native";

export default function RootLayout() {
  const user: user = useAuthStore((state: any) => state.user);
  const getPIN = useAuthStore((state: any) => state.getPIN);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      await getPIN();
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // user 값에 따라 로그인 상태를 업데이트
    if (user !== null) {
      router.replace("/(tabs)");
    }
  }, [user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user === null ? (
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
