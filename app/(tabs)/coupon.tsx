// screens/CouponListScreen.tsx
import CouponList from "@/components/coupons/CouponList";
import CouponTabs from "@/components/coupons/CouponTabs";
import theme from "@/constants/Theme";
import useAuthStore from "@/stores/authStore";
import { user } from "@/types/user";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

export default function CouponListScreen() {
  const [page, setPage] = useState("myCoupons");
  const [myCoupons, setMyCoupons] = useState<myCoupon[]>([]);
  const [loveCoupons, setLoveCoupons] = useState<loveCoupon[]>([]);
  const [issuedCoupons, setIssuedCoupons] = useState<loveCoupon[]>([]);
  const getRecentUserInfo = useAuthStore(
    (state: any) => state.getRecentUserInfo
  );
  const user: user = useAuthStore((state: any) => state.user);

  const getMyCoupons = async () => {
    const { data, error } = await supabase
      .from("myCoupons")
      .select()
      .eq("userId", user.id);

    if (error) {
      console.error("Error fetching todos:", error.message);
      return;
    }

    setMyCoupons(data);
  };

  const getLoveCoupons = async () => {
    const { data, error } = await supabase
      .from("loveCoupons")
      .select()
      .eq("userId", user.love_id);

    if (error) {
      console.error("Error fetching todos:", error.message);
      return;
    }

    setLoveCoupons(data);
  };

  const getIssuedCoupons = async () => {
    const { data, error } = await supabase
      .from("loveCoupons")
      .select()
      .eq("userId", user.id);

    if (error) {
      console.error("Error fetching todos:", error.message);
      return;
    }

    setIssuedCoupons(data);
  };

  const buyCoupon = async (coupon: loveCoupon) => {
    if (coupon.price > user.point) {
      Alert.alert("포인트가 부족합니다.");
      return;
    }

    try {
      await supabase.from("myCoupons").insert({
        name: coupon.name,
        description: coupon.description,
        userId: user.id,
      });

      await supabase
        .from("users")
        .update({ point: user.point - coupon.price })
        .eq("id", user.id);

      getRecentUserInfo(user.id);
    } catch (error) {
      console.error(error);
    }

    getMyCoupons();
    setPage("myCoupons");
  };

  useEffect(() => {
    getMyCoupons();
    getLoveCoupons();
    getIssuedCoupons();
  }, []);

  return (
    <View style={styles.container}>
      <CouponTabs page={page} setPage={setPage} />
      <CouponList
        page={page}
        myCoupons={myCoupons}
        loveCoupons={loveCoupons}
        issuedCoupons={issuedCoupons}
        buyCoupon={buyCoupon}
      />
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
