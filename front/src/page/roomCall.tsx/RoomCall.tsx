import Answer from '../../components/video/Answer'
import css from './RoomCall.module.css'

interface IProps {}

export default function RoomCall({}: IProps) {
  return (
    <main className={css.room}>
      <Answer />
    </main>
  )
}
