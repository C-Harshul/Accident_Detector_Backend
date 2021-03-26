/*
Server starting point
*/

const express = require('express')
const firebase = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')
require('./db/mongoose')


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://driveguard-22dfb.firebaseio.com"
});

const db = firebase.database()
const ref = db.ref("Accident")
ref.once("value",(snapshot) => {
    console.log(snapshot.val());
})

const app = express()
const port = process.env.PORT||3000

app.use(express.json())

const userRoutes = require('./routes/user')
const contactRoutes = require('./routes/contacts')
const hospitalRoutes = require('./routes/hospital')

app.use('/user',userRoutes)
app.use('/contact',contactRoutes)
app.use('/hospital',hospitalRoutes)

app.listen(port,() => {
    console.log('Server on port' + port)
})