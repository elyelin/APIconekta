require("dotenv").config();
require("./mongo");
const express = require("express");
const cors = requiere('cors')
const handleErrors = require("./middleware/handleErrors");
const notFound = require("./middleware/notFound");
const app = express();
const Initiative = require("./models/Initiative");
app.use(cors())
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ api: "Conekta" });
});

//return all
app.get("/api/initiatives", (request, response) => {
  Initiative.find({}).then((initiatives) => {
    response.json(initiatives);
  });
});

//search
app.get("/api/permission/:initiative", (request, response, next) => {
  //- Un endpoint para consultar los campos a los que tiene acceso por iniciativa
  const { initiative } = request.params;

  Initiative.findOne({ initiative })
    .then((initiative) => {
      return initiative
        ? response.json(initiative)
        : response.status(404).end();
    })
    .catch((err) => next(err));
});

//create a new initiative
app.post("/api/initiatives", async (request, response, next) => {
  //Al dar de alta una iniciativa , se le puede dar de alta a un nodo completo o a campos particulares.
  const initiative = request.body;

  if (!initiative.initiative) {
    return response.status(400).json({
      error: 'required "initiative" field is missing',
    });
  }

  const data = await Initiative.findOne({
    initiative: initiative.initiative,
  }).exec();
  console.log(data);
  if (data) {
    console.log("entro");
    return response.status(400).json({
      error: true,
      message: "duplicate initiative",
    });
  }

  const init = new Initiative({
    initiative: initiative.initiative,

    general_info: {
      name: initiative.general_info.name,
      last_name: typeof !initiative.general_info.last_name
        ? initiative.general_info.last_name
        : false,
      birthdate: initiative.general_info.birthdate,
      email: initiative.general_info.email,
    },
    comercial_info: {
      company_name: initiative.comercial_info.company_name,
      term_and_conditions: initiative.comercial_info.term_and_conditions,
      send_products: initiative.comercial_info.send_products,
      web: initiative.comercial_info.web,
    },
    fiscal_info: {
      rfc: initiative.fiscal_info.rfc,
      activity: initiative.fiscal_info.activity,
      company_name: initiative.fiscal_info.company_name,
      address: {
        street: initiative.fiscal_info.address.street,
        number: initiative.fiscal_info.address.number,
        city: initiative.fiscal_info.address.city,
        zip_code: initiative.fiscal_info.address.zip_code,
      },
    },
  });
  init
    .save()
    .then((savedInitiative) => {
      response.json(savedInitiative);
    })
    .catch((err) => next(err));
});
//update
app.put("/api/initiatives/:initiative", async (request, response, next) => {
  const { initiative } = request.params;
  const newInitiative = request.body;

  const data = await Initiative.findOne({ initiative: initiative }).exec();
  console.log(data);
  if (!data) {
    console.log("entro");
    return response.status(404).json({
      error: true,
      message: " initiative not found",
    });
  }

  Initiative.findByIdAndUpdate(data._id, newInitiative, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((err) => next(err));
});

//middleware
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
