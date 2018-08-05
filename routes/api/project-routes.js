const express = require("express");
var mongoose = require('mongoose');
const projectRoutes = express.Router();
const Project = require("../../models/project");
const Task = require('../../models/task');
const User       = require('../../models/user');

// Gets all projects
projectRoutes.get('/projects', (req, res, next) => {
    User.findById(req.user.id)
        .then((user)=>{
            const noteIdArray =  user.features[1][1];
            let resultJson = "";
            console.log(noteIdArray);
            Project.find({
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


// Make new Project (TODO: Replace id with)
projectRoutes.post('/projects', (req, res, next) => {
    Project.create({
        title: req.body.title,
        tasks: [],
        description: req.body.description
    })
    .then((response)=>{
        User.findById(req.user.id)
        .then((user)=>{
            console.log("Pushing note into user");
            console.log("Features before: " ,user.features);

            const blah = user.features;
            blah[1][1].push(response.id);
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
        console.log("Error Project", err);
        res.json(err);
    })
});

// Update Full Project by ID (JM) (DONE) (Notes: Might have to add explicit update functions for things like "closed")
projectRoutes.post('/projects/:projectId/update',(req, res, next) => {
    
    const pId =          req.params.projectId;
    const title  =       req.body.title;
    const description =  req.body.description;
    const closed =       req.body.title;
 
    Project.findById(pId)
        .then((project) =>{
            project.title = title;
            project.description = description;
            project.closed = closed;

            project.save()
                .then((response)=>{
                    res.json(response);
                })
        })
    .catch((err)=>{
        res.json(err);
    })  
});       

// Delete Project from DB and User Features sctructure <PRJ> 
projectRoutes.post('/projects/:id/delete', (req, res, next)=>{

    User.findById(req.user.id)
    .then((user)=>{
        console.log("Delete");
        console.log("Features before: " , user.features);

        const blah = user.features;
        blah[1][1] = blah[1][1].filter(e => e !== req.params.id); 
        user.features = [];
        user.features = blah;

        user.save()
        .then((response)=>{
            console.log("Resposne after " , response.features);

            Project.findByIdAndRemove(req.params.id)
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


// ------ Task Routes -------

projectRoutes.post('/projects/:id/add-task', (req, res, next) => {
    const newTask = {
        action: req.body.action,
        dueTime: req.body.dueTime,
        orderNumber: req.body.orderNumber 
    }
    
    Task.create(newTask)
    .then( newTask => {
        Project.findById(req.params.id)
        .then( foundProject => {
            foundProject.tasks.push(newTask);
            foundProject.save()
            .then( project => res.status(200).json(project))
            .catch(err=>next(err))
        })
        .catch(err=>next(err))
    })
    .catch( err => next(err))
    
}) 

// Edit task by id
projectRoutes.post('/tasks/:id/edit-task', (req, res, next) => {
    const pId =            req.params.id;
    const action  =        req.body.action;
    const dueTime  =       req.body.dueTime;
    const orderNumber =    req.body.orderNumber;
    const completed =      req.body.complete;
 
    Task.findById(pId)
        .then((task) =>{
            console.log(task);
            task.action  =        action;
            task.dueTime  =       dueTime;
            task.orderNumber =    orderNumber;
            task.completed =      completed;
//meow, jessica was here!
            task.save()
                .then((response)=>{
                    res.json(response);
                })
        })
    .catch((err)=>{
        res.json(err);
    })  
    
}) 

//(TODO: Project.filter for some reason is not working )
projectRoutes.post('/project/:id/delete-task', (req, res, next) => {

    Project.findById(req.user.id)
    .then((project)=> {
        console.log(req.params.id);
        console.log(project.tasks);
        project.tasks = project.tasks.filter(e => e !== mongoose.Types.ObjectId(req.params.id));
        console.log(project.tasks);
        /*Task.findByIdAndRemove(req.params.id)
        .then((response) =>{
            res.json(response);
            })
        .catch((err)=>{
            console.log(err);
            res.json(err);
        });*/
    })
    .catch((err)=>{
        console.log(err);
        next(err);
    });


}) 
   

module.exports = projectRoutes;