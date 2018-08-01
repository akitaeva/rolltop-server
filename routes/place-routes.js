const express = require("express");
const placeRoutes = express.Router();
const Place = require("../models/favPlace");

placeRoutes.get('/places', (req, res, next) => {
    Task.find({}, (err, tasks) => {
      if (err) { return res.json(err).status(500); }
  
      return res.json(tasks);
    });
  });

placeRoutes.post('/places', (req, res, next) => {
    const newPlace = new Place({  
      name:   req.body.name,
      category: req.body.category,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address, 
      notes: req.body.notes
    });

    newPlace.save( (err) => {
        if (err){
            return res.status(500).json(err) 
        }
        if (newPlace.errors) {
            return res.status(400).json(newPlace) 
        }
        return res.json(newPlace);
      });
});


placeRoutes.get('/places/:placeId/edit', (req, res, next) => {
    Place.findById(req.params.placeId)
    .then((place)=>{
        res.status(200).json(place)
    })
    .catch(err=>next(err));
   });
   
   
//saving the updated task
placeRoutes.post('/places/:placeId/update',(req, res, next) => {
       const updPlace = {
           name:        req.body.name,
           category:    req.body.category,
           phoneNumber: req.body.phoneNumber,
           address:     req.body.address,
           notes:       req.body.notes
       }
       Place.findByIdAndUpdate(req.params.placeId, updPlace)
       .then((place)=>{
        res.status(200).json(place)
       })
       .catch(err=>next(err));
   });       

placeRoutes.post('/places/:placeId/delete', (req, res, next)=>{
    const id = req.params.placeId;
    Place.findByIdAndRemove(id)
    .then(() =>{
        res.status(200).json({ message: 'The place entry has been deleted' })
    })
    .catch(err => console.log("Error while deleting the place entry", err))
}); 

placeRoutes.get('/places/:placeId', (req, res, next) => {
    const id = req.params.taskId;
    Task.findById(req.params.id, (err, task) => {
      if (err)    { return res.json(err).status(500); }
      if (!entry) { return res.json(err).status(404); }
  
      return res.json(task);
    });
});
   

module.exports = placeRoutes;