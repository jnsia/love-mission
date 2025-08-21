import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { Mission } from '@/features/mission/types/mission'
import { colors } from '@/shared/constants/Colors'
import Badge from '@/shared/components/Badge'
import Typography from '@/shared/components/Typography'

export default function MissionButton({
  mission,
  clickMission,
}: {
  mission: Mission
  clickMission: (mission: Mission) => void
}) {
  return (
    <TouchableOpacity
      style={mission.completed ? styles.completedItem : styles.item}
      onPress={() => clickMission(mission)}
    >
      <Badge type={mission.type} />
      <Typography
        variant="body"
        color={mission.completed ? "white" : "primary"}
        style={[styles.itemText, mission.completed && styles.completedItemText]}
        numberOfLines={1}
      >
        {mission.title}
      </Typography>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    marginBottom: 8,
  },
  completedItemText: {},
})
