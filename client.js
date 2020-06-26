function createObjects (acc, p) {
  // rel="next" => 1: rel 2: next
  var m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/)
  if (m) acc[m[1]] = m[2]
  return acc
}

function parseLink(link) {
  try {
    var m         =  link.match(/<?([^>]*)>(.*)/)
      , linkUrl   =  m[1]
      , parts     =  m[2].split(';')
    parts.shift()
    var info = parts
      .reduce(createObjects, {})
    info.url = linkUrl
    return info
  } catch (e) {
    return null
  }
}

function parseLinkHeader(header) {
  if (!header) return null
  return header.split(/,\s*</)
   .map(parseLink)
}

async function getMessage(url) {
  const res = await fetch(url)
  if (res.ok) {
    let data
    let url
    const type = res.headers.get('content-type')
    const links = parseLinkHeader(res.headers.get('link'))
    const permalink = links.find(link => link.rel === 'self').url
    if (!links) throw new Error('No valid Link header')
    if (!type) throw new Error('content-type header required')
    if (type.includes('text/plain')) {
      data = await res.text()
    } else if (type.includes('json')) {
      data = await res.json()
    } else if (type.includes('image')) {
      url = URL.createObjectURL(await res.blob())
      data = `<a href="${permalink}"><img src="${url}"></a>`
    }
    const date = res.headers.get('post-time')
    return { body: data, contentType: type, date, t: new Date(date), url, links, permalink }
  } else {
    console.warn(res.status)
  }
}

async function getMessages(streamUrl, max=20) {
  const messages = []
  let m
  let url = streamUrl
  do {
    m = await getMessage(url)
    if (m) {
      messages.push(m)
      const prev = m.links.find(link => link.rel === 'previous')
      const urlStr = prev ? prev.url : null
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
