var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

/*
1. Status 200.
2. The result should be in json format
3. The result should be an array.
4. The car_description database is empty, presumed the length equal to 0
*/

describe('GET /api/cars', ()=>{
   it('Should return all cars',(done)=>{
       chai.request(server)
           .get('/api/cars')
           .end((err,res)=>{
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('array');
               res.body.length.should.be.eql(0);
               done();
           });
   });
});

/*
 1. Status 200.
 2. The result should be in json format
 3. The result should be an object.
 4. The body should have Success property
 5. Success status should be true
 6. body should have property data
 7. data should have property id , make , color
 8. make = make , color = color , id = id
*/
describe('GET /api/cars/:id', ()=> {
    it('should list a SINGLE car on /api/cars/<id> GET', (done) =>{
            const chaiRequest = chai.request(server);
            chaiRequest.post('/api/cars')
                .send({'make':'Toyota', 'color':'white'})
                .end((err, postResult)=>{
                    chaiRequest.get('/api/cars/' +postResult.body.data.id)
                        .end((err,res)=>{
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.should.have.property('SUCCESS');
                            res.body.data[0].should.have.property('id');
                            res.body.data[0].should.have.property('make');
                            res.body.data[0].should.have.property('color');
                            res.body.data[0].make.should.equal('Toyota');
                            res.body.data[0].color.should.equal('white');
                            res.body.data[0].id.should.equal(postResult.body.data.id);
                        });
                    done();
                });
    });
});


/*
 1. Status 200.
 2. The result should be in json format
 3. The result should be an object.
 4. The body should have Success property
 5. Success status should be true
 6. body should have property data
 7. data should have property id , make , color
 */

describe('POST /api/cars', ()=>{
    it('It should not add a car without make field', (done) => {
        chai.request(server)
            .post('/api/cars')
            .send({'color':'black'})
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('column');
                res.body.errors.column.should.equal('make');
                done();
            });
    });
    it('Should add a single car',(done)=>{
        chai.request(server)
            .post('/api/cars')
            .send({'make':'Audi', 'color':'black'})
            .end((err,res)=>{
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.should.have.property('id');
                res.body.data.should.have.property('make');
                res.body.data.should.have.property('color');
                // test the values
                res.body.data.make.should.equal('Audi');
                res.body.data.color.should.equal('black');
                done();
            });
    });

});



