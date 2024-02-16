const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { mongoose } = require('./database');

const app = express();

//configuraciones
app.set('port', process.env.PORT || 3000);

//Midlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', require('./routes/empleados.routes'));



//Configuracion puerto de escucha
app.listen(app.get('port'), () => {
    console.log('Server activo en el puerto', app.get('port'))
});