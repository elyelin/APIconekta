require('dotenv').config()
require('./mongo')
const express = require('express')
const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')
const app = express()
const Initiative = require('./models/Initiative')

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Conekta</h1>')
})
app.get('/api/initiatives', (request, response) =>{
    //Un endpoint que retorne todas las iniciativas con los campos a los que tienen acceso.
    Initiative.find({}).then(initiatives => {
            response.json(initiatives)
    })
})
//recibe un nombre para retornar el objeto con ese id
app.get('/api/initiative/:initiative', (request, response, next) => {
    //- Un endpoint para consultar los campos a los que tiene acceso por iniciativa
//{base-ulr]/permission/:initiative
    const { name } = request.params

    Initiative.findById(name)
    .then(initiative => {
        return initiative 
        ? response.json(initiative)
        : response.status(404).end()
    }).catch(err => next(err))
})
//create a new initiative
app.post('/api/initiatives', (request, response, next) => {
   // Un endpoint para dar de alta la iniciativa con el acceso a las propiedades solicitadas.
   //UNA INICIATIVA NO PUEDE REPETIRSE
   //Al dar de alta una iniciativ , se le puede dar de alta a un nodo completo o a campos particulares.
   const noteR = request.body
    
     if(!noteR.initiative){
         return response.status(400).json({
             error: 'required "initiative" field is missing'
         })
     }
   console.log(noteR)
   const init = new Initiative ({   
        initiative: noteR.initiative,

        //last_name: typeof noteR.last_name !== 'undefined' ? noteR.last_name : false,     
        general_info: {
            name: noteR.general_info.name,
            last_name: typeof noteR.general_info.last_name !== 'undefined' ? noteR.general_info.last_name : false,
            birthdate:  noteR.general_info.birthdate,
            email:  noteR.general_info.email
        }
   })
     init.save().then(savedInitiative => { 
         response.json(savedInitiative)
         console.log(savedInitiative)
        }).catch(err => next(err))
})
//update
app.put('/api/initiative/:initiative', (request, response, next) => {
    //const {name}  = request.params
    const name  = request.params
    const init = request.body

    const newInitInfo = {
        initiative: init.initiative
    }

    Initiative.findByIdAndUpdate(name, newInitInfo, { new: true})
    .then(result => {
        response.json(result)
    }).catch(err => next(err))
})

//middleware
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
//quiero y necesito hacer una funcion que me valide si tiene permisos para los campos que pide