const button = document.getElementsByTagName('button')[0]
const video = document.getElementsByTagName('img')
const canvas = document.createElement('canvas')
const player = document.getElementById('player')

button.addEventListener('click', () => {
  canvas.width = player.offsetWidth
  canvas.height = player.offsetHeight
  const ctx = canvas.getContext('2d')
  console.log(ctx)
  console.log(canvas)
  console.log(video)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
})
