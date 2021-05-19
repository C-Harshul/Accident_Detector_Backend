/*
  Contact routes
*/

const express = require("express");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Contact = require("../models/contact");
const User = require("../models/user");

const router = new express.Router();

//Add one contact
router.post("/addone", auth, async (req, res) => {
  const user = req.user;
 

   
  try {
    var id 
 
    if(req.body.appUser === undefined) {
      console.log(req.body)
      const contact = new Contact(req.body);
      console.log(contact)
      await contact.save();

     id = contact._id;
    }
    else {
      id = req.body.appUser
    }

    user.notifyContacts.push(id);
    const user1 = await user.save();
    res.send({ user1 });
  } catch (e) {
    res.status(500).send();
  }
});

//Add a list of contacts
router.post("/add", auth, async (req, res) => {
  const user = req.user;
  const contacts = req.body;

  try {
    for await (const contact of contacts) {
      const contact1 = new Contact(contact);
      await contact1.save();
      const id = contact1._id;
      user.notifyContacts.push(id);
      await user.save();
    }

    res.send({ user, contacts });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/addAppUser", auth, async (req, res) => {
  const ids = req.body.ids;
  const user = req.user;
  try {
    ids.forEach((id) => {
      user.notifyContacts.push(id.id);
    });
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

//Get the list of contacts
router.get("/", auth, async (req, res) => {
  const user = req.user;

  try {
    const contactList = await getContacts(user);
    res.send(contactList);
  } catch (e) {}
});

router.delete("/", auth, async (req, res) => {
  const id = req.query.id;
  console.log(id);
  try {
    let lb = req.user.notifyContacts.length;
    console.log(lb);
    req.user.notifyContacts = req.user.notifyContacts.filter(
      (contact) => contact._id != id
    );
    let la = req.user.notifyContacts.length;
    if (lb === la) {
      res.status(404).send();
    }
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

const getContacts = async (user) => {
  const contactList = [];
  for await (const contact of user.notifyContacts) {
    const contactListElement = await Contact.findById(contact._id);
    contactList.push(contactListElement);
    console.log(contactList);
  }
  return contactList;
};

module.exports = router;
