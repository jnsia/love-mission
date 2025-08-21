import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase/supabase'

interface SupabaseFilter {
  column: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in'
  value: any
}

interface UseSupabaseQueryOptions<T> {
  table: string
  select?: string
  filters?: SupabaseFilter[]
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
}

async function fetchSupabaseData<T>(options: UseSupabaseQueryOptions<T>): Promise<T[]> {
  const { table, select = '*', filters = [], orderBy, limit } = options

  let query = supabase.from(table).select(select)

  // 필터 적용
  filters.forEach(filter => {
    switch (filter.operator) {
      case 'eq':
        query = query.eq(filter.column, filter.value)
        break
      case 'neq':
        query = query.neq(filter.column, filter.value)
        break
      case 'gt':
        query = query.gt(filter.column, filter.value)
        break
      case 'gte':
        query = query.gte(filter.column, filter.value)
        break
      case 'lt':
        query = query.lt(filter.column, filter.value)
        break
      case 'lte':
        query = query.lte(filter.column, filter.value)
        break
      case 'like':
        query = query.like(filter.column, filter.value)
        break
      case 'ilike':
        query = query.ilike(filter.column, filter.value)
        break
      case 'in':
        query = query.in(filter.column, filter.value)
        break
    }
  })

  // 정렬 적용
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
  }

  // 제한 적용
  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export function useSupabaseQuery<T>(
  queryKey: any[],
  options: UseSupabaseQueryOptions<T>,
  queryOptions?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: () => fetchSupabaseData<T>(options),
    ...queryOptions,
  })
}