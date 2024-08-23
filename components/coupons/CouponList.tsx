import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function CouponList({coupons}: {coupons: loveCoupon[]}) {
  return (
    <View style={styles.couponsContainer}>
        {}
    </View>
  );
}

const styles = StyleSheet.create({
  couponsContainer: {
    marginTop: 24,
  },
});
