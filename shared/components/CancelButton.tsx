import React from 'react'
import Button from './Button'

export default function CancelButton({
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
      style={{ flex: 1 }}
    />
  )
}
