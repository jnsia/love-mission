import { BaseApi, ApiResponse } from '@/shared/api/base.api'
import { Coupon, CouponIssueRequest } from '../types/coupon'
import { supabase } from '@/shared/lib/supabase/supabase'

class CouponApi extends BaseApi {
  constructor() {
    super('loveCoupons')
  }

  // 쿠폰 발급
  async issueCoupon(request: CouponIssueRequest): Promise<ApiResponse<Coupon>> {
    return this.create<Coupon, CouponIssueRequest>({
      ...request,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  // 사용자의 쿠폰 목록 조회
  async fetchUserCoupons(userId: string): Promise<ApiResponse<Coupon[]>> {
    return this.findMany<Coupon>({ userId }, '*', {
      orderBy: 'created_at',
      ascending: false
    })
  }

  // 사용자가 발급한 쿠폰 목록 조회 (연인에게 준 쿠폰들)
  async fetchIssuedCoupons(issuerId: string): Promise<ApiResponse<Coupon[]>> {
    return this.findMany<Coupon>({ issuerId }, '*', {
      orderBy: 'created_at',
      ascending: false
    })
  }

  // 사용 가능한 쿠폰들만 조회
  async fetchAvailableCoupons(userId: string): Promise<ApiResponse<Coupon[]>> {
    try {
      const { data, error } = await supabase
        .from('loveCoupons')
        .select('*')
        .eq('userId', userId)
        .eq('used', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch available coupons'
      }
    }
  }

  // 사용된 쿠폰들만 조회
  async fetchUsedCoupons(userId: string): Promise<ApiResponse<Coupon[]>> {
    try {
      const { data, error } = await supabase
        .from('loveCoupons')
        .select('*')
        .eq('userId', userId)
        .eq('used', true)
        .order('usedAt', { ascending: false })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch used coupons'
      }
    }
  }

  // 단일 쿠폰 조회
  async fetchCoupon(id: string): Promise<ApiResponse<Coupon>> {
    return this.findById<Coupon>(id)
  }

  // 쿠폰 사용
  async useCoupon(id: string, userId: string): Promise<ApiResponse<Coupon>> {
    try {
      const { data, error } = await supabase
        .from('loveCoupons')
        .update({ 
          used: true, 
          usedAt: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('userId', userId) // 본인 쿠폰만 사용 가능
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to use coupon'
      }
    }
  }

  // 쿠폰 삭제 (발급자만 가능)
  async deleteCoupon(id: string, issuerId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('loveCoupons')
        .delete()
        .eq('id', id)
        .eq('issuerId', issuerId) // 발급자만 삭제 가능

      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to delete coupon'
      }
    }
  }

  // 쿠폰 정보 수정 (발급자만 가능)
  async updateCoupon(
    id: string, 
    issuerId: string, 
    data: Partial<Coupon>
  ): Promise<ApiResponse<Coupon>> {
    try {
      const { data: result, error } = await supabase
        .from('loveCoupons')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('issuerId', issuerId) // 발급자만 수정 가능
        .select()
        .single()

      if (error) throw error

      return { data: result, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update coupon'
      }
    }
  }

  // 만료된 쿠폰들 조회
  async fetchExpiredCoupons(userId: string): Promise<ApiResponse<Coupon[]>> {
    try {
      const currentDate = new Date().toISOString()
      const { data, error } = await supabase
        .from('loveCoupons')
        .select('*')
        .eq('userId', userId)
        .lt('expiresAt', currentDate)
        .order('expiresAt', { ascending: false })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch expired coupons'
      }
    }
  }

  // 쿠폰 통계 조회
  async getCouponStats(userId: string): Promise<ApiResponse<{
    total: number
    used: number
    available: number
    expired: number
  }>> {
    try {
      const [totalResult, usedResult, expiredResult] = await Promise.all([
        this.fetchUserCoupons(userId),
        this.fetchUsedCoupons(userId),
        this.fetchExpiredCoupons(userId)
      ])

      if (totalResult.error || usedResult.error || expiredResult.error) {
        throw new Error('Failed to fetch coupon statistics')
      }

      const total = totalResult.data?.length || 0
      const used = usedResult.data?.length || 0
      const expired = expiredResult.data?.length || 0
      const available = total - used - expired

      return {
        data: { total, used, available, expired },
        error: null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get coupon stats'
      }
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const couponApi = new CouponApi()

// 기존 함수를 호환성을 위해 유지 (deprecated)
export const issueCoupon = async (request: CouponIssueRequest): Promise<void> => {
  await couponApi.issueCoupon(request)
}
