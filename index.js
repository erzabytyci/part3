const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let people = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/api/persons', (request, response) => {
  response.json(people)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = people.find(p => p.id === id)

    if (!person) {
      return response.status(404).send({ error: 'Person not found' })
    }

    people = people.filter(person => person.id !== id)

    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({error: 'name or number is missing'})
    }

    const nameExist = people.some(person => person.name === body.name)
    if(nameExist) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000).toString(),
    }

    people = people.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
