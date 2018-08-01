const mongoose = require('mongoose');  //abstracting mongodb operations
const Schema   = mongoose.Schema;

const placeSchema = new Schema({
  name:        {type: String, required: true},
  category:    {type: String, required: true},
  phoneNumber: {type: String, required: true},
  address:     {type: String, required: true},
  notes:       {type: String},
}, {
  timestamps: true
});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;