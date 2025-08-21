export interface Mission {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  type: string
  successCoin: number
  failCoin: number
  createdAt: string
}

export interface FailedMission {
  id: number
  title: string
  date: string
  userId: number
  type: string
  coin: number
}

export interface MissionRegisterRequest {
  title: string
  description: string
  type: string
  successCoin: number
  failCoin: number
  userId: number
}
