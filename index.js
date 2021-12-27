const disp = document.querySelector("body")

let analyserNode, pcmData, stream, audioContext, mediaStreamAudioSourceNode
async function start() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  audioContext = new AudioContext();
  mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  analyserNode = audioContext.createAnalyser();
  pcmData = new Float32Array(analyserNode.fftSize);
  mediaStreamAudioSourceNode.connect(analyserNode);
  window.requestAnimationFrame(onFrame);
  document.body.removeChild(document.querySelector('#btn'))
}

let max = 0
let counter = 0
let cur_bright = 0

let sum = 0
let sum_counter = 0

const onFrame = () => {
  analyserNode.getFloatTimeDomainData(pcmData);
  let sumSquares = 0.0
  for (const amplitude of pcmData) { sumSquares += amplitude * amplitude; }
  const volume = sumSquares / pcmData.length

  if (sum_counter < 10000) {
    sum += volume
    sum_counter++
  }

  // max = Math.max(max, volume)
  max = sum / sum_counter

  let normalized_volume = (volume / max)
  cur_bright = cur_bright * 0.3 + normalized_volume * 0.7
  if (isNaN(cur_bright)) cur_bright = 0
  if (!isNaN(normalized_volume)) counter += (normalized_volume * 10)
  document.querySelector("#debug").innerHTML = `${max}<br>${volume}`

  document.body.style.background = `hsl(${Math.floor(counter) % 360},50%,${Math.floor(cur_bright * 30 + 20)}%)`

  window.requestAnimationFrame(onFrame);
}