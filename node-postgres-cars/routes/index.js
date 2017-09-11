const express = require('express');
const router = express.Router();
const db = require('../models/database');
const bodyParser = require('body-parser');

const index = express();
index.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

/* Connect to DB. */
db.connect();

/* GET all cars. */
router.get('/api/cars',(req,res,next) =>{
    db.getAllCars(req,res,next);
});

/* GET car by it ID. */
router.get('/api/cars/:id',(req,res,next)=>{
   db.getCarById(req,res,next);
});

/* POST a car to DB. */
router.post('/api/cars',(req,res,next)=>{
    db.createCar(req,res,next);
});

module.exports = router;
