// screens/CouponListScreen.tsx
import CouponTabs from "@/components/coupons/CouponTabs";
import LoveCoupon from "@/components/coupons/LoveCoupon";
import { colors } from "@/constants/Colors";
import theme from "@/constants/Theme";
import useAuthStore from "@/stores/authStore";
import { user } from "@/types/user";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const coupons: coupon[] = [
  { id: "1", title: "Free Coffee", description: "lormMovie Night", price: "$20" },
  { id: "2", title: "Movie Night", description: "Movie Night", price: "$30" },
  { id: "3", title: "Dinner Date", description: "Movie NightMovie Night", price: "$150" },
];

const availableCoupons: coupon[] = [
  { id: "1", title: "Spa Day", description: "lormMovie Night", price: "$20" },
  { id: "2", title: "Concert Tickets", description: "lormMovieMovieMovie Night", price: "$50" },
  { id: "3", title: "Weekend Getaway", description: "lorMoviemMovie Night", price: "$150" },
];

interface coupon {
  id: string;
  title: string;
  description: string;
  price: string;
}

export default function CouponListScreen() {
  const [page, setPage] = useState("myCoupons");
  const [myCoupons, setMyCoupons] = useState<coupon[]>([])
  const [loveCoupons, setLoveCoupons] = useState<coupon[]>([])
  const updateUserPoint = useAuthStore((state: any) => state.updateUserPoint);
  const user: user = useAuthStore((state: any) => state.user)

  const getMyCoupons = async () => {
    const { data, error } = await supabase.from("my_coupons").select().eq("user_id", user.id)

    if (error) {
      console.error("Error fetching todos:", error.message);
      return;
    }

    setMyCoupons(data);
  }

  const getLoveCoupons = async () => {
    const { data, error } = await supabase.from("love_coupons").select().eq("user_id", user.love_id)

    if (error) {
      console.error("Error fetching todos:", error.message);
      return;
    }

    setLoveCoupons(data);
  }

  const myCouponsList = ({ item }: { item: coupon }) => (
    <TouchableOpacity
      style={styles.couponItem}
      onPress={() => alert(`You selected: ${item.title}`)}
    >
      <Text style={styles.couponText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const buyCoupon = async () => {
    console.log(`You selected`);
    await updateUserPoint(1000);
  };

  useEffect(() => {
    getMyCoupons()
    getLoveCoupons()
  }, [])

  return (
    <View style={styles.container}>
      <CouponTabs page={page} setPage={setPage} />
      {page === "myCoupons" && (
        <View style={styles.couponsContainer}>
          <FlatList
            data={myCoupons}
            renderItem={myCouponsList}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
      {/* {page === "loveCoupons" && (
        <View style={styles.couponsContainer}>
          <FlatList
            data={loveCoupons}
            renderItem={(item: cou) => <LoveCoupon coupon={item} onPressEvent={buyCoupon} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      )} */}
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
    marginBottom: 16,
    color: "#11181C",
  },
  couponsContainer: {
    marginTop: 24,
  },
  couponItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#eeeeee",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  couponContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  couponText: {
    fontSize: 18,
    color: "#11181C",
  },
  couponPrice: {
    fontSize: 18,
    color: "#0a7ea4",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  contentText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
