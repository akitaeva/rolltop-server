const mongoose = require('mongoose');  //abstracting mongodb operations
const Schema   = mongoose.Schema;

const placeSchema = new Schema({
  name:        {type: String, required: true},
  category:    {type: String, required: true},
  phoneNumber: {type: String},
  address:     {type: String},
  notes:       {type: String}
  //owner:       {type: Schema.Types.ObjectId, ref: 'User'}
}, {
  timestamps: true
});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;