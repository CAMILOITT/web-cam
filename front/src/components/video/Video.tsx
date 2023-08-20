import { forwardRef } from 'react'
import css from './Video.module.css'
import { statusVideo } from '../../types/video/type'

interface VideoProps {
  typeConnection: statusVideo
  userName: string
  listAttributes?: { autoPlay?: boolean; muted?: boolean; controls?: boolean }
  hiddenVideo?: boolean
  focusVideo?: statusVideo
  setFocusVideo?: React.Dispatch<React.SetStateAction<statusVideo>>
}

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      userName,
      typeConnection,
      listAttributes,
      hiddenVideo,
      focusVideo,
      setFocusVideo,
    }: VideoProps,
    ref
  ) => {
    function changeCallFocus() {
      if (!setFocusVideo || !focusVideo) return
      setFocusVideo(prev => (prev === 'local' ? 'remote' : 'local'))
    }

    return (
      <div
        className={`${css.call} ${
          typeConnection === focusVideo ? css.callFocus : css.callNotFocus
        }`}
        onDoubleClick={changeCallFocus}
      >
        <div className={css.img} ></div>
        <video
          ref={ref}
          className={css.video}
          {...listAttributes}
          style={hiddenVideo ? { display: 'none' } : undefined}
        ></video>
        <p className={`${css.name} ${hiddenVideo ? css.nameCenter : ''} `}>
          {' '}
          {userName}
        </p>
      </div>
    )
  }
)
