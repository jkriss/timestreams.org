const fs = require('fs')
const express = require('express')
const compression = require('compression')
const { reader } = require('time-streams')

const app = express()

const distDir = 'dist'

app.use(compression())

app.use(reader('public'))

// append .html suffix for cleaner urls
app.use((req, res, next) => {
  if (req.path.indexOf('.') === -1) {
    var file = distDir + req.path + '.html'
    fs.exists(file, (exists) => {
      if (exists) req.url += '.html'
      next()
    })
  } else {
    next()
  }
})

app.use(express.static(distDir))

const listener = app.listen(process.env.PORT, () => {
  console.log("Listening at http://localhost:" + listener.address().port);
});
