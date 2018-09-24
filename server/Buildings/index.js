const express = require('express'),
    router = express.Router(),
    Storage = require('../Storage')


router.get("/direcctions",(req,res) => {
    //get usario
    Storage.getData('data')
           .then((users)=>{
            res.json(users)
           }).catch((err)=>{
            res.sendStatus(500).json(err)
           })
})



module.exports = router;