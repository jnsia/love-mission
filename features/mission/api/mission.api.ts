import { BaseApi, ApiResponse } from '@/shared/api/base.api'
import { Mission, MissionRegisterRequest, FailedMission } from '../types/mission'
import { supabase } from '@/shared/lib/supabase/supabase'

class MissionApi extends BaseApi {
  constructor() {
    super('missions')
  }

  // 미션 목록 조회
  async fetchMissions(userId: string): Promise<ApiResponse<Mission[]>> {
    return this.findMany<Mission>({ userId }, '*', {
      orderBy: 'created_at',
      ascending: false
    })
  }

  // 완료된 미션 목록 조회
  async fetchCompletedMissions(userId: string): Promise<ApiResponse<Mission[]>> {
    return this.findMany<Mission>({ userId, completed: true }, '*', {
      orderBy: 'updated_at',
      ascending: false
    })
  }

  // 단일 미션 조회
  async fetchMission(id: string): Promise<ApiResponse<Mission>> {
    return this.findById<Mission>(id)
  }

  // 미션 등록
  async createMission(request: MissionRegisterRequest): Promise<ApiResponse<Mission>> {
    return this.create<Mission, MissionRegisterRequest>(request)
  }

  // 미션 완료
  async completeMission(id: string, userId: string): Promise<ApiResponse<Mission>> {
    return this.update<Mission>(id, {
      completed: true,
      updated_at: new Date().toISOString()
    })
  }

  // 미션 삭제
  async deleteMission(id: string): Promise<ApiResponse<void>> {
    return this.delete(id)
  }

  // 미션 업데이트
  async updateMission(id: string, data: Partial<Mission>): Promise<ApiResponse<Mission>> {
    return this.update<Mission>(id, {
      ...data,
      updated_at: new Date().toISOString()
    })
  }

  // 실패한 미션 목록 조회
  async fetchFailedMissions(userId: string): Promise<ApiResponse<FailedMission[]>> {
    try {
      const { data, error } = await supabase
        .from('failedMissions')
        .select('*')
        .eq('userId', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 실패한 미션들 삭제
  async deleteFailedMissions(ids: number[]): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('failedMissions')
        .delete()
        .in('id', ids)

      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 스케줄된 미션 목록 조회
  async fetchScheduledMissions(userId: string): Promise<ApiResponse<Mission[]>> {
    try {
      const { data, error } = await supabase
        .from('scheduledMissions')
        .select('*')
        .eq('userId', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 스케줄된 미션 등록
  async createScheduledMission(request: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('scheduledMissions')
        .insert(request)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 스케줄된 미션 삭제
  async deleteScheduledMission(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('scheduledMissions')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const missionApi = new MissionApi()

// 기존 함수들을 호환성을 위해 유지 (deprecated)
export const fetchMissions = async (userId: number): Promise<Mission[] | null> => {
  const result = await missionApi.fetchMissions(String(userId))
  return result.data
}

export const registerMission = async (request: MissionRegisterRequest) => {
  await missionApi.createMission(request)
}
