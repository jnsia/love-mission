import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function MyCoupon({ coupon }: { coupon: myCoupon }) {
  return (
    <TouchableOpacity
      style={styles.couponItem}
      onPress={() => alert(`You selected: ${coupon.name}`)}
    >
      <Text style={styles.couponText}>{coupon.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
