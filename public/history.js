import { format } from 'fecha'

window.addEventListener('DOMContentLoaded', async () => {
  const messages = await TimeStreams.getMessages('/status')
  const el = document.querySelector('#status-feed')
  const h = messages.map(m => `
    <div class="status">
      <div class="content">${m.body}</div>
      <div class="date">
        <a href="${m.permalink}">${format(m.t, 'MMM D, YYYY hh:mm:ss a')}</a>
      </div>
    </div>
  `).join('')
  el.innerHTML = h
})
