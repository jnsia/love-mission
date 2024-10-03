import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import SubmitButton from '../common/SubmitButton'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { supabase } from '@/utils/supabase'
import CancelButton from '../common/CancelButton'
import theme from '@/constants/Theme'
import { sendPushNotification } from '@/lib/sendPushNotification'
import { router } from 'expo-router'
import { fonts } from '@/constants/Fonts'

export default function CouponInfoModal({
  page,
  setPage,
  getCoupons,
  isCouponInfoVisible,
  closeCouponInfoModal,
  coupon,
}: {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
  getCoupons: () => void
  isCouponInfoVisible: boolean
  closeCouponInfoModal: () => void
  coupon: coupon
}) {
  const user: user = useAuthStore((state: any) => state.user)
  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)
  const loveFcmToken: string = useAuthStore((state: any) => state.loveFcmToken)

  const useCoupon = async () => {
    try {
      const { data, error } = await supabase.from('missions').insert({
        title: `${coupon.name} 쿠폰 사용!`,
        type: 'coupon',
        description: coupon.description,
        successCoin: 0,
        failCoin: 0,
        userId: user.loveId,
      })

      await sendPushNotification(
        loveFcmToken,
        `연인이 ${coupon.name} 쿠폰을 사용하였습니다!`,
        `${coupon.name} 미션을 수행해주세요.`,
        'index',
      )

      await supabase.from('myCoupons').delete().eq('id', coupon.id)

      getCoupons()
      router.replace('/(tabs)/love')
    } catch (error) {
      console.error(error)
    }
  }

  const buyCoupon = async () => {
    try {
      const offset = new Date().getTimezoneOffset() * 60000
      const today = new Date(Date.now() - offset).toISOString().substring(0, 10)

      await supabase.from('myCoupons').insert({
        name: coupon.name,
        description: coupon.description,
        price: coupon.price,
        userId: user.id,
      })

      await supabase.from('histories').insert({
        date: today,
        coin: -coupon.price,
        record: `${coupon.name} 쿠폰 구매`,
        userId: user.id,
      })

      await supabase
        .from('users')
        .update({ coin: user.coin - coupon.price })
        .eq('id', user.id)

      closeCouponInfoModal()
      getRecentUserInfo(user.id)
      setPage('myCoupons')
      getCoupons()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteCoupon = async () => {
    const { data, error } = await supabase.from('loveCoupon').delete().eq('id', coupon.id)

    if (error) {
      console.error('쿠폰 삭제 중 문제 발생')
    }
  }

  const clickUseButton = () => {
    Alert.alert(
      '쿠폰을 사용하시겠습니까?',
      '',
      [
        {
          text: '아니요',
        },
        {
          text: '네!',
          onPress: () => {
            useCoupon()
          },
        },
      ],
      { cancelable: false },
    )
  }

  const clickBuyButton = () => {
    if (coupon.price > user.coin) {
      Alert.alert('코인이 부족합니다!')
      return
    }

    Alert.alert(
      '쿠폰을 구매하시겠습니까?',
      '',
      [
        {
          text: '아니요',
        },
        {
          text: '네!',
          onPress: () => {
            buyCoupon()
          },
        },
      ],
      { cancelable: false },
    )
  }

  const clickDeleteButton = () => {
    Alert.alert(
      '쿠폰을 삭제하시겠습니까?',
      '',
      [
        {
          text: '아니요',
        },
        {
          text: '네!',
          onPress: () => {
            deleteCoupon()
          },
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <Modal
      animationType="fade"
      visible={isCouponInfoVisible}
      transparent={true}
      onRequestClose={closeCouponInfoModal}
    >
      <TouchableWithoutFeedback onPress={closeCouponInfoModal}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalView}>
            <View style={styles.couponInfo}>
              <Text style={styles.label}>쿠폰 이름</Text>
              <Text style={styles.couponInfoText}>{coupon.name}</Text>
            </View>

            {coupon.description && (
              <View style={styles.couponInfo}>
                <Text style={styles.label}>쿠폰 설명</Text>
                <Text style={styles.couponInfoText}>{coupon.description}</Text>
              </View>
            )}

            <View style={styles.couponInfo}>
              <Text style={styles.label}>쿠폰 가격</Text>
              <Text style={styles.couponInfoText}>{coupon.price} Coin</Text>
            </View>

            {page === 'myCoupons' && (
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                <CancelButton text="닫기" onPressEvent={closeCouponInfoModal} />
                <SubmitButton text="사용하기" onPressEvent={clickUseButton} />
              </View>
            )}

            {page === 'loveCoupons' && (
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                <CancelButton text="닫기" onPressEvent={closeCouponInfoModal} />
                <SubmitButton text="구매하기" onPressEvent={clickBuyButton} />
              </View>
            )}

            {page === 'issuedCoupons' && (
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                <CancelButton text="닫기" onPressEvent={closeCouponInfoModal} />
                <SubmitButton text="삭제하기" onPressEvent={clickDeleteButton} />
              </View>
            )}
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
  couponInfo: {
    marginBottom: 16,
  },
  couponInfoText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
