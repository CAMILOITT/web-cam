interface IProps {
  on: boolean
}

export default function VideoIcon({ on }: IProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // class="icon icon-tabler icon-tabler-video"
      width="44"
      height="44"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#2c3e50"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z"
        stroke="white"
      />
      <path
        d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
        stroke="white"
      />
      {on && <path d="M3 3l18 18" stroke="white" />}
    </svg>
  )
}
