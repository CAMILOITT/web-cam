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

export default function ControlsCall({
  closeCall,
  videoOff,
  audioOff,
  microphoneOff,
}: IProps) {
  return (
    <div className={css.controls}>
      <BtnCall svg={MicrophoneIcon} eventClick={microphoneOff}  />
      <BtnCall svg={VideoIcon} eventClick={videoOff} />
      <BtnCall svg={AudioIcon} eventClick={audioOff} />
      <BtnCall svg={CallEndIcon} eventClick={closeCall} />
    </div>
  )
}
