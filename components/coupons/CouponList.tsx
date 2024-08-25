import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import MyCoupon from "./MyCoupon";
import LoveCoupon from "./LoveCoupon";
import IssuedCoupon from "./IssuedCoupon";

export default function CouponList({
  page,
  myCoupons,
  loveCoupons,
  issuedCoupons,
  buyCoupon,
}: {
  page: string;
  myCoupons: myCoupon[];
  loveCoupons: loveCoupon[];
  issuedCoupons: loveCoupon[];
  buyCoupon: (coupon: loveCoupon) => void;
}) {
  return (
    <View style={styles.couponsContainer}>
      <ScrollView style={styles.couponsContainer}>
        {page === "myCoupons" &&
          myCoupons.map((coupon) => (
            <MyCoupon key={coupon.id} coupon={coupon} />
          ))}
        {page === "loveCoupons" &&
          loveCoupons.map((coupon) => (
            <LoveCoupon key={coupon.id} coupon={coupon} buyCoupon={buyCoupon} />
          ))}
        {page === "issuedCoupons" &&
          issuedCoupons.map((coupon) => (
            <IssuedCoupon key={coupon.id} coupon={coupon} />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  couponsContainer: {
    marginTop: 12,
    marginBottom: 36,
  },
});
