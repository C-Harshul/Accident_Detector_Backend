/*
  Hospital routes
*/


const express = require('express')
const auth = require('../middleware/auth')
const Hospital = require('../models/hospital')

const router = new express.Router()

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


router.get('/',auth,async(req,res) => {
    const user = req.user
   
    try{
     const hospitalList = await getHospitals(user)
     res.send(hospitalList)
      
    } catch(e) {

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