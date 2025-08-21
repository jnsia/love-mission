import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '@/features/user/types/user.type'
import { queryKeys } from '@/shared/lib/react-query/queryClient'
import { ErrorHandler } from '@/shared/utils/errorHandler'
import { userApi } from '@/features/user/api/user.api'
import { authApi } from '@/features/user/api/auth.api'

// 현재 인증된 사용자 정보 가져오기
const fetchCurrentUser = async (): Promise<User | null> => {
  const result = await userApi.fetchCurrentUser()
  if (result.error) {
    throw new Error(result.error)
  }
  return result.data
}

// 사용자 정보 새로고침
const refreshUserData = async (userId: string): Promise<User> => {
  const result = await userApi.fetchUserById(userId)
  if (result.error || !result.data) {
    throw new Error(result.error || 'User not found')
  }
  return result.data
}

// 현재 사용자 정보 조회 훅
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

// 사용자 정보 새로고침 훅
export const useRefreshUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: refreshUserData,
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(queryKeys.auth.user(), data)
    },
    onError: (error) => {
      ErrorHandler.show(error, '사용자 정보 새로고침')
    },
  })
}

// 로그아웃 훅
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const result = await authApi.logout()
      if (result.error) {
        throw new Error(result.error)
      }
    },
    onSuccess: () => {
      // 모든 쿼리 캐시 클리어
      queryClient.clear()
    },
    onError: (error) => {
      ErrorHandler.show(error, '로그아웃')
    },
  })
}

// 코인 업데이트 훅
export const useUpdateUserCoin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, coinChange }: { userId: string; coinChange: number }) => {
      const result = await userApi.adjustCoin(userId, coinChange)
      if (result.error || !result.data) {
        throw new Error(result.error || 'Failed to update coin')
      }
      return result.data
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(queryKeys.auth.user(), data)
    },
    onError: (error) => {
      ErrorHandler.show(error, '코인 업데이트')
    },
  })
}