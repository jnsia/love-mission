import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import React, { useState } from 'react'
import SubmitButton from './SubmitButton'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { supabase } from '@/utils/supabase'
import CancelButton from './CancelButton'
import theme from '@/constants/Theme'
import { colors } from '@/constants/Colors'
import { sendPushNotification } from '@/lib/sendPushNotification'

export default function MissionRegistModal({
  getMissions,
  isModalVisible,
  closeModal,
}: {
  getMissions: () => void
  isModalVisible: boolean
  closeModal: () => void
}) {
  const [type, setType] = useState('special')
  const [deadline, setDeadline] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [successCoin, setSuccessCoin] = useState('100')
  const [failCoin, setFailCoin] = useState('0')

  const user: user = useAuthStore((state: any) => state.user)
  const loveFcmToken: string = useAuthStore((state: any) => state.loveFcmToken)

  const registMission = async () => {
    if (title == '') return

    const { error } = await supabase.from('missions').insert({
      title,
      description,
      type,
      successCoin,
      failCoin,
      userId: user.loveId,
    })

    if (error) {
      console.error(error)
      return
    }

    await sendPushNotification(loveFcmToken, '연인이 미션을 등록하였습니다!', title)

    setType('special')
    setTitle('')
    setDescription('')
    setDeadline('')
    setSuccessCoin('100')
    setFailCoin('0')

    getMissions()
    closeModal()
  }

  const selectMissionType = (type: string) => {
    setType(type)
  }

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
                <View style={styles.guideBox}>
                  {type === 'special' && (
                    <Text style={styles.guideText}>특별 미션은 시간이 지나도 사라지지 않아요~</Text>
                  )}
                  {type === 'daily' && (
                    <Text style={styles.guideText}>일일 미션은 다음 날이 되면 사라져요!</Text>
                  )}
                  {type === 'emergency' && (
                    <Text style={styles.guideText}>
                      긴급 미션은 미션의 마감기한을 설정할 수 있어요.
                    </Text>
                  )}
                </View>

                <Text style={styles.label}>미션 타입</Text>
                <View style={styles.typeSelectBox}>
                  <TouchableOpacity
                    style={[styles.typeButton, type === 'special' && styles.selectedTypeButton]}
                    onPress={() => selectMissionType('special')}
                  >
                    <Text style={styles.typeText}>특별</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === "daily" && styles.selectedTypeButton,
                    ]}
                    onPress={() => selectMissionType("daily")}
                  >
                    <Text style={styles.typeText}>일일</Text>
                  </TouchableOpacity> */}
                  {/* <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === "emergency" && styles.selectedTypeButton,
                    ]}
                    onPress={() => selectMissionType("emergency")}
                  >
                    <Text style={styles.typeText}>긴급</Text>
                  </TouchableOpacity> */}
                </View>

                {type === 'emergency' && (
                  <View>
                    <Text style={styles.label}>마감시간</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD HH-MM"
                      value={deadline}
                      onChangeText={setDeadline}
                    />
                  </View>
                )}

                <Text style={styles.label}>미션 제목</Text>
                <TextInput
                  style={styles.input}
                  placeholder="미션 제목을 입력하세요"
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={styles.label}>미션 설명</Text>
                <TextInput
                  style={styles.input}
                  placeholder="미션 설명을 입력하세요"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />

                <Text style={styles.label}>성공 시 지급될 코인</Text>
                <TextInput
                  style={styles.input}
                  placeholder="코인 입력"
                  value={successCoin}
                  onChangeText={setSuccessCoin}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>실패 시 차감될 코인</Text>
                <TextInput
                  style={styles.input}
                  placeholder="코인 입력"
                  value={failCoin}
                  onChangeText={setFailCoin}
                  keyboardType="numeric"
                />

                <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                  <CancelButton text="취소하기" onPressEvent={closeModal} />
                  <SubmitButton text="저장하기" onPressEvent={registMission} />
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
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
  typeSelectBox: {
    flex: 1,
    gap: 16,
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
  },
  selectedTypeButton: {
    borderColor: colors.deepRed, // 선택된 버튼의 border 색상
  },
  typeText: {
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
