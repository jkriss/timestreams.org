import { getMessages } from './client'
import { format } from 'fecha'

window.addEventListener('DOMContentLoaded', async () => {
  const messages = await getMessages('/status')
  const el = document.querySelector('#status-feed')
  const h = messages.map(m => `
    <div>
      <div class="content">${m.body}</div>
      <div class="date">${format(m.t, 'MMM D, YYYY hh:mm:ss a')}</div>
    </div>
  `).join('')
  el.innerHTML = h
})
