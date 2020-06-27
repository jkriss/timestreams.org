window.addEventListener('DOMContentLoaded', async () => {
  const requestUrl = './status'
  let posts = await TimeStreams.getBulk(requestUrl)
  posts = await Promise.all(posts.map(async p => {
    const type = p.headers.get('content-type')
    const date = new Date(p.headers.get('post-time'))
    const links = TimeStreams.parseLinkHeader(p.headers.get('link'))
    const permalink = links.self.url
    let body
    if (type.includes('text')) {
      body = await p.text()
    } else if (type.includes('image')) {
      const url = URL.createObjectURL(await p.blob())
      body = `<a href="${permalink}"><img src="${url}"></a>`
    }
    return { date, type, body, permalink }
  }))
  const el = document.querySelector('#status-feed')
  const h = posts.map(p => `
    <div class="status">
      <div class="content">${p.body}</div>
      <div class="date">
        <a href="${p.permalink}">${fecha.format(p.date, 'MMM D, YYYY hh:mm:ss a')}</a>
      </div>
    </div>
  `).join('')
  el.innerHTML = h
})
