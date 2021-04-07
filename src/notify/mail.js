const nodemailer = require('nodemailer')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testharshul@gmail.com',
      pass: 'Abc@12345'
    }
  });



const mail = (message,mailIds,callback) => {
    console.log(mailIds)  
    if(mailIds.length !== 0) {
      var mailOptions = {
        from: 'testharshul@gmail.com',
        to: mailIds,
        subject: 'Message from App',
        text: message,
      };
      let i = 4
      while(i>0) {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
              callback(error,undefined);
               } else {
              callback(undefined,'Email sent: ' + info.response);
             }
           });
           i--;
      }
    } else {
      console.log('xxxxxxxxxxxxxxx')
      callback('No contacts added' , undefined)
    }
  }
  
  module.exports = mail