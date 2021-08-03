const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/*Хорошая практика, когда все коды, работающие с БД
находятся в своей папке (conrollers), которую данный роутер использует*/
const StudentController = require('../controllers/studentcontroller');
const authorize = require('../verifytoken'); // authorisointi eli vahvistetaan token

//Все рейтит через которые можно изменять БД защищены

/*************************************************************/

/*1. http://localhost:3000/students/ */
router.get('/', StudentController.findAll);

/* 2. http://localhost:3000/students/idnumerotähän
: reitissä tarkoittaa muttuja jonka arvo voi vaihtuu */
router.get('/:id', StudentController.findById);

/* 3. http://localhost:3000/students/stunentnumerotähän
: reitissä tarkoittaa muttuja jonka arvo voi vaihtuu */
router.get('/findbyopnum/:scode', StudentController.findByScode);

//4. POST http://localhost:3000/students/
//opiskelijan lisäys
//authorize -означает, что добавить студета может только авторизованный пользователь
router.post('/', authorize, StudentController.add);

//5. opiskelijan poisto
//http://localhost:3000/students/idnumerotähän
router.delete('/:id', authorize, StudentController.deleteStudent);

//6. student update
//http://localhost:3000/students/idnumerotähän
//В body надо писать весь объект студента кроме объекта
router.put('/updatestudent/:scode', authorize, StudentController.updateStudent);

//7) Niiden opiskelijoiden haku joilla on opintopisteitä alle url-osoitteessa lähetetyn arvon

router.get('/opalle/:spoints', StudentController.findBySpoints);

//8) Uuden arvosanan lisäys opiskelijalle ja samalla opintopisteiden lisäys viidellä.
router.put('/addgrade/:scode', authorize, StudentController.addGrade);

// http://localhost:3000/students/updategrade/idnumerotähän/kurssinumero
//9. arvosanan muokkaus
router.put('/updategrade/:scode/:ccode', authorize, StudentController.updateGrade);

//10) Niiden opiskelijoiden haku joilla on tietty kurssi

router.get('/coursecode/:ccode', StudentController.findByCcode);

module.exports = router;
