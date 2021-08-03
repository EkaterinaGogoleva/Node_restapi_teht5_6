/*
Controller cделан для лучшей архитектуры приложения
Reitit ja tietokantahakujen sovelluslogikka on erotettu toisistaan
*/
//haetaan model
const Student = require('../models/Student');

//tietokannan käsittelymetodit tehdään olion sisään
const StudentController = {
  //1. findAll-metodi hakee kaikki opiskelijat
  findAll: (req, res) => {
    Student.find((error, students) => {
      if (error) {
        throw error;
      }
      res.json(students);
    });
  },

  //2. findById hakee opiskelija ID-n perustella

  findById: (req, res) => {
    //findOne argumentit: hakukriteeri eli id:tä vastaava id saadan clientiltä,
    // callback, jolla saadan tieto
    Student.findOne({ _id: req.params.id }, (error, student) => {
      if (error) {
        throw error;
      }
      res.json(student);
    });
  },

  //3. Yhden opiskelijan haku opiskelijanumeron perusteella
  findByScode: (req, res) => {
    //findOne argumentit: hakukriteeri eli id:tä vastaava id saadan clientiltä,
    // callback, jolla saadan tieto
    Student.findOne({ studentcode: req.params.scode }, (error, student) => {
      if (error) {
        throw error;
      }
      res.json(student);
    });
  },

  //4. add-metodi lisää kaikki opiskelijat
  add: (req, res) => {
    /*postmanissa kirjoitettaan lähetyskenttään uusi opiskelija
req.body-ssa saadaan backendiin lähetetty opiskelija
Saadusta opiskelija+oliosta tehdään Student-model mukainen
ja se lisätään kantaan
*/
    // eslint-disable-next-line new-cap
    const NewStudent = Student(req.body);

    NewStudent.save((error, result) => {
      if (error) {
        throw error;
      }
      console.log('Student added');
      /*Fronted sovellus tarvitsee vastauksen lisäyksen onnistumisesta
      JSON-muodossa. Esim Angularin subskribe odottaa saavansa JSON-muotoisen
      tuloksen jonka se käsittelee
      res.send("Student added"). */
      // res.send('Student added'); Tämä kelpaa kyllä Postmannille
      res.json(result); //Angular vaati tämän
    });
  },

  //5. opiskelijan poisto
  deleteStudent: (req, res) => {
    //deleteOne argumentit: hakukriteeri eli id:tä vastaava id saadan clientiltä,
    // callback, jolla saadan tieto
    Student.deleteOne({ _id: req.params.id }, (error, result) => {
      if (error) {
        throw error;
      }
      //res.send('student deleted');
      res.json(result);
    });
  },

  /*6. Opiskelijan muokkaus. */

  updateStudent: (req, res) => {
    //  findOneAndUpdate argumentit: hakukriteeri olioissa,
    // callback, jolla saadan tieto
    //$-merkki viittaa edelliseen hakukriteeriin
    //изменяется весь объект grades, поэтому необходимо писать все составляющие объекта
    Student.findOneAndUpdate(
      { studentcode: req.params.scode },
      { $set: req.body },
      { new: true },
      (error, result) => {
        if (error) {
          throw error;
        }
        //res.send('Student update');
        res.json(result);
      }
    );
  },

  //7. Niiden opiskelijoiden haku joilla on
  //opintopisteitä alle url-osoitteessa lähetetyn arvon.
  findBySpoints: (req, res) => {
    Student.find(
      { studypoints: { $lt: req.params.spoints } },
      (error, students) => {
        if (error) {
          throw error;
        }
        res.json(students);
      }
    );
  },
  /*
  8) Uuden arvosanan lisäys
  opiskelijalle ja samalla opintopisteiden lisäys viidellä.
   */
  addGrade: (req, res) => {
    /*Lisätään studentcoden perustella opiskelijalle uusi grade
    eli olio jossa on kurssin nimi ja arvosana. Lisäksi lisätään
    opiskelijan opintopisteita viidellä
     */
    Student.findOneAndUpdate(
      { studentcode: req.params.scode }, //opiskelijan valinta
      {
        $push: { grades: req.body }, //toimenpide, добавляем в объект grades данные из body
        $inc: { studypoints: 5 },
      }, //прибавляем 5 opintopistetta
      (error, result) => {
        if (error) {
          throw error;
        }
        // res.send('New grade added');
        res.json(result);
      }
    );
  },

  //9. valitaan tietyen opiskelijan tietty kurssi opiskeljatunnuksen ja
  //kurssitunnuksen perustella ja muokataan kurssin arvosana
  //clientin lähettämään tiedon mukaiseksi
  //(saadan req.bodyssa)

  updateGrade: (req, res) => {
    //  findOneAndUpdate argumentit: hakukriteeri olioissa,
    // callback, jolla saadan tieto
    //$-merkki viittaa edelliseen hakukriteeriin
    //изменяется весь объект grades, поэтому необходимо писать все составляющие объекта
    Student.findOneAndUpdate(
      { 'studentcode': req.params.scode, 'grades.coursecode': req.params.ccode },
      { $set: { 'grades.$': req.body } },
      (error, result) => {
        if (error) {
          throw error;
        }
        // res.send('Grade update');
        res.json(result);
      }
    );
  },

  //10) Niiden opiskelijoiden haku joilla on tietty kurssi

  findByCcode: (req, res) => {
    Student.aggregate([
      { $unwind: '$grades' },
      {
        $match: {
          'grades.coursecode': req.params.ccode,
        },
      },
    ]).exec(function (error, students) {
      if (error) {
        throw error;
      }
      res.json(students);
    });
  },
};

module.exports = StudentController;
