var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);



/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_tabel) {
      const result = await asyncTabel();
      res.send(result);
    }
 
  });


  
  async function asyncTabel() {


    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "select so.id, "+
        "so.id_object, "+
        "  so.id_staff, "+
        "  s.fio, "+
        "  po.name as object_name, "+
        "  so.DateBegin, "+
        "  so.DateEnd  "+
        "from staff_object so "+
        "left join staff s on s.id_staff = so.id_staff "+
        "left join protected_object po on po.id_object = so.id_object "+
        "order by s.fio";

        const resOne = await conn.query(sQuery);
        return JSON.stringify(resOne);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  
  }




module.exports = router;