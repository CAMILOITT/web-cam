import css from './Messages.module.css'

interface IProps {
  message: string
  hiddenMessage: boolean
  type: 'success' | 'error' | 'info'
}

export default function Messages({ message, hiddenMessage, type }: IProps) {
  return (
    <div
      className={`${css.message} ${hiddenMessage ? css.hiddenMessage : ''} ${
        css[type]
      }`}
    >
      {message}
    </div>
  )
}
