const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (request, response) => {

	if (request.method === 'POST')
		return JSON.stringify(request.body)
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

app.get('/', (request, response) => {

	response.send('<h1>Welcome to phonebook</h1>')
})

app.get('/api/persons', (request, response) => {

	response.json(persons)
})

app.get('/info', (request, response) => {

	const currTime = new Date();
	response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {

	const id = Number(request.params.id)
	const person = persons.find(p => p.id === id)

	if (person) {

		response.json(person)
	} else {

		response.statusMessage = "Person with this id does not exists";
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {

	const id = Number(request.params.id)
	persons = persons.filter(p => p.id !== id)

	response.status(204).end()
})

const generateId = () => {

	return Math.floor(Math.random() * 10000);
}

app.post('/api/persons', (request, response) => {

	const person = request.body

	if (!person.name || !person.number) {
		return response.status(400).json({
			error: `persons ${!person.name ? 'name' : 'number'} missing`
		})
	}

	if (persons.some(p => p.name === person.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

	const newPerson = {id: generateId(), name: person.name, number: person.number}

	persons = persons.concat(newPerson)
	response.json(newPerson)
})

app.put('/api/persons/:id', (request, response) => {
	console.log(request.body)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
