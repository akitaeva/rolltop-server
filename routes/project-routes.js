const express = require("express");
const projectRoutes = express.Router();
const Project = require("../models/project");
const Task = require('../models/task');

projectRoutes.get('/projects', (req, res, next) => {
    Project.find({}, (err, tasks) => {
      if (err) { return res.json(err).status(500); }
  
      return res.json(projects);
    });
  });

projectRoutes.post('/projects', (req, res, next) => {
    const newProject = new Project({  
      title:   req.body.title,
    //   tasks:   req.body.tasks,
      description: req.body.description,
    });

    newProject.save( (err) => {
        if (err){
            return res.status(500).json(err) 
        }
        if (newProject.errors) {
            return res.status(400).json(newProject) 
        }
        return res.json(newProject);
      });
});


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


projectRoutes.get('/projects/:projectId/edit', (req, res, next) => {

   });
   
   
//saving the updated task
projectRoutes.post('/projects/:projectId/update',(req, res, next) => {

   });       

projectRoutes.post('/projects/:projectId/delete', (req, res, next)=>{
    const id = req.params.placeId;
    Place.findByIdAndRemove(id)
    .then(() =>{
        res.status(200).json({ message: 'The project entry has been deleted' })
    })
    .catch(err => console.log("Error while deleting the project entry", err))
}); 

projectRoutes.get('/projects/:projectId', (req, res, next) => {
    const id = req.params.taskId;
    Project.findById(req.params.id, (err, project) => {
      if (err)    {return res.json(err).status(500); }
      if (!entry) {return res.json(err).status(404); }
  
      return res.json(project);
    });
});
   

module.exports = projectRoutes;