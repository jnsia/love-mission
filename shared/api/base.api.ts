import { supabase } from '@/shared/lib/supabase/supabase'
import { ErrorHandler } from '@/shared/utils/errorHandler'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: string
  ascending?: boolean
}

export class BaseApi {
  protected tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  // 기본 CRUD 메서드들
  protected async findById<T>(id: string | number): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: ErrorHandler.getErrorMessage(error) 
      }
    }
  }

  protected async findMany<T>(
    filters: Record<string, any> = {},
    select = '*',
    options: PaginationOptions = {}
  ): Promise<ApiResponse<T[]>> {
    try {
      let query = supabase.from(this.tableName).select(select)

      // 필터 적용
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      // 정렬 적용
      if (options.orderBy) {
        query = query.order(options.orderBy, { 
          ascending: options.ascending ?? true 
        })
      }

      // 페이지네이션 적용
      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.page && options.limit) {
        const offset = (options.page - 1) * options.limit
        query = query.range(offset, offset + options.limit - 1)
      }

      const { data, error } = await query

      if (error) throw error
      
      return { data: data || [], error: null }
    } catch (error) {
      return { 
        data: null, 
        error: ErrorHandler.getErrorMessage(error) 
      }
    }
  }

  protected async create<T, K>(payload: Partial<K>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: ErrorHandler.getErrorMessage(error) 
      }
    }
  }

  protected async update<T>(
    id: string | number, 
    payload: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: ErrorHandler.getErrorMessage(error) 
      }
    }
  }

  protected async delete(id: string | number): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      return { data: null, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: ErrorHandler.getErrorMessage(error) 
      }
    }
  }

  protected async deleteMany(ids: (string | number)[]): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .in('id', ids)

      if (error) throw error
      
      return { data: null, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: ErrorHandler.getErrorMessage(error) 
      }
    }
  }

  // RPC 호출을 위한 헬퍼 메서드
  protected async callRpc<T>(
    functionName: string, 
    params: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.rpc(functionName, params)

      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: ErrorHandler.getErrorMessage(error) 
      }
    }
  }
}