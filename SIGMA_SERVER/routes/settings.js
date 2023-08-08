var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const sqlStringSettings = require("../sql_query/query_settings.js");      


const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_current_settings) {
      const result = await asyncCurSettings(req.query.get_current_settings);
      res.send(result);
    }
 
  });



  async function asyncCurSettings(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery =sqlStringSettings;
        const params = [id_staff];

        console.log(sQuery, params)

        const resStringSettings = await conn.query(sQuery, params);            

        return  JSON.stringify(resStringSettings);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  module.exports = router;