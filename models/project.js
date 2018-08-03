const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const projectSchema = new Schema({
    title:        {type: String, required: true},
    tasks:        [{type: Schema.Types.ObjectId, ref: 'Task'}], 
    description:  {type: String},
    closed:       {type: Boolean, default: false}
    //owner:        {type: Schema.Types.ObjectId, ref: 'User'}
    }, 
    {
        usePushEach: true
    },
    {
        timestamps: true
  });

  const Project = mongoose.model("Project", projectSchema);
  module.exports = Project; 