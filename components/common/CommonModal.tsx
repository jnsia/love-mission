import { View, Text, Modal, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import theme from '@/constants/Theme'
import { failedMission } from '@/types/mission'
import CancelButton from '../common/CancelButton'
import { fonts } from '@/constants/Fonts'

export default function CommonModal({
  isVisible,
  closeModal,
}: {
  isVisible: boolean
  closeModal: () => void
}) {
  return (
    <Modal animationType="fade" visible={isVisible} transparent={true} onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Common Modal</Text>
            <View style={styles.lostCoinInfo}>
              <Text style={styles.lostCoinInfoText}>Common Modal Body</Text>
              <Text style={styles.lostCoinInfoText}>Common Modal Content</Text>
            </View>
            <CancelButton text="확인" onPressEvent={closeModal} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: fonts.defaultBold,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'absolute',
    width: '90%',
    padding: 16,
    marginTop: 60,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTextStyle: {
    color: '#17191c',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  missionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
  },
  missionInfoText: {
    fontSize: 12,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  lostCoinInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  lostCoinInfoText: {
    fontSize: 14,
    fontFamily: fonts.defaultBold,
  },
  missionInfoSubText: {
    fontSize: 12,
    color: theme.colors.subText,
    fontFamily: fonts.default,
  },
  badge: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: fonts.default,
    fontSize: 10,
    color: theme.colors.text,
  },
})
