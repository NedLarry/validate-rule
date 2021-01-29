const express = require('express')
const routes = require('./routes')
const jsend = require('jsend')

const app = express()
app.use(express.json())
app.use(jsend.middleware)
app.use(routes)


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Port ${port} listening`)
})