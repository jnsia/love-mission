import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import theme from '@/constants/Theme'
import { fonts } from '@/constants/Fonts'

export default function GuideView({ texts }: { texts: string[] }) {
  return (
    <View style={styles.guideBox}>
      {texts.map((text) => (
        <Text key={text} style={styles.guideText}>
          {text}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  guideBox: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    marginBottom: 16,
  },
  guideText: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: fonts.defaultBold,
  },
})
