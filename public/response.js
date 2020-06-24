window.addEventListener('DOMContentLoaded', async () => {
  const url = document.querySelector('#timestream-url').innerHTML
  const res = await fetch(url)
  const lines = []
  lines.push(`HTTP/1.1 ${res.status} ${res.statusText}`)
  const includedHeaders = ['Date', 'Content-Type', 'Time-Streams-Version', 'Post-Time', 'Link']
  for (const name of includedHeaders) {
    lines.push(`${name}: ${res.headers.get(name)}`)
  }
  lines.push('')
  const body = await res.text()
  lines.push(body)
  document.querySelector('#response').innerText = lines.join('\n')
})
