const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const userCon = require('../controllers/UserController'); // user-reittien kontrolleri

//käyttäjän login ja registroitymisreitit tulevat tähän

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// rekisteröityminen eli luodaan uudelle käyttäjän tunnarit
//http://localhost:3000/users/register
router.post('/register', userCon.registerUser);
// kirjautuminen eli autentikaatio tunnareilla
router.post('/login', userCon.authenticateUser);

module.exports = router;
