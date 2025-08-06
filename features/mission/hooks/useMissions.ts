import { useState } from 'react'
import { Mission } from '../types/mission'
import { fetchMissions } from '../api/mission.api'
import { useFocusEffect } from 'expo-router'

export default function useMissions({ userId }: { userId: number }) {
  const [missions, setMissions] = useState<Mission[]>([])

  const getMissions = async () => {
    const missions = await fetchMissions(userId)
    if (!missions) {
      return
    }

    missions.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1,
    )

    setMissions(missions)
  }

  useFocusEffect(() => {
    getMissions()
  })

  return {
    missions,
    getMissions,
  }
}
