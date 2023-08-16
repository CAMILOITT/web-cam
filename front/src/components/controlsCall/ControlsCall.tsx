import AudioIcon from '../../assets/icons/AudioIcon'
import CallEndIcon from '../../assets/icons/CallEndIcon'
import MicrophoneIcon from '../../assets/icons/MicrophoneIcon'
import VideoIcon from '../../assets/icons/VideoIcon'
import BtnCall from '../btnCall/BtnCall'
import css from './ControlsCall.module.css'

interface IProps {
  microphoneOff?: () => void
  videoOff?: () => void
  audioOff?: () => void
  closeCall?: () => void
}

export default function ControlsCall({ closeCall }: IProps) {
  return (
    <div className={css.controls}>
      <BtnCall svg={MicrophoneIcon} />
      <BtnCall svg={VideoIcon} />
      <BtnCall svg={AudioIcon} />
      <BtnCall svg={CallEndIcon} eventClick={closeCall} />
    </div>
  )
}
