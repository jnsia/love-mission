import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState } from "react";
import SubmitButton from "./SubmitButton";
import { user } from "@/types/user";
import useAuthStore from "@/stores/authStore";
import { supabase } from "@/utils/supabase";
import CancelButton from "./CancelButton";
import theme from "@/constants/Theme";
import { mission } from "@/types/mission";
import { colors } from "@/constants/Colors";

export default function MissionInfoModal({
  getMissions,
  isMissionInfoVisible,
  closeMissionInfoModal,
  mission,
}: {
  getMissions: () => void;
  isMissionInfoVisible: boolean;
  closeMissionInfoModal: () => void;
  mission: mission;
}) {
  const user: user = useAuthStore((state: any) => state.user);

  const approveMission = async () => {
    // const offset = new Date().getTimezoneOffset() * 60000;
    // const today = new Date(Date.now() - offset).toISOString().substring(0, 10);

    // const { error } = await supabase.from("histories").insert({
    //   date: today,
    //   point: 100,
    //   record: `${mission.title} 미션 성공`,
    //   userId: user.id,
    // });

    // if (error) {
    //   console.error(error);
    //   return;
    // }

    await supabase
      .from("users")
      .update({ point: user.point + mission.successPoint })
      .eq("id", user.love_id);

    await supabase.from("missions").delete().eq("id", mission.id);

    closeMissionInfoModal()
  };

  const changeCompleted = async () => {
    await supabase
      .from("missions")
      .update({ completed: true })
      .eq("id", mission.id);

    getMissions();
  };

  const clickApproveButton = () => {
    Alert.alert(
      "연인이 미션을 완수하였나요?",
      "승인하면 연인이 포인트를 획득할 수 있습니다.",
      [
        {
          text: "반려",
        },
        {
          text: "승인",
          onPress: () => {
            approveMission();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const clickCompleteButton = () => {
    Alert.alert(
      "미션을 완수하셨나요?",
      "미션 완수 후 연인의 결재를 받으면 포인트를 얻을 수 있습니다.",
      [
        {
          text: "아니요",
        },
        {
          text: "네!",
          onPress: () => {
            changeCompleted();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Modal
      animationType="fade"
      visible={isMissionInfoVisible}
      transparent={true}
      onRequestClose={closeMissionInfoModal}
    >
      <TouchableWithoutFeedback onPress={closeMissionInfoModal}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalView}>
            <View style={styles.missionInfo}>
              <Text style={styles.label}>미션 제목</Text>
              <Text style={styles.missionInfoText}>{mission.title}</Text>
            </View>

            {mission.description != null && (
              <View style={styles.missionInfo}>
                <Text style={styles.label}>미션 설명</Text>
                <Text style={styles.missionInfoText}>
                  {mission.description}
                </Text>
              </View>
            )}

            <View style={styles.missionInfo}>
              <Text style={styles.label}>성공 시 지급될 포인트</Text>
              <Text style={styles.missionInfoText}>{mission.successPoint}</Text>
            </View>

            {mission.failPoint != 0 && (
              <View style={styles.missionInfo}>
                <Text style={styles.label}>실패 시 차감될 포인트</Text>
                <Text style={styles.missionInfoText}>{mission.failPoint}</Text>
              </View>
            )}

            {user.id === mission.userId ? (
              <View>
                {mission.completed ? (
                  <View style={{ alignItems: "center", gap: 16, marginTop: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      결재 대기 중 입니다...
                    </Text>
                    <View
                      style={{ flexDirection: "row", gap: 16, marginTop: 8 }}
                    >
                      <CancelButton
                        text="닫기"
                        onPressEvent={closeMissionInfoModal}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                    <CancelButton
                      text="닫기"
                      onPressEvent={closeMissionInfoModal}
                    />
                    <SubmitButton
                      text="미션 완료"
                      onPressEvent={clickCompleteButton}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View>
                {mission.completed ? (
                  <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                    <CancelButton
                      text="닫기"
                      onPressEvent={closeMissionInfoModal}
                    />
                    <SubmitButton
                      text="미션 완료 확인"
                      onPressEvent={clickApproveButton}
                    />
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                    <CancelButton
                      text="닫기"
                      onPressEvent={closeMissionInfoModal}
                    />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  missionInfo: {
    marginBottom: 16,
  },
  missionInfoText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
