import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/constants/Theme'
import { colors } from '@/constants/Colors'
import { fonts } from '@/constants/Fonts'

export default function DeleteButton({
  text,
  onPressEvent,
}: {
  text: string
  onPressEvent: () => void
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPressEvent}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
    // marginBottom: 10,
    borderColor: colors.accent,
  },
  buttonText: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.accent,
  },
})
