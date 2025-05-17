const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error.message))

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: [3, 'Name must be at least 3 characters long'],
      required: [true, 'Name is required'],
    },
    number: {
      type: String,
      required: [true, 'Number is required'],
    },
  })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

const Person = mongoose.model('Person', personSchema)

module.exports = Person