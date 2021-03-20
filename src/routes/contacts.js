/*
  Contact routes
*/

const express = require('express')
const auth = require('../middleware/auth')
const Contact = require('../models/contact')


const router = new express.Router()

router.post('/add' ,auth,async(req,res) =>{
   const user = req.user
   const contact = new Contact (req.body)
   
   try{
     const Contact = await contact.save()
     const id = contact._id
     user.notifyContacts.push(id)
     const user1 = await user.save()
     res.send({user1,Contact})
   } catch(e) {
         res.status(400).send()
   }

})

router.get('/',auth,async(req,res) => {
    const user = req.user
   
    try{
     const contactList = await getContacts(user)
     res.send(contactList)
      
    } catch(e) {

    }
})

const getContacts = async(user) => {
    const contactList = [] 
    for await(const contact of user.notifyContacts) {
        const contactListElement = await Contact.findById(contact._id)
        contactList.push(contactListElement) 
        console.log(contactList)
    }
    return contactList
}

module.exports = router