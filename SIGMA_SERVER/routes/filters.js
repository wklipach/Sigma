var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_load_init) {
      const result = await asyncLoadInit();
      res.send(result);
    }

    if (req.query.get_filters) {
      const result = await asyncFilters();
      res.send(result);
    }

  });


  router.post('/', async function(req, res) {

    if (req.body['itisInsertFilter']) {
      const result = await asyncInsertFilter
                          (req.body['filterName'], 
                           req.body['field1'], req.body['value1'], 
                           req.body['field2'], req.body['value2'],
                           req.body['dateBegin'], req.body['dateEnd'],
                           req.body['id_user']);
      res.send(result);
     }

    });  


    async function asyncInsertFilter(filterName, field1, value1, field2, value2, dateBegin, dateEnd, id_user) {
      let conn = await pool.getConnection();
      try {
         console.log(filterName, field1, value1, field2, value2, dateBegin, dateEnd, id_user);

         const params = [filterName, field1, value1, field2, value2, dateBegin, dateEnd, id_user];
         const sInsertFilter = 
         " insert filters (name, field1, value1, field2, value2, dateBegin, dateEnd, id_user, dateCreate) "+
         " value(?,?,?,?,?,?,?,?, now())";

          const resInsertFilter = await conn.query(sInsertFilter, params);
          return JSON.stringify(resInsertFilter);
        } catch (err) {
          return  err;
        } finally  {
            if (conn) conn.release(); 
      }
    }  


  async function asyncLoadInit() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT * FROM guide_filters order by `column_display` asc";

        console.log('sQuery=',sQuery);
        const resLoadInit = await conn.query(sQuery);
        return JSON.stringify(resLoadInit);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncFilters() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT * FROM filters where bitDelete=0 order by `name` asc";
        console.log('sQuery=',sQuery);
        const resLoadInit = await conn.query(sQuery);
        return JSON.stringify(resLoadInit);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  module.exports = router;