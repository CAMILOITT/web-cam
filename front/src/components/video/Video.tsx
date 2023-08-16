import { forwardRef, useState } from 'react'
import css from './Video.module.css'

interface VideoProps {
  typeConnection: 'local' | 'remote'
  userName: string
}

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ userName, typeConnection }: VideoProps, ref) => {
    const [callFocus, setCallFocus] = useState<'local' | 'remote'>('local')

    function changeCallFocus(e: React.MouseEvent<HTMLDivElement>) {
      console.log('click')
      const focus = e.currentTarget.dataset.callId
      if (focus === 'remote') {
        setCallFocus('local')
      } else {
        setCallFocus('remote')
      }
    }

    return (
      <div
        className={`${css.call} ${
          callFocus === typeConnection ? css.callFocus : css.callNotFocus
        }`}
        data-call-id="remote"
        onDoubleClick={changeCallFocus}
      >
        <video ref={ref} className={css.video} muted autoPlay></video>
        <p className={css.name}> {userName}</p>
      </div>
    )
  }
)
