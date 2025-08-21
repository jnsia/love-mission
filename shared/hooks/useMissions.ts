import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mission, FailedMission } from '@/features/mission/types/mission'
import { queryKeys } from '@/shared/lib/react-query/queryClient'
import { ErrorHandler } from '@/shared/utils/errorHandler'
import { missionApi } from '@/features/mission/api/mission.api'

// 미션 목록 조회
const fetchMissions = async (userId: string): Promise<Mission[]> => {
  const result = await missionApi.fetchMissions(userId)
  if (result.error) throw new Error(result.error)
  return result.data || []
}

// 실패한 미션 목록 조회
const fetchFailedMissions = async (userId: string): Promise<FailedMission[]> => {
  const result = await missionApi.fetchFailedMissions(userId)
  if (result.error) throw new Error(result.error)
  return result.data || []
}

// 완료된 미션 목록 조회
const fetchCompletedMissions = async (userId: string): Promise<Mission[]> => {
  const result = await missionApi.fetchCompletedMissions(userId)
  if (result.error) throw new Error(result.error)
  return result.data || []
}

// 미션 목록 조회 훅
export const useMissions = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.missions.list({ userId }),
    queryFn: () => fetchMissions(userId!),
    enabled: !!userId,
  })
}

// 실패한 미션 조회 훅
export const useFailedMissions = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.missions.failed(),
    queryFn: () => fetchFailedMissions(userId!),
    enabled: !!userId,
  })
}

// 완료된 미션 조회 훅
export const useCompletedMissions = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.missions.list({ userId, completed: true }),
    queryFn: () => fetchCompletedMissions(userId!),
    enabled: !!userId,
  })
}

// 미션 완료 훅
export const useCompleteMission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ missionId, userId }: { missionId: string; userId: string }) => {
      const result = await missionApi.completeMission(missionId, userId)
      if (result.error || !result.data) {
        throw new Error(result.error || 'Failed to complete mission')
      }
      return result.data
    },
    onSuccess: (_, variables) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.missions.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
    },
    onError: (error) => {
      ErrorHandler.show(error, '미션 완료')
    },
  })
}

// 실패한 미션 삭제 훅
export const useDeleteFailedMissions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (missionIds: number[]) => {
      const result = await missionApi.deleteFailedMissions(missionIds)
      if (result.error) {
        throw new Error(result.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.missions.failed() })
    },
    onError: (error) => {
      ErrorHandler.show(error, '실패한 미션 삭제')
    },
  })
}

// 미션 삭제 훅
export const useDeleteMission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ missionId, userId }: { missionId: string; userId: string }) => {
      const result = await missionApi.deleteMission(missionId)
      if (result.error) {
        throw new Error(result.error)
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.missions.list({ userId: variables.userId }) 
      })
    },
    onError: (error) => {
      ErrorHandler.show(error, '미션 삭제')
    },
  })
}