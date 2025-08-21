import React from 'react'
import Button from './Button'

export default function CloseButton({
  text,
  onPressEvent,
}: {
  text: string
  onPressEvent: () => void
}) {
  return (
    <Button 
      text={text} 
      variant="cancel" 
      onPress={onPressEvent}
    />
  )
}
