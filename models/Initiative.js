const {Schema, model} = require('mongoose')

const initiativeSchema = new Schema({
   initiative: String
    // general_info: {
    //     name: Boolean,
    //     last_name:  Boolean,
    //     birthdate:  Boolean,
    //     email: Boolean
    // },
    // comercial_info: {
    //     company_name: Boolean,
    //     term_and_conditions: Boolean,
    //     send_products: Boolean,
    //     web: Boolean
    // },
    // fiscal_info:{
    //     rfc: Boolean,
    //     activity: Boolean,
    //     company_name: Boolean,
    //     address:{
    //         street: Boolean,
    //         number: Boolean,
    //         city: Boolean,
    //         zip_code: Boolean,
    //    }
    //}
})

initiativeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

 const Initiative = model('Initiative', initiativeSchema)

 module.exports = Initiative

 //  Initiative.find({}).then(result => {
//      console.log(result)
//      mongoose.connection.close()
//  })

// const initiative = new Initiative({
//     name: "risks"
// })

// initiative.save()
// .then(result => {
//     //result me devuelve el objeto que se guardo en la db
//     console.log(result)
//     mongoose.connection.close()
// })
// .catch(err => {
//     console.log(err)
// })