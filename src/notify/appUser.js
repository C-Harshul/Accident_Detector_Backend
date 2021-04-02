const firebase = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey.json')


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://driveguard-22dfb.firebaseio.com"
  });


const notifyAppUser = async (person,tokens) => {

   console.log(person,tokens)
    let payload = {
        notification : {
          title : 'SOS',
          body : person +"'s car has met with an accident",
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            message: 'Sample Push Message'
         
          },
        };
      var options = {
        priority : "high",
      }
      
      let i = 4
      while(i>0) {
        firebase.messaging().sendToDevice(tokens,payload,options)
        .then((response) => {
          console.log('Message sent successfully')
        }).catch((error) => {
          console.log(error)
        })
       i--; 
      }


}

module.exports = notifyAppUser