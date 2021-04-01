/*
  Hospital routes
*/


const express = require('express')
const auth = require('../middleware/auth')
const Hospital = require('../models/hospital')

const router = new express.Router()


//Add one Hospital
router.post('/addone' ,auth,async(req,res) =>{
   const user = req.user
   const hospital = new Hospital (req.body)
   
   try{
     await hospital.save()
     const id = hospital._id
     user.hospitals.push(id)
     const user1 = await user.save()
     res.send({user1,hospital})
   } catch(e) {
         res.status(400).send()
   }

})


//Add a list of hospitals
router.post('/add',auth,async(req,res) => {
    const user = req.user
    const hospitals = req.body

    try{
        for await(const hospital of hospitals ){
            console.log(hospital)
            const hospital1 = new Hospital(hospital)
            await hospital1.save()
            const id = hospital1._id
            user.hospitals.push(id)
            await user.save() 
          }

      res.send({user,hospitals})    
    } catch(e) {
      res.status(400).send() 
    }
})

//Get a list of hospitals
router.get('/',auth,async(req,res) => {
    const user = req.user
   
    try{
     const hospitalList = await getHospitals(user)
     res.send(hospitalList)
      
    } catch(e) {

    }
})

router.delete('/',auth,async(req,res) => {
  const id = req.query.id
  console.log(id)
  try{
    let lb = req.user.hospitals.length
    console.log(lb)
    req.user.hospitals = req.user.hospitals.filter((contact) => contact._id != id)
    let la = req.user.hospitals.length 
    if(lb === la) {
      res.status(404).send()
    }
    await req.user.save()
    res.send()
  } catch(e) {
      res.status(500).send()
  }
})

const getHospitals = async(user) => {
    const hospitalList = [] 
    for await(const hospital of user.hospitals) {
        const hospitalListElement = await Hospital.findById(hospital._id)
        hospitalList.push(hospitalListElement) 
        console.log(hospitalList)
    }
    return hospitalList
}

module.exports = router