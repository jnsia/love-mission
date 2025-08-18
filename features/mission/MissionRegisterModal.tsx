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
import { user } from '@/features/user/types/user.type'
import useAuthStore from '@/stores/authStore'
import { colors } from '@/shared/constants/Colors'
import { fonts } from '@/shared/constants/Fonts'
import GuideView from '../coupon/GuideView'
import CancelButton from '@/shared/components/CancelButton'
import SubmitButton from '@/shared/components/SubmitButton'
import useMissionRegister from './hooks/useMissionRegister'

export default function MissionRegisterModal({
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

  const { registerMission } = useMissionRegister()

  const selectMissionType = (type: string) => {
    setType(type)
  }

  const handleRegisterMission = async () => {
    if (title == '') return

    const request = {
      title,
      description,
      type,
      successCoin,
      failCoin,
      userId: user.loveId,
    }

    await registerMission(request)

    setType('special')
    setTitle('')
    setDescription('')
    setDeadline('')
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
                {type === 'special' && (
                  <GuideView
                    texts={['특별 미션은 시간이 지나도 사라지지 않아요~']}
                  />
                )}
                {type === 'daily' && (
                  <GuideView texts={['일일 미션은 다음 날이 되면 사라져요!']} />
                )}
                {type === 'emergency' && (
                  <GuideView
                    texts={['긴급 미션은 미션의 마감기한을 설정할 수 있어요.']}
                  />
                )}

                <Text style={styles.label}>미션 타입</Text>
                <View style={styles.typeSelectBox}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'special' && styles.selectedTypeButton,
                    ]}
                    onPress={() => selectMissionType('special')}
                  >
                    <Text style={styles.typeText}>특별</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'daily' && styles.selectedTypeButton,
                    ]}
                    onPress={() => selectMissionType('daily')}
                  >
                    <Text style={styles.typeText}>일일</Text>
                  </TouchableOpacity>
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
                      placeholder='YYYY-MM-DD HH-MM'
                      value={deadline}
                      onChangeText={setDeadline}
                    />
                  </View>
                )}

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

                {type !== 'special' && (
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
                )}

                <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                  <CancelButton text='취소하기' onPressEvent={closeModal} />
                  <SubmitButton
                    text='저장하기'
                    onPressEvent={handleRegisterMission}
                  />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
