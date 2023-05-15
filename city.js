const mongoose = require('mongoose');

// Child Schema
const ChildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

const Child = mongoose.model('Child', ChildSchema);

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  }
});

const User = mongoose.model('User', UserSchema);

// City Schema
const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  population: {
    type: Number,
    required: true
  }
});

const City = mongoose.model('City', CitySchema);

// Create a child document
const child = new Child({
  name: 'John',
  age: 5
});

// Create a city document
const city = new City({
  name: 'New York',
  population: 9000000
});

// Save the child and city documents
child.save((err, savedChild) => {
  if (err) {
    console.error(err);
    return;
  }
  
  // Assign child to a user
  const user = new User({
    name: 'Alice',
    city: city._id,
    child: savedChild._id
  });
  
  // Save the user document
  user.save((err, savedUser) => {
    if (err) {
      console.error(err);
      return;
    }
    
    // Aggregation pipeline to combine data from the User and City collections
    User.aggregate([
      {
        $match: {
          _id: savedUser._id
        }
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: '_id',
          as: 'city'
        }
      },
      {
        $unwind: '$city'
      },
      {
        $lookup: {
          from: 'children',
          localField: 'child',
          foreignField: '_id',
          as: 'child'
        }
      },
      {
        $unwind: '$child'
      }
    ])
    .exec((err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      
      console.log(result);
    });
  });
});