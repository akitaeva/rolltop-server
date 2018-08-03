const mongoose = require('mongoose');  //abstracting mongodb operations
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email:    {type: String, required: true},
  //features: {type: Array, default:[]} (ORIGINAL (A))
  features: Array //(JM TEST) "Push 2D Arrays ['Feature Name' , [Array full of item ID's] ]" 
  /*
    console.log(theUser.features[Feature slab][Feature Name, Feature ObjId Array][Individual Ids]); 

  */
},
{
  usePushEach : true
},
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
