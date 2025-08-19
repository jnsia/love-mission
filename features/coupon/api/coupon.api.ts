import { supabase } from '@/shared/lib/supabase/supabase'

export const issueCoupon = async (
  request: CouponIssueRequest,
): Promise<void> => {
  const { error } = await supabase.from('loveCoupons').insert(request)
  if (error) {
    console.error('Error issuing coupon:', error)
  }
}
