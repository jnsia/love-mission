import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import React, { useState } from 'react'
import { user } from '@/shared/types/user'
import useAuthStore from '@/stores/authStore'
import { supabase } from '@/shared/utils/supabase'
import { colors } from '@/shared/constants/Colors'
import { sendPushNotification } from '@/shared/lib/pushNotification'
import { fonts } from '@/shared/constants/Fonts'
import CancelButton from '@/shared/components/CancelButton'
import SubmitButton from '@/shared/components/SubmitButton'

export default function ScheduledMissionRegistModal({
  getMissions,
  isModalVisible,
  closeModal,
}: {
  getMissions: () => void
  isModalVisible: boolean
  closeModal: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [successCoin, setSuccessCoin] = useState('100')
  const [failCoin, setFailCoin] = useState('0')

  const user: user = useAuthStore((state: any) => state.user)

  const registMission = async () => {
    if (title == '') return

    const { error } = await supabase.from('scheduledMissions').insert({
      title,
      description,
      successCoin,
      failCoin,
      userId: user.loveId,
    })

    if (error) {
      console.error(error)
      return
    }

    setTitle('')
    setDescription('')
    setSuccessCoin('100')
    setFailCoin('0')

    getMissions()
    closeModal()
  }

  return (
    <Modal
      animationType='fade'
      visible={isModalVisible}
      transparent={true}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <ScrollView>
                <Text style={styles.label}>미션 제목</Text>
                <TextInput
                  style={styles.input}
                  placeholder='미션 제목을 입력하세요'
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={styles.label}>미션 설명</Text>
                <TextInput
                  style={styles.input}
                  placeholder='미션 설명을 입력하세요'
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />

                <Text style={styles.label}>성공 시 지급될 코인</Text>
                <TextInput
                  style={styles.input}
                  placeholder='코인 입력'
                  value={successCoin}
                  onChangeText={setSuccessCoin}
                  keyboardType='numeric'
                />

                <View>
                  <Text style={styles.label}>실패 시 차감될 코인</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='코인 입력'
                    value={failCoin}
                    onChangeText={setFailCoin}
                    keyboardType='numeric'
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <CancelButton text='취소하기' onPressEvent={closeModal} />
                  <SubmitButton text='예약하기' onPressEvent={registMission} />
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
    borderColor: colors.accent, // 선택된 버튼의 border 색상
  },
  typeText: {
    textAlign: 'center',
    fontFamily: fonts.default,
  },
  label: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: fonts.default,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
    fontFamily: fonts.default,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
