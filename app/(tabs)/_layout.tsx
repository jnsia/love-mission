import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          if (route.name === "index") {
            iconName = "clipboard";
          } else if (route.name === "details") {
            iconName = "heart";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6347", // 활성화된 탭의 색상
        tabBarInactiveTintColor: "#808080", // 비활성화된 탭의 색상
        tabBarStyle: {
          backgroundColor: "#FFF8DC", // 탭바 배경 색상
          borderTopWidth: 0, // 탭바 상단의 테두리 제거
          height: 70, // 탭바 높이 조정
        },
        tabBarLabelStyle: {
          fontSize: 14, // 탭바 라벨 폰트 크기
          fontWeight: "bold", // 라벨 폰트 두께
        },
        tabBarItemStyle: {
          borderRadius: 10, // 탭 아이템의 모서리 둥글게 만들기
          margin: 5, // 탭 아이템 간격
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "나의 미션",
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="smile" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: "연인의 미션",
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="heart" color={color} />
          // ),
        }}
      />
    </Tabs>
  );
}
