require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/note');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note => {
    if(note) {
      response.json(note)
    }else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

/*const generateID =() => {

  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  :0  
  return maxId + 1
}*/

app.post('/api/notes', (request, response, next) => {
 
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json ({
      error: ' content missing!'
    })
  }
  
  const note = new Note ({
    content: body.content,
    important: Boolean(body.important) || false, //default set to false if no value
    
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(next)
})
app.put('/api/notes/:id', (req, res, next) => {
  const {content, important}= req.body 

  Note. findByIdAndUpdate(req.params.id, {content, important}, {new: true, runValidators: true, context: 'query'})
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (req,res,next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(ressult => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' });
};

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
