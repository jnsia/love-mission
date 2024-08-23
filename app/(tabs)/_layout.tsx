import { colors } from "@/constants/Colors";
import theme from "@/constants/Theme";
import useAuthStore from "@/stores/authStore";
import { user } from "@/types/user";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function HomeLayout() {
  const user: user | null = useAuthStore((state: any) => state.user);

  return (
    <>
      <StatusBar
        barStyle="light-content" // 상태바 아이콘을 밝게 표시 (아이콘 색상: 하얀색)
        backgroundColor="#1c1f2a" // 상태바 배경색
        // translucent={true}
      />
      <View style={styles.header}>
        <View style={styles.userPointContainer}>
          <FontAwesome5 name="coins" size={24} color={colors.deepRed} />
          {user !== null && (
            <Text style={styles.userPoint}>{user.point + 1000} Coins</Text>
          )}
        </View>
      </View>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = "";

            if (route.name === "index") {
              iconName = "clipboard";
            } else if (route.name === "love") {
              iconName = "heart";
            } else if (route.name === "coupon") {
              iconName = "ticket";
            } else if (route.name === "setting") {
              iconName = "cog";
            }
            // @ts-expect-error
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ff3b3b", // 딥 레드
          tabBarInactiveTintColor: "#d1d1d1", // 라이트 그레이
          tabBarStyle: {
            backgroundColor: "#1e2025", // 다크 그레이
            borderTopWidth: 0,
            height: 72,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarItemStyle: {
            borderRadius: 10,
            margin: 10,
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "나의 미션",
          }}
        />
        <Tabs.Screen
          name="love"
          options={{
            title: "연인의 미션",
          }}
        />
        <Tabs.Screen
          name="coupon"
          options={{
            title: "쿠폰",
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "설정",
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    padding: 16,
    alignItems: "flex-end",
  },
  userPointContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    gap: 12,
  },
  userPoint: {
    minWidth: 36,
    textAlign: "right",
    color: colors.deepRed,
    fontWeight: "bold",
  },
});
