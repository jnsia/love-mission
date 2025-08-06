import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native'
import React from 'react'
import { user } from '@/shared/types/user'
import useAuthStore from '@/stores/authStore'
import { supabase } from '@/shared/utils/supabase'
import CancelButton from '../common/CancelButton'
import theme from '@/shared/constants/Theme'
import { mission } from '@/features/mission/types/mission'
import DeleteButton from '../common/DeleteButton'
import { fonts } from '@/shared/constants/Fonts'

export default function ScheduledMissionInfoModal({
  getMissions,
  isMissionInfoVisible,
  closeMissionInfoModal,
  mission,
}: {
  getMissions: () => void
  isMissionInfoVisible: boolean
  closeMissionInfoModal: () => void
  mission: mission
}) {
  const user: user = useAuthStore((state: any) => state.user)

  const deleteMission = async () => {
    try {
      await supabase.from('scheduledMissions').delete().eq('id', mission.id)
      getMissions()
    } catch (error) {
      console.error('미션 삭제 중 에러')
    }
  }

  const clickDeleteMission = () => {
    Alert.alert(
      '미션을 삭제할까요?',
      '',
      [
        {
          text: '아니요.',
        },
        {
          text: '네!',
          onPress: () => {
            deleteMission()
          },
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <Modal
      animationType='fade'
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

            {mission.description != '' && (
              <View style={styles.missionInfo}>
                <Text style={styles.label}>미션 설명</Text>
                <Text style={styles.missionInfoText}>{mission.description}</Text>
              </View>
            )}

            {mission.successCoin != 0 && (
              <View style={styles.missionInfo}>
                <Text style={styles.label}>성공 시 지급될 코인</Text>
                <Text style={styles.missionInfoText}>{mission.successCoin}</Text>
              </View>
            )}

            <View style={styles.missionInfo}>
              <Text style={styles.label}>실패 시 차감될 코인</Text>
              <Text style={styles.missionInfoText}>{mission.failCoin}</Text>
            </View>

            <View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <DeleteButton text='삭제하기' onPressEvent={clickDeleteMission} />
                <CancelButton text='닫기' onPressEvent={closeMissionInfoModal} />
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  guideBox: {
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 반투명하게 설정
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: 16,
    marginTop: 60,
    backgroundColor: 'white',
  },
  modalTextStyle: {
    color: '#17191c',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  label: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  missionInfo: {
    marginBottom: 16,
  },
  missionInfoText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
