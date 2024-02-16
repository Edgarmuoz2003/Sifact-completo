const mongoose = require('mongoose');
const URI = 'mongodb://localhost/bd-sifact';

mongoose.connect(URI)
.then(bd => console.log('DB is connected'))
.catch(err => console.log(err))
module.exports = mongoose;