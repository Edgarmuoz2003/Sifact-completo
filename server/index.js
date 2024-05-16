const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { mongoose } = require('./database');

const app = express();

// configuraciones
app.set('port', process.env.PORT || 3000);

// Midlewares
app.use(cors({
    origin: 'http://localhost:3001'
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', require('./routes/empleados.routes'));
app.use('/api', require('./routes/login.routes'));
app.use('/api', require('./routes/clientes.routes'));
app.use('/api', require('./routes/productos.routes'));
app.use('/api', require('./routes/factura.routes'));
app.use('/api/config', require('./routes/config.routes'));

// Configuracion puerto de escucha para todas las interfaces de red
app.listen(app.get('port'), '0.0.0.0', () => {
    console.log('Servidor activo en el puerto', app.get('port'));
});
