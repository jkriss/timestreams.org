const parseLinkHeader = require('parse-link-header')

async function getMessage(url) {
  const res = await fetch(url)
  if (res.ok) {
    let data
    let url
    const type = res.headers.get('content-type')
    const links = parseLinkHeader(res.headers.get('link'))
    if (!type) throw new Error('content-type header required')
    if (type.includes('text/plain')) {
      data = await res.text()
    } else if (type.includes('json')) {
      data = await res.json()
    } else if (type.includes('image')) {
      const url = URL.createObjectURL(await res.blob())
      data = `<img src="${url}">`
    }
    const date = res.headers.get('date')
    return { body: data, contentType: type, date, t: new Date(date), url, links }
  } else {
    console.warn(res.status)
  }
}

export async function getMessages(streamUrl, max=20) {
  const messages = []
  let m
  let url = streamUrl
  do {
    m = await getMessage(url)
    if (m) {
      messages.push(m)
      const urlStr = m.links.previous ? m.links.previous.url : null
      if (streamUrl.match(/^http/)) {
        url = urlStr && new URL(urlStr, streamUrl)
      } else {
        url = urlStr
      }
    }
  } while (messages.length < max && m && url)
  return messages
}

window.TimeStreams = {
  getMessages
}
