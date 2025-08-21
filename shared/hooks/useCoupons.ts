import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Coupon } from '@/features/coupon/types/coupon'
import { queryKeys } from '@/shared/lib/react-query/queryClient'
import { ErrorHandler } from '@/shared/utils/errorHandler'
import { couponApi } from '@/features/coupon/api/coupon.api'

// 사용자 쿠폰 목록 조회
const fetchUserCoupons = async (userId: string): Promise<Coupon[]> => {
  const result = await couponApi.fetchUserCoupons(userId)
  if (result.error) throw new Error(result.error)
  return result.data || []
}

// 사용 가능한 쿠폰들만 조회
const fetchAvailableCoupons = async (userId: string): Promise<Coupon[]> => {
  const result = await couponApi.fetchAvailableCoupons(userId)
  if (result.error) throw new Error(result.error)
  return result.data || []
}

// 사용된 쿠폰들만 조회
const fetchUsedCoupons = async (userId: string): Promise<Coupon[]> => {
  const result = await couponApi.fetchUsedCoupons(userId)
  if (result.error) throw new Error(result.error)
  return result.data || []
}

// 발급한 쿠폰 목록 조회
const fetchIssuedCoupons = async (issuerId: string): Promise<Coupon[]> => {
  const result = await couponApi.fetchIssuedCoupons(issuerId)
  if (result.error) throw new Error(result.error)
  return result.data || []
}

// 사용자 쿠폰 조회 훅
export const useUserCoupons = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.list('user'),
    queryFn: () => fetchUserCoupons(userId!),
    enabled: !!userId,
  })
}

// 사용 가능한 쿠폰 조회 훅
export const useAvailableCoupons = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.list('available'),
    queryFn: () => fetchAvailableCoupons(userId!),
    enabled: !!userId,
  })
}

// 사용된 쿠폰 조회 훅
export const useUsedCoupons = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.list('used'),
    queryFn: () => fetchUsedCoupons(userId!),
    enabled: !!userId,
  })
}

// 발급한 쿠폰 조회 훅
export const useIssuedCoupons = (issuerId?: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.list('issued'),
    queryFn: () => fetchIssuedCoupons(issuerId!),
    enabled: !!issuerId,
  })
}

// 쿠폰 발급 훅
export const useIssueCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: any) => {
      const result = await couponApi.issueCoupon(request)
      if (result.error || !result.data) {
        throw new Error(result.error || 'Failed to issue coupon')
      }
      return result.data
    },
    onSuccess: () => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all() })
    },
    onError: (error) => {
      ErrorHandler.show(error, '쿠폰 발급')
    },
  })
}

// 쿠폰 사용 훅
export const useUseCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ couponId, userId }: { couponId: string; userId: string }) => {
      const result = await couponApi.useCoupon(couponId, userId)
      if (result.error || !result.data) {
        throw new Error(result.error || 'Failed to use coupon')
      }
      return result.data
    },
    onSuccess: () => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all() })
    },
    onError: (error) => {
      ErrorHandler.show(error, '쿠폰 사용')
    },
  })
}

// 쿠폰 삭제 훅
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ couponId, issuerId }: { couponId: string; issuerId: string }) => {
      const result = await couponApi.deleteCoupon(couponId, issuerId)
      if (result.error) {
        throw new Error(result.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all() })
    },
    onError: (error) => {
      ErrorHandler.show(error, '쿠폰 삭제')
    },
  })
}

// 쿠폰 통계 조회 훅
export const useCouponStats = (userId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.coupons.all(), 'stats', userId],
    queryFn: async () => {
      if (!userId) return null
      const result = await couponApi.getCouponStats(userId)
      if (result.error) throw new Error(result.error)
      return result.data
    },
    enabled: !!userId,
  })
}