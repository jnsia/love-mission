import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import SubmitButton from "../common/SubmitButton";
import { user } from "@/types/user";
import useAuthStore from "@/stores/authStore";
import { supabase } from "@/utils/supabase";
import CancelButton from "../common/CancelButton";
import theme from "@/constants/Theme";
import { colors } from "@/constants/Colors";
import { sendPushNotification } from "@/lib/sendPushNotification";

export default function CouponIssueModal({
  getIssuedCoupons,
  isModalVisible,
  closeModal,
}: {
  getIssuedCoupons: () => void;
  isModalVisible: boolean;
  closeModal: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const user: user = useAuthStore((state: any) => state.user);
  const loveFcmToken: string = useAuthStore((state: any) => state.loveFcmToken)

  const issueCoupon = async () => {
    if (name == "") return;

    const { error } = await supabase
      .from("loveCoupons")
      .insert({ name, description, price, userId: user.id });

    if (error) {
      console.error(error);
      return;
    }

    await sendPushNotification(loveFcmToken, '연인이 새로운 쿠폰을 발행하였습니다!', name)

    setName("")
    setDescription("")
    setPrice("")

    getIssuedCoupons();
    closeModal();
  };

  return (
    <Modal
      animationType="fade"
      visible={isModalVisible}
      transparent={true}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <ScrollView>
                <Text style={styles.label}>쿠폰 이름</Text>
                <TextInput
                  style={styles.input}
                  placeholder="쿠폰 이름을 입력하세요"
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.label}>쿠폰 설명</Text>
                <TextInput
                  style={styles.input}
                  placeholder="쿠폰 설명을 입력하세요"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />

                <Text style={styles.label}>쿠폰 가격</Text>
                <TextInput
                  style={styles.input}
                  placeholder="코인 입력"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />

                <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                  <CancelButton text="취소하기" onPressEvent={closeModal} />
                  <SubmitButton text="발행하기" onPressEvent={issueCoupon} />
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  guideBox: {
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.button,
    marginBottom: 16,
  },
  guideText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경을 반투명하게 설정
  },
  modalView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    padding: 16,
    marginTop: 60,
    backgroundColor: "white",
  },
  modalTextStyle: {
    color: "#17191c",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
  },
  typeSelectBox: {
    flex: 1,
    gap: 16,
    flexDirection: "row",
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
  },
  selectedTypeButton: {
    borderColor: colors.deepRed, // 선택된 버튼의 border 색상
  },
  typeText: {
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
