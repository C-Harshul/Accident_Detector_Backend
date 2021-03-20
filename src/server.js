/*
Server starting point
*/

const express = require('express')
require('./db/mongoose')

const app = express()
const port = process.env.PORT||3000

app.use(express.json())

const userRoutes = require('./routes/user')
const contactRoutes = require('./routes/contacts')

app.use('/user',userRoutes)
app.use('/contact',contactRoutes)

app.listen(port,() => {
    console.log('Server on port' + port)
})