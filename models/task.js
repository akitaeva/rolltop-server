const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const taskSchema = new Schema({
    action:        {type: String, required: true},
    dueTime:            {type: Date, required: true},
    orderNumber:        {type: Number},
    completed:          {type: Boolean, default: false},
    }, 
    {
        usePushEach: true
    },
    {
        timestamps: true
  });

  const Task = mongoose.model("Task", taskSchema);
  module.exports = Task; 