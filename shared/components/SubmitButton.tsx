import React from 'react'
import Button from './Button'

export default function SubmitButton({
  text,
  onPressEvent,
}: {
  text: string
  onPressEvent: () => void
}) {
  return (
    <Button 
      text={text} 
      variant="primary" 
      onPress={onPressEvent}
      style={{ flex: 1 }}
    />
  )
}
