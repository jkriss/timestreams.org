window.addEventListener('DOMContentLoaded', async () => {
  for (const i of [1,2]) {
    const url = document.querySelector(`#req${i}`).innerText
    const res = await fetch(url)
    document.querySelector(`#res${i}`).innerText = await res.text()
  }
})
