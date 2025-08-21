import React from 'react'
import Button from './Button'

export default function RegistButton({
  text,
  onPressEvent,
}: {
  text: string
  onPressEvent: () => void
}) {
  return (
    <Button 
      text={text} 
      variant="secondary" 
      onPress={onPressEvent}
    />
  )
}
