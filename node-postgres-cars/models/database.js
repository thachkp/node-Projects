const pg = require('pg');
const connectionString = process.env.DATABASE_URL;

const client = new pg.Client(connectionString);

/* Create car_description table. */
const seedData = ()=>{
  const query = `
    DROP TABLE IF EXISTS car_description;
    CREATE TABLE car_description(
        id SERIAL PRIMARY KEY,
        make VARCHAR(100) not null,
        color VARCHAR(30));
  `;
  client.query(query, (err,result,next) =>{
     if (err) {
         //return res.status(500).json({SUCCESS: false, data: err});
         return next(err);
     }
  });
};

/* Connect to postgres. */
const connect =() =>{
    client.connect((err, client,next,done)=> {
        if(err){
            done();
            next(err) ;
        }
        //seed the data
        seedData();
    });
};

/* GET all var from database. */
const getAllCars= (req,res,next)=>{
    const result = [];
    client.query('select * from car_description order by id asc',(err,data)=>{
        if(err) {
            next(err);
        }
        data.rows.forEach((row)=>{
            result.push(row);
        });
        res.status(200).json(result);
    });

};
/* Get car by id from database. */
const getCarById =(req,res,next)=>{
    const id = req.params.id;

    client.query(`select * from car_description where id=${id}`,(err,result)=>{
        if(err){
            next(err);
        }else if(result.rows.length === 0){
            next(err);
        }
        res.status(200).json({SUCCESS:true,data:result.rows});
    });

};

/* Post a car to Database. */
const createCar = (req,res, next) =>{
    const result =[];
    const make = req.body.make;
    const color = req.body.color;
    client.query(`INSERT INTO car_description(make,color) values($1,$2)`,[make,color],(err)=>{
        if(err && make === undefined){
            next(err);
        }
        client.query(`select * from car_description order by id asc`, (err,returnData)=>{
            if(err){
                next(err);
            }
            returnData.rows.forEach((row)=>{
               result.push(row);
            });
            res.status(200).json({SUCCESS:true,data:result[result.length-1]});
        });
    });
};


module.exports={
    connect,
    getAllCars,
    createCar,
    getCarById
};