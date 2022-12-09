

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

//Crear el servidor express

const app = express();

//base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio publico
app.use(express.static('public'))

//Lectura y oarseo del body
app.use( express.json() )

//Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))




app.listen(  process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ 4000}`)
})