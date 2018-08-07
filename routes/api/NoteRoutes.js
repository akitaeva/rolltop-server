const express       = require('express');
const router        = express.Router();
const Note        = require('../../models/Note');
const User       = require('../../models/user');

// Get All Notes (JM) (WORKS)
router.get('/notes', (req, res, next) => {
    User.findById(req.user.id)
        .then((user)=>{
            const noteIdArray =  user.features[0][1];
            let resultJson = "";
            console.log(noteIdArray);
            Note.find({
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

// Post New Note (JM) (WORKS
router.post('/notes', (req, res, next) => {
    
    Note.create({
        title: req.body.title,
        content: req.body.content
    })
    .then((response)=>{
        User.findById(req.user.id)
        .then((user)=>{
            console.log("Pushing note into user");
            console.log("Features before: " ,user.features);

            const blah = user.features;
            blah[0][1].push(response.id);
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

// Get Specific Notes (JM) 
router.get('/notes/:id', (req, res, next) => {
    Note.findById(req.params.id, (err, notes) => {
    if (err) { return res.json(err).status(500); }

    return res.json(notes);
  });
});

//Edit Notes (JM) 
router.post('/notes/:id/update', (req, res, next) => {


  const title = req.body.title;
  const content = req.body.content;
  
  
  Note.findById(req.params.id)
      .then((note)=>{
          note.content = content;
          note.title = title;
          note.save()
              .then((response)=>{
                  res.json(response);
              })
      })
  .catch((err)=>{
      res.json(err);
  })
});

//Delete Notes (JM) (TODO: Add error protection)
router.post('/notes/:id/delete', (req, res, next) => {
    User.findById(req.user.id)
    .then((user)=>{
        console.log("Delete");

        const blah = user.features;
        console.log(blah);
        blah[0][1] = blah[0][1].filter(e => e !== req.params.id); 
        console.log(blah);
        user.features = [];
        user.features = blah;

        user.save()
        .then((response)=>{
            console.log("Resposne after " , response.features);

            Note.findByIdAndRemove(req.params.id)
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

module.exports = router;