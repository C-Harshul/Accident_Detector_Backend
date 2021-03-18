const express = require('express')
require('./db/mongoose')

const app = express()
const port = process.env.PORT||3000

app.use(express.json())

const userRoutes = require('./routes/users')

app.use('/users',userRoutes)

app.listen(port,() => {
    console.log('Server on port' + port)
})