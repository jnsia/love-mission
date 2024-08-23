import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function LoveCoupon({
  coupon,
  onPressEvent,
}: {
  coupon: loveCoupon;
  onPressEvent: () => void;
}) {
  return (
    <TouchableOpacity style={styles.couponItem} onPress={() => onPressEvent()}>
      <View style={styles.couponContent}>
        <Text style={styles.couponText}>{coupon.title}</Text>
        <Text style={styles.couponPrice}>{coupon.price}</Text>
        <Text style={styles.couponPrice}>{coupon.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  couponItem: {
    flexDirection: "column",
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
});
