const express = require("express");
const placeRoutes = express.Router();
const Place = require("../../models/favPlace");
const User       = require('../../models/user');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyDg8RJxITThryFICnALvvijIyvMl8TYgjg', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
const geocoder = NodeGeocoder(options);

// Gets places (Works)
placeRoutes.get('/places', (req, res, next) => {

    if(req.user === undefined){
        return res.json("Not logged in");
    }

    User.findById(req.user.id)
    .then((user)=>{
        const noteIdArray =  user.features[2][1];
        let resultJson = "";
        //console.log(noteIdArray);
        Place.find({
            '_id': { $in: noteIdArray}
        }, function(err, docs){
             console.log("Done");
             return res.json(docs);
        });
    })
    .catch((err)=>{
        console.log("Error User");
        next(err);
    });
  });


// Add Place to User (WORKS)  
placeRoutes.post('/places', (req, res, next) => {

    if(req.user === undefined){
        return res.json("Not logged in");
    }
  
    Place.create({
      name:   req.body.name,
      category: req.body.category,
      phoneNumber: req.body.phoneNumber,
    //   address: req.body.address, 
      notes: req.body.notes
    })
    .then((response)=>{
        //console.log("In then " + req.user.id);
        User.findById(req.user.id)
        .then((user)=>{
            console.log("Pushing note into user");
            console.log("Features before: " ,user.features);

            const blah = user.features;
            blah[2][1].push(response.id);
            user.features = [];
            user.features = blah;

            user.save()
            .then((response)=>{
                console.log("Resposne after " , response.features);
            })
            .catch(err => {
                console.log("unable to save to database");
            });

        })
        .catch((err)=>{
            console.log("Error User");
            next(err);
        })

        res.json(response);
    })
    .catch((err)=>{
        console.log("Error Note");
        res.json(err);
    })
});

// Edit not needed, can use /places/:placeId
/*placeRoutes.get('/places/:placeId/edit', (req, res, next) => {
    Place.findById(req.params.placeId)
    .then((place)=>{
        res.status(200).json(place)
    })
    .catch(err=>next(err));
   });*/
   
   
//saving the updated task (WORKS)
placeRoutes.post('/places/:placeId/update',(req, res, next) => {

    if(req.user === undefined){
        return res.json("Not logged in");
    }
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

// Route to delete Places (WORKS)
placeRoutes.post('/places/:placeId/delete', (req, res, next)=>{
    /*const id = req.params.placeId;
    Place.findByIdAndRemove(id)
    .then(() =>{
        res.status(200).json({ message: 'The place entry has been deleted' })
    })
    .catch(err => console.log("Error while deleting the place entry", err))*/

    if(req.user === undefined){
        return res.json("Not logged in");
    }

    User.findById(req.user.id)
    .then((user)=>{
        console.log("Delete");
        //console.log("Features before: " , user.features);

        const blah = user.features;
        console.log(blah);
        blah[2][1] = blah[2][1].filter(e => e !== req.params.placeId); 
        console.log(blah);
        user.features = [];
        user.features = blah;

        user.save()
        .then((response)=>{
            console.log("Resposne after " , response.features);

            Place.findByIdAndRemove(req.params.placeId)
            .then((response) =>{
                res.json(response);
            })
            .catch((err)=>{
                res.json(err);
            });

        })
        .catch(err => {
            console.log("unable to save to database");
        });

    })
    .catch((err)=>{
        console.log("Error User");
        next(err);
    })
}); 

//Get Place (WORKS)
placeRoutes.get('/places/:id', (req, res, next) => {

    if(req.user === undefined){
        return res.json("Not logged in");
    }

    Place.findById(req.params.id, (err, place) => {
        if (err) { return res.json(err).status(500); }
    
        return res.json(place);
      });
});
   

module.exports = placeRoutes;