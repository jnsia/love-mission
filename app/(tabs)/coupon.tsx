// screens/CouponListScreen.tsx
import theme from "@/constants/Theme";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const coupons: coupon[] = [
  { id: "1", title: "Free Coffee", price: "$20" },
  { id: "2", title: "Movie Night", price: "$30" },
  { id: "3", title: "Dinner Date", price: "$150" },
];

const availableCoupons: coupon[] = [
  { id: "1", title: "Spa Day", price: "$20" },
  { id: "2", title: "Concert Tickets", price: "$50" },
  { id: "3", title: "Weekend Getaway", price: "$150" },
];

interface coupon {
  id: string;
  title: string;
  price: string;
}

export default function CouponListScreen() {
  const [page, setPage] = useState("myCoupons");

  const myCoupons = ({ item }: { item: coupon }) => (
    <TouchableOpacity
      style={styles.couponItem}
      onPress={() => alert(`You selected: ${item.title}`)}
    >
      <Text style={styles.couponText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const loveCoupons = ({ item }: { item: coupon }) => (
    <TouchableOpacity
      style={styles.couponItem}
      onPress={() => alert(`You selected: ${item.title}`)}
    >
      <View style={styles.couponContent}>
        <Text style={styles.couponText}>{item.title}</Text>
        <Text style={styles.couponPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {page === "myCoupons" && (
        <View>
          <Text style={styles.title}>My Coupons</Text>
          <FlatList
            data={coupons}
            renderItem={myCoupons}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
      {page === "loveCoupons" && (
        <View style={styles.container}>
          <Text style={styles.title}>Available Coupons</Text>
          <FlatList
            data={availableCoupons}
            renderItem={loveCoupons}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#11181C",
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
});
