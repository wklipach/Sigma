var express = require('express');
var router = express.Router();

// const mariadb = require("mariadb");
// const mariadbSettings =  require('../DB');
// const pool = mariadb.createPool(mariadbSettings);



/* GET home page. */
router.get('/', async function(req, res, next) {

 //res.render('index', { title: 'Express' });
 res.sendFile(__dirname + '/index.html');
 
});


/*

async function asyncSelectTest() {

  let conn = await pool.getConnection();
  try {
     const resTest = await conn.query("SELECT id, name FROM test");
     return JSON.stringify(resTest);
    } catch (err) {
      return  err;
    } finally  {
        if (conn) conn.release(); 
  }
  
}

*/


module.exports = router;
