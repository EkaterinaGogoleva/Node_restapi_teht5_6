/*
REST-Apin yksinkertainen perustestaus
Serveri pitää ensin käynnistää komennolla: npm start
Käynnistä serveri ensimmäisessä komentokehotteessa
Sen jälkeen: npm test toisessa komentokehotteessa
Tyhjennä collection ennen testiä jos se sisältää jo
alla olevan Apitesti Opiskelijan.
*/

const chai = require('chai');
const chaihttp = require('chai-http');
const expect = chai.expect;
chai.use(chaihttp);

describe('Testing Server API', () => {
  // Post -reitin testaus
  it('it should post a student from /students', (done) => {
    /*postattava data
        Huomaa että data pitää lähettää JSON-muodossa
        ja JSON vaatii lainausmerkkien käyttöä. ESlint
        valittaa koska se vaatii merkkijonoissa heittomerkin.
        Ongelma korjattu ottamalla sääntö pois käytöstä.
        */
    const apiteststudent = {
      /* eslint quotes: "off" */
      studentcode: 'a1234',
      name: 'Apitesti Opiskelija',
      email: 'a1234@jamk.fi',
      studypoints: 0,
      grades: [
        {
          coursecode: 'HTS10900',
          grade: 0,
        },
      ],
    };

    chai
      .request('http://localhost:3000')
      .post('/students')
      .send(apiteststudent)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        done();
      });
  });

  it('should get students from /students', (done) => {
    chai
      .request('http://localhost:3000')
      .get('/students')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).not.to.be.eql(0);
        expect(res.body[0]).have.a.property('studentcode');
        expect(res.body[0].grades[0]).to.have.property('coursecode');
        done();
      });
  });
});
