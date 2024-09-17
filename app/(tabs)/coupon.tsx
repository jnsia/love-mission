import RegistButton from "@/components/common/RegistButton";
import CouponInfoModal from "@/components/coupons/CouponInfoModal";
import CouponIssueModal from "@/components/coupons/CouponIssueModal";
import CouponTabs from "@/components/coupons/CouponTabs";
import theme from "@/constants/Theme";
import useAuthStore from "@/stores/authStore";
import { user } from "@/types/user";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";

export default function CouponListScreen() {
  const [page, setPage] = useState("myCoupons");
  const [myCoupons, setMyCoupons] = useState<coupon[]>([]);
  const [loveCoupons, setLoveCoupons] = useState<coupon[]>([]);
  const [issuedCoupons, setIssuedCoupons] = useState<coupon[]>([]);
  const getRecentUserInfo = useAuthStore(
    (state: any) => state.getRecentUserInfo
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCouponInfoVisible, setIsCouponInfoVisible] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(0);

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
      .eq("userId", user.loveId);

    if (error) {
      console.error("Error fetching loveCoupons:", error.message);
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

  const buyCoupon = async (coupon: coupon) => {
    if (coupon.price > user.coin) {
      Alert.alert("포인트가 부족합니다.");
      return;
    }

    try {
      await supabase.from("myCoupons").insert({
        name: coupon.name,
        description: coupon.description,
        price: coupon.price,
        userId: user.id,
      });

      
    } catch (error) {
      console.error(error);
    }

    getMyCoupons();
    setPage("myCoupons");
  };

  const clickCoupon = (coupon: coupon) => {
    setIsCouponInfoVisible(true);
    setSelectedCouponId(coupon.id);
  };

  const closeCouponInfoModal = () => {
    setIsCouponInfoVisible(false);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getMyCoupons();
    getLoveCoupons();
    getIssuedCoupons();
  }, []);

  return (
    <View style={styles.container}>
      <CouponTabs page={page} setPage={setPage} />
      <ScrollView style={styles.couponsContainer}>
        {page === "myCoupons" &&
          myCoupons.map((coupon) => (
            <View key={coupon.id}>
              <TouchableOpacity
                style={styles.couponItem}
                onPress={() => clickCoupon(coupon)}
              >
                <Text style={styles.couponText}>{coupon.name}</Text>
              </TouchableOpacity>
              {selectedCouponId == coupon.id && (
                <CouponInfoModal
                  page={page}
                  getCoupons={getMyCoupons}
                  closeCouponInfoModal={closeCouponInfoModal}
                  isCouponInfoVisible={isCouponInfoVisible}
                  coupon={coupon}
                />
              )}
            </View>
          ))}
        {page === "loveCoupons" &&
          loveCoupons.map((coupon) => (
            <View key={coupon.id}>
              <TouchableOpacity
                style={styles.couponItem}
                onPress={() => clickCoupon(coupon)}
              >
                <View style={styles.couponContent}>
                  <Text style={styles.couponText}>{coupon.name}</Text>
                  <Text style={styles.couponPrice}>{coupon.price} Coin</Text>
                </View>
              </TouchableOpacity>
              {selectedCouponId == coupon.id && (
                <CouponInfoModal
                  page={page}
                  getCoupons={getMyCoupons}
                  closeCouponInfoModal={closeCouponInfoModal}
                  isCouponInfoVisible={isCouponInfoVisible}
                  coupon={coupon}
                />
              )}
            </View>
          ))}
        {page === "issuedCoupons" &&
          issuedCoupons.map((coupon) => (
            <View key={coupon.id}>
              <TouchableOpacity
                style={styles.couponItem}
                onPress={() => clickCoupon(coupon)}
              >
                <View style={styles.couponContent}>
                  <Text style={styles.couponText}>{coupon.name}</Text>
                  <Text style={styles.couponPrice}>{coupon.price} Coin</Text>
                </View>
              </TouchableOpacity>
              {selectedCouponId == coupon.id && (
                <CouponInfoModal
                  page={page}
                  getCoupons={getMyCoupons}
                  closeCouponInfoModal={closeCouponInfoModal}
                  isCouponInfoVisible={isCouponInfoVisible}
                  coupon={coupon}
                />
              )}
            </View>
          ))}
      </ScrollView>
      {page === "issuedCoupons" && (
        <View>
          <CouponIssueModal
            getIssuedCoupons={getIssuedCoupons}
            isModalVisible={isModalVisible}
            closeModal={closeModal}
          />
          <RegistButton text="쿠폰 발행하기" onPressEvent={openModal} />
        </View>
      )}
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
    justifyContent: "space-between",
    gap: 4,
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
