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
import SubmitButton from '../common/SubmitButton'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { supabase } from '@/utils/supabase'
import CancelButton from '../common/CancelButton'
import theme from '@/constants/Theme'
import { colors } from '@/constants/Colors'
import { sendPushNotification } from '@/lib/sendPushNotification'
import InputBox from './InputBox'

export default function CouponIssueModal({
  getIssuedCoupons,
  isModalVisible,
  closeModal,
}: {
  getIssuedCoupons: () => void
  isModalVisible: boolean
  closeModal: () => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const [isNameNull, setIsNameNull] = useState(false)
  const [isPriceNull, setIsPriceNull] = useState(false)

  const user: user = useAuthStore((state: any) => state.user)
  const loveFcmToken: string = useAuthStore((state: any) => state.loveFcmToken)

  const onChangeName = (text: string) => {
    setName(text)
    setIsNameNull(false)
  }

  const onChangeDescription = (text: string) => {
    setDescription(text)
  }

  const onChangePrice = (text: string) => {
    const price = text.replaceAll(/[^0-9]/g, '')
    setPrice(price)
    setIsPriceNull(false)
  }

  const issueCoupon = async () => {
    if (name == '') {
      setIsNameNull(true)
      return
    }

    if (price == '') {
      setIsPriceNull(true)
      return
    }

    const { error } = await supabase
      .from('loveCoupons')
      .insert({ name, description, price, userId: user.id })

    if (error) {
      console.error(error)
      return
    }

    await sendPushNotification(loveFcmToken, '연인이 새로운 쿠폰을 발행하였습니다!', name, 'coupon')

    setName('')
    setDescription('')
    setPrice('')

    getIssuedCoupons()
    closeModal()
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
                <InputBox
                  label="쿠폰 이름"
                  multiline
                  text={name}
                  onChangeText={(text) => onChangeName(text)}
                  isTextNull={isNameNull}
                />

                <InputBox
                  label="쿠폰 설명"
                  multiline
                  text={description}
                  onChangeText={(text) => onChangeDescription(text)}
                />

                <InputBox
                  label="쿠폰 가격"
                  keyboardType="numeric"
                  text={price}
                  onChangeText={(text) => onChangePrice(text)}
                  isTextNull={isPriceNull}
                />

                <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                  <CancelButton text="취소하기" onPressEvent={closeModal} />
                  <SubmitButton text="발행하기" onPressEvent={issueCoupon} />
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
  warningText: {
    fontSize: 12,
    color: colors.deepRed,
    paddingTop: 4,
    paddingLeft: 10,
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
  inputBox: {
    marginBottom: 16,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
