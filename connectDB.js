const mongoose = require('mongoose');
const dataBase = mongoose.connect('data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, (err, res) => {
    if (err) return console.log('hubo un error:',err);
    console.log('Base de Datos online')
  }
  );
