import React from 'react'
import Button from './Button'

export default function DeleteButton({
  text,
  onPressEvent,
}: {
  text: string
  onPressEvent: () => void
}) {
  return (
    <Button 
      text={text} 
      variant="danger" 
      onPress={onPressEvent}
    />
  )
}
