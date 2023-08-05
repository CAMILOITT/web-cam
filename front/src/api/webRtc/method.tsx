export function handleConnectionStateChange(this: RTCPeerConnection, e: Event) {
  console.log('Connection state change', e)
  console.log(this)
}
export function handleIceConnectionStateChange(
  this: RTCPeerConnection,
  e: Event
) {
  console.log('ice connection state change', e)
}

export function handleIceCandidate(
  this: RTCPeerConnection,
  e: RTCPeerConnectionIceEvent
) {
  console.log('buscando candidatos')
  console.log('ice candidate', e)
  console.log(e.candidate)
  const iceCandidate = e.candidate
  if (!this || !iceCandidate) return

  this.addIceCandidate(iceCandidate).then(() => console.log('candidate added'))
}

export function handleIceCandidateError(this: RTCPeerConnection, e: Event) {
  console.log('ice candidate error', e)
}

export function handleNegotiationNeeded(this: RTCPeerConnection, e: Event) {
  console.log('negotiation needed', e)
}
export function handleSignalingStateChange(this: RTCPeerConnection, e: Event) {
  console.log('signaling state change', e)
}
export function handleIceGatheringStateChange(
  this: RTCPeerConnection,
  e: Event
) {
  console.log('ice gathering state change', e)
}
// obteniendo datos del otro peer
export function handleTrack(this: RTCPeerConnection, e: Event) {
  console.log(e)
}
