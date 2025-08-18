interface Coupon {
  id: number
  name: string
  description: string
  price: number
}

interface CouponIssueRequest {
  name: string
  description: string
  price: number
  userId: number
}
