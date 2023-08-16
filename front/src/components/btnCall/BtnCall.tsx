import { useState } from 'react'

interface IProps {
  svg: React.FC<{ on: boolean }>
  eventClick?: () => void
}

export default function BtnCall({ svg: Svg, eventClick }: IProps) {
  const [isOn, setIsOn] = useState(false)

  function handleOnClick() {
    setIsOn(prev => !prev)
    if (!eventClick) return
    eventClick()
  }

  return (
    <button onClick={handleOnClick}>
      <Svg on={isOn} />
    </button>
  )
}
