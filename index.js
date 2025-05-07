require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
     Person.find({}).then(people => {
        response.json(people)
    })
    .catch(error => {
        console.error(error);
        res.status(500).end();
      });
})

app.get('/info', (request, response) => {
    const entries = people.length
    const currentTime = new Date()

response.send(`<p>Phonebook has info for ${entries} people</p>
                <p>${currentTime}</p>`)
})

app.get('/api/persons/:id', (request, respone) => {
    const id = request.params.id
    const person = people.find(person => person.id === id)

    if(!person) {
        return respone.status(404).send({error: 'Person not found'})
    }

    respone.json(person)
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(() => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({error: 'name or number is missing'})
    }


    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
