import RegistButton from '@/components/common/RegistButton'
import CouponInfoModal from '@/components/coupons/CouponInfoModal'
import CouponIssueModal from '@/components/coupons/CouponIssueModal'
import CouponTabs from '@/components/coupons/CouponTabs'
import { colors } from '@/constants/Colors'
import theme from '@/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { user } from '@/types/user'
import { supabase } from '@/utils/supabase'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Text } from 'react-native'

export default function CouponListScreen() {
  const [page, setPage] = useState('myCoupons')
  const [myCoupons, setMyCoupons] = useState<coupon[]>([])
  const [loveCoupons, setLoveCoupons] = useState<coupon[]>([])
  const [issuedCoupons, setIssuedCoupons] = useState<coupon[]>([])
  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isCouponInfoVisible, setIsCouponInfoVisible] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)

  const getMyCoupons = async () => {
    const { data, error } = await supabase.from('myCoupons').select().eq('userId', user.id)

    if (error) {
      console.error('Error fetching todos:', error.message)
      return
    }

    setMyCoupons(data)
  }

  const getLoveCoupons = async () => {
    const { data, error } = await supabase.from('loveCoupons').select().eq('userId', user.loveId)

    if (error) {
      console.error('Error fetching loveCoupons:', error.message)
      return
    }

    setLoveCoupons(data)
  }

  const getIssuedCoupons = async () => {
    const { data, error } = await supabase.from('loveCoupons').select().eq('userId', user.id)

    if (error) {
      console.error('Error fetching todos:', error.message)
      return
    }

    setIssuedCoupons(data)
  }

  const clickCoupon = (coupon: coupon) => {
    setIsCouponInfoVisible(true)
    setSelectedCouponId(coupon.id)
  }

  const closeCouponInfoModal = () => {
    setIsCouponInfoVisible(false)
  }

  const openModal = () => {
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    getMyCoupons()
    getLoveCoupons()
    getIssuedCoupons()
  }, [])

  return (
    <View style={styles.container}>
      <CouponTabs page={page} setPage={setPage} />
      <ScrollView style={styles.couponsContainer}>
        {page === 'myCoupons' &&
          myCoupons.map((coupon) => (
            <View key={coupon.id}>
              <TouchableOpacity style={styles.couponItem} onPress={() => clickCoupon(coupon)}>
                <Text style={styles.couponText}>{coupon.name}</Text>
              </TouchableOpacity>
              {selectedCouponId == coupon.id && (
                <CouponInfoModal
                  page={page}
                  getCoupons={getMyCoupons}
                  closeCouponInfoModal={closeCouponInfoModal}
                  isCouponInfoVisible={isCouponInfoVisible}
                  coupon={coupon}
                />
              )}
            </View>
          ))}
        {page === 'loveCoupons' &&
          loveCoupons.map((coupon) => (
            <View key={coupon.id}>
              <TouchableOpacity style={styles.couponItem} onPress={() => clickCoupon(coupon)}>
                <View style={styles.couponContent}>
                  <Text style={styles.couponText}>{coupon.name}</Text>
                  <Text style={styles.couponPrice}>{coupon.price} Coin</Text>
                </View>
              </TouchableOpacity>
              {selectedCouponId == coupon.id && (
                <CouponInfoModal
                  page={page}
                  getCoupons={getMyCoupons}
                  closeCouponInfoModal={closeCouponInfoModal}
                  isCouponInfoVisible={isCouponInfoVisible}
                  coupon={coupon}
                />
              )}
            </View>
          ))}
        {page === 'issuedCoupons' &&
          issuedCoupons.map((coupon) => (
            <View key={coupon.id}>
              <TouchableOpacity style={styles.couponItem} onPress={() => clickCoupon(coupon)}>
                <View style={styles.couponContent}>
                  <Text style={styles.couponText} numberOfLines={1}>{coupon.name}</Text>
                  <Text style={styles.couponPrice}>{coupon.price} Coin</Text>
                </View>
              </TouchableOpacity>
              {selectedCouponId == coupon.id && (
                <CouponInfoModal
                  page={page}
                  getCoupons={getMyCoupons}
                  closeCouponInfoModal={closeCouponInfoModal}
                  isCouponInfoVisible={isCouponInfoVisible}
                  coupon={coupon}
                />
              )}
            </View>
          ))}
      </ScrollView>
      {page === 'issuedCoupons' && (
        <View>
          <CouponIssueModal
            getIssuedCoupons={getIssuedCoupons}
            isModalVisible={isModalVisible}
            closeModal={closeModal}
          />
          <RegistButton text="쿠폰 발행하기" onPressEvent={openModal} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#11181C',
  },
  couponsContainer: {
    marginTop: 16,
  },
  couponItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
  },
  couponContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  couponText: {
    flex: 1,
    fontSize: 16,
    marginRight: 4,
    color: theme.colors.text,
    fontFamily: 'pretendard',
  },
  couponPrice: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})
