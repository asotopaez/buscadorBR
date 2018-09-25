const express = require('express'),
    router = express.Router(),
    Storage = require('../Storage')



// API GET para realizar la busqueda de bienes raicestend
router.get("/filters",(req,res) => {

    // Variables obtenidas del metodo GET
    let show_all = req.query.show_all == undefined ? true : req.query.show_all;
    let city = req.query.city;
    let types = req.query.types;
    let range_prices = req.query.range_prices
    let objfind = {}


    if(city){
      objfind['Ciudad'] = city
      show_all = false
    }

    if(types){
      objfind['Tipo'] = types
      show_all = false
    }

    if(range_prices){
      let price_one = range_prices.split(";")[0];
      let price_two = range_prices.split(";")[1];
      objfind['Precio'] = {"price_one":parseInt(price_one) , "price_two":parseInt(price_two)}
      show_all = false
    }

    // Funcion para filtrar las busquedas 
    var dataFilters = (data,objfind,cb)=> {
      var buildkeys = objfind
      let filterBuilding = (building)=> {
          let price = parseInt(building['Precio'].replace('$','').replace(',','').replace('.',''))
          if (buildkeys['Ciudad']&&buildkeys['Tipo']&&buildkeys['Precio']){
            if (price >= buildkeys['Precio']['price_one'] && price <= buildkeys['Precio']['price_two'] && building['Ciudad'] === buildkeys['Ciudad'] && building['Tipo'] === buildkeys['Tipo']){
              return true
            }else{
              return false
            }
          }else if(buildkeys['Precio']&&buildkeys['Ciudad']){
            if (price >= buildkeys['Precio']['price_one'] && price <= buildkeys['Precio']['price_two'] && building['Ciudad'] === buildkeys['Ciudad']){
              return true
            }else{
              return false
            }
          }else if (buildkeys['Precio']&&buildkeys['Tipo']){
            if (price >= buildkeys['Precio']['price_one'] && price <= buildkeys['Precio']['price_two'] && building['Tipo'] === buildkeys['Tipo']){
              return true
            }else{
              return false
            }
          }else if (buildkeys['Precio']){
            if (price >= buildkeys['Precio']['price_one'] && price <= buildkeys['Precio']['price_two']){
              return true
            }else{
              return false
            }
          }else if (buildkeys['Tipo']&&buildkeys['Ciudad']){
            if (building['Ciudad'] === buildkeys['Ciudad'] && building['Tipo'] === buildkeys['Tipo']){
              return true
            }else{
              return false
            }
          }else if (buildkeys['Tipo']){
            if (building['Tipo'] === buildkeys['Tipo']){
              return true
            }else{
              return false
            }
          }else if(buildkeys['Ciudad']){
            if (building['Ciudad'] === buildkeys['Ciudad']){
              return true
            }else{
              return false
            }
          }else{
            return false
          }
        }

      let filters = data.filter(filterBuilding);
      cb(filters)
    }


    // Busqueda de informacion en el archivo data
    Storage.getData('data')
           .then((buildings)=>{
            if(show_all){
              res.json(buildings)
            }else{
              dataFilters(buildings,objfind,(result)=>{
                res.json(result)
              })
            }
           }).catch((err)=>{
            res.sendStatus(500).json(err)
           })
})

// API GET para llenar select en Frontend
router.get("/fillfilters",(req,res) => {
    // Funcion para obteer los valores unicos del las llaves Ciudad y Tipo
    var datafillFilters = (data,cb)=> {
      
      var result = {"cities":[],"types":[]}
      
      for (var p = 0; p < data.length ; p++ ){
        if(result['cities'].indexOf(data[p]['Ciudad']) <= -1){
          result['cities'].push(data[p]['Ciudad'])
        }

        if(result['types'].indexOf(data[p]['Tipo']) <= -1){
          result['types'].push(data[p]['Tipo'])
        }
      }
      cb(result) 
    }

    // Busqueda de informacion en el archivo data
    Storage.getData('data')
           .then((buildings)=>{
              datafillFilters(buildings,(result)=>{
                  res.json(result)
              })
           }).catch((err)=>{
            res.sendStatus(500).json(err)
           })
})


module.exports = router;