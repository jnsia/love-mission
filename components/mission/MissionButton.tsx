import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/constants/Theme'
import { mission } from '@/types/mission'
import Badge from '../common/Badge'
import { colors } from '@/constants/Colors'
import { fonts } from '@/constants/Fonts'

export default function MissionButton({
  mission,
  clickMission,
}: {
  mission: mission
  clickMission: (mission: mission) => void
}) {
  return (
    <TouchableOpacity
      style={mission.completed ? styles.completedItem : styles.item}
      onPress={() => clickMission(mission)}
    >
      <Badge type={mission.type} />
      <Text
        style={mission.completed ? styles.completedItemText : styles.itemText}
        numberOfLines={1}
      >
        {mission.title}
      </Text>
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
    fontSize: 16,
    flex: 1,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    marginBottom: 8,
  },
  completedItemText: {
    fontSize: 16,
    color: 'white',
    fontFamily: fonts.default,
  },
})
