
const mongoose = require('mongoose');

//создаем схему. Схема определяет форму данных в БД.
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isadmin: {type: Boolean, required: true},
});
//Tehdään skeemasta model
const User = mongoose.model('User', UserSchema);
//exportetaan model, jolloin sitä voi heti käyttää mongoose+metodien luontiin
module.exports = User;