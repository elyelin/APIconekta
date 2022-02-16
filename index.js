require('dotenv').config()
require('./mongo')
const express = require('express')
const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')
const app = express()
const Initiative = require('./models/Initiative')

app.use(express.json())

app.get('/', (request, response) => {
    //peticion de tipo get con el path "/" 
    response.send('<h1>Conekta</h1>')
})
app.get('/api/initiatives', (request, response) =>{
    //va a devolver un json. con todos los objetos que tengamos guardados
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
        if(initiative){
            return response.json(initiative)
        }else {
            response.status(404).end()
        }
    }).catch(err => next(err))
   // response.send(name)
})
//create a new initiative
app.post('/api/initiative', (request, response) => {
   // Un endpoint para dar de alta la iniciativa con el acceso a las propiedades solicitadas.
   //UNA INICIATIVA NO PUEDE REPETIRSE
   //Al dar de alta una iniciativ , se le puede dar de alta a un nodo completo o a campos particulares.
   const noteR = request.body
    console.log(noteR.initiative)
    
     if(!noteR.initiative){
         return response.status(400).json({
             error: 'required "initiative" field is missing'
         })
     }

    //if(noteR.initiative !== de vacio, dame todos los campos)
    // if(noteR.initiative.keys()){
    //     console.log("el if esta ok")
    //     console.log(noteR.initiative)
    // }else {
    //     console.log("se fue por el else")
    //     console.log(noteR.initiative)
    // }

   const init = new Initiative ({   
      //  property: general_info,
        // access_key: name, last_name, email
        initiative: noteR.initiative
        //last_name: typeof noteR.last_name !== 'undefined' ? noteR.last_name : false,     
   })
     //agregamos la nueva nota a las otras notas
     init.save().then(savedInitiative => { 
         response.json(savedInitiative)
        })  
})
//update
app.put('/api/initiative/:initiative', (request, response, next) => {
    const { name } = request.params
    const init = request.body
console.log(name)
console.log(init)
    const newInitInfo = {
        initiative: init.initiative
    }

    Initiative.findByIdAndUpdate(name, newInitInfo, { new: true})
    .then(result => {
        response.json(result)
        console.log(result)
    })
})
//quiero y necesito hacer una funcion que me valide si tiene permisos para los campos que pide

//middleware
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
